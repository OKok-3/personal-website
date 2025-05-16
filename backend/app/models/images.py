import uuid
from typing import Any, TYPE_CHECKING

from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Integer, String
from sqlalchemy.ext.hybrid import hybrid_property


if TYPE_CHECKING:
    from app.models import Projects

AVAILABLE_TYPES = ["image", "icon", "logo"]


class Images(db.Model):  # noqa: D101
    __tablename__ = "images"

    _id: Mapped[int] = mapped_column(name="id", type_=Integer, primary_key=True)
    _uuid: Mapped[str] = mapped_column(name="uuid", type_=String(36), unique=True)
    _type: Mapped[str] = mapped_column(name="type", type_=String(255))
    projects: Mapped[list["Projects"]] = relationship(back_populates="image")

    def __init__(self, **kwargs):  # noqa: D107
        self._uuid = str(uuid.uuid4())
        super().__init__(**kwargs)

    def __repr__(self) -> str:  # noqa: D105
        return f"<Image(id={self._id}, uuid={self._uuid}, type={self._type})>"

    @hybrid_property
    def id(self) -> int:  # noqa: D102
        return self._id

    @id.setter
    def id(self, _: Any) -> None:  # noqa: D102
        raise AttributeError("ID is read-only")

    @hybrid_property
    def uuid(self) -> str:  # noqa: D102
        return self._uuid

    @uuid.setter
    def uuid(self, _: Any) -> None:  # noqa: D102
        raise AttributeError("UUID is read-only")

    @hybrid_property
    def type(self) -> str:  # noqa: D102
        return self._type

    @type.setter
    def type(self, value: str) -> None:  # noqa: D102
        if not value:
            raise ValueError("Type cannot be empty")

        if value not in AVAILABLE_TYPES:
            raise ValueError(f"Invalid type: {value}. Available types: {AVAILABLE_TYPES}")

        self._type = value
