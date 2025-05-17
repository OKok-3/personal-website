import uuid
from typing import Any, TYPE_CHECKING

from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String
from sqlalchemy.ext.hybrid import hybrid_property


if TYPE_CHECKING:
    from app.models import Projects

AVAILABLE_TYPES = ["image", "icon", "logo"]


class Images(db.Model):  # noqa: D101
    __tablename__ = "images"

    _uuid: Mapped[str] = mapped_column(name="uuid", type_=String(36), primary_key=True)
    _image_type: Mapped[str] = mapped_column(name="type", type_=String(255))
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
        if not value:
            raise ValueError("Type cannot be empty")

        if value not in AVAILABLE_TYPES:
            raise ValueError(f"Invalid type: {value}. Available types: {AVAILABLE_TYPES}")

        self._image_type = value
