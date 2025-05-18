import os
import uuid
from typing import Any

from flask import current_app

from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import String
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import event


class Files(db.Model):
    """Data model used to keep track of files uploaded to the server.

    Attributes:
        uuid: The unique identifier for the file.
        name: The name of the file.
        file_type: The type of the file.
        extension: The extension of the file.
    """

    __tablename__ = "files"

    _uuid: Mapped[str] = mapped_column(name="uuid", type_=String(36), primary_key=True)
    name: Mapped[str] = mapped_column(name="name", type_=String(255))
    _file_type: Mapped[str] = mapped_column(name="file_type", type_=String(255))
    _extension: Mapped[str] = mapped_column(name="extension", type_=String(255))

    def __init__(self, **kwargs):  # noqa: D107
        self._uuid = str(uuid.uuid4())
        self.file_type = kwargs.pop("file_type", None)
        super().__init__(**kwargs)

    def __repr__(self) -> str:  # noqa: D105
        return f"<File(uuid={self._uuid}, name={self.name}, type={self._file_type}, extension={self._extension})>"

    @hybrid_property
    def uuid(self) -> str:  # noqa: D102
        return self._uuid

    @uuid.setter
    def uuid(self, _: Any) -> None:  # noqa: D102
        raise AttributeError("UUID is read-only")

    @hybrid_property
    def file_type(self) -> str:  # noqa: D102
        return self._file_type

    @file_type.setter
    def file_type(self, value: str) -> None:  # noqa: D102
        ALLOWED_FILE_TYPES: list[str] = current_app.config["ALLOWED_FILE_TYPES"]

        if not value:
            raise ValueError("Type cannot be empty")

        if value not in ALLOWED_FILE_TYPES:
            raise ValueError(f"Invalid type: {value}. Available types: {ALLOWED_FILE_TYPES}")

        self._file_type = value

    @hybrid_property
    def extension(self) -> str:  # noqa: D102
        return self._extension

    @extension.setter
    def extension(self, value: str) -> None:  # noqa: D102
        ALLOWED_EXTENSIONS: list[str] = current_app.config["ALLOWED_EXTENSIONS"]

        if not value:
            raise ValueError("Extension cannot be empty")

        if value not in ALLOWED_EXTENSIONS:
            raise ValueError(f"Invalid extension: {value}. Available extensions: {ALLOWED_EXTENSIONS}")

        self._extension = value


def delete_file(mapper, connection, target: Files) -> None:
    """Delete the file from the filesystem."""
    os.remove(
        os.path.join(current_app.config["STATIC_FOLDER"], f"{target._file_type}", f"{target._uuid}.{target._extension}")
    )


# Register the event listener to the Files model
event.listen(Files, "after_delete", delete_file)
