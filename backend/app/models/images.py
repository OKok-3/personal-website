import os
import uuid
from typing import Any, TYPE_CHECKING

from flask import current_app

from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import event


if TYPE_CHECKING:
    from app.models import Projects


class Images(db.Model):  # noqa: D101
    __tablename__ = "images"

    _uuid: Mapped[str] = mapped_column(name="uuid", type_=String(36), primary_key=True)
    _image_type: Mapped[str] = mapped_column(name="type", type_=String(255))
    _extension: Mapped[str] = mapped_column(name="extension", type_=String(255))
    projects: Mapped[list["Projects"]] = relationship(back_populates="image", cascade="all, delete-orphan")

    def __init__(self, **kwargs):  # noqa: D107
        self._uuid = str(uuid.uuid4())
        self.image_type = kwargs.pop("image_type", None)
        super().__init__(**kwargs)

    def __repr__(self) -> str:  # noqa: D105
        return f"<Image(uuid={self._uuid}, type={self._image_type})>"

    @hybrid_property
    def uuid(self) -> str:  # noqa: D102
        return self._uuid

    @uuid.setter
    def uuid(self, _: Any) -> None:  # noqa: D102
        raise AttributeError("UUID is read-only")

    @hybrid_property
    def image_type(self) -> str:  # noqa: D102
        return self._image_type

    @image_type.setter
    def image_type(self, value: str) -> None:  # noqa: D102
        AVAILABLE_TYPES: list[str] = current_app.config["ALLOWED_IMAGE_TYPES"]

        if not value:
            raise ValueError("Type cannot be empty")

        if value not in AVAILABLE_TYPES:
            raise ValueError(f"Invalid type: {value}. Available types: {AVAILABLE_TYPES}")

        self._image_type = value

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


def delete_image(mapper, connection, target: Images) -> None:
    """Delete the image file from the filesystem."""
    os.remove(
        os.path.join(
            current_app.config["STATIC_FOLDER"], f"{target._image_type}s", f"{target._uuid}.{target._extension}"
        )
    )


# Register the event listener to the Images model
event.listen(Images, "after_delete", delete_image)
