import re
import uuid
from typing import Any, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models import Users, Images

from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Integer, String, Boolean
from sqlalchemy import ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates


class Projects(db.Model):  # noqa: D101
    __tablename__ = "projects"

    _id: Mapped[int] = mapped_column(name="id", type_=Integer, primary_key=True)
    _uuid: Mapped[str] = mapped_column(name="uuid", type_=String(36), unique=True)
    is_featured: Mapped[bool] = mapped_column(name="is_featured", type_=Boolean, default=False)
    title: Mapped[str] = mapped_column(name="title", type_=String(255))
    description: Mapped[str] = mapped_column(name="description", type_=String(255))
    _tags: Mapped[list[str]] = mapped_column(name="tags", type_=String(255), nullable=True)
    _link: Mapped[str] = mapped_column(name="link", type_=String(255), nullable=True)
    image_id: Mapped[str] = mapped_column(ForeignKey("images.uuid"), nullable=True)
    image: Mapped["Images"] = relationship(back_populates="projects", cascade="all, delete")
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    owner: Mapped["Users"] = relationship(back_populates="projects")

    def __init__(self, **kwargs):  # noqa: D107
        self._uuid = str(uuid.uuid4())
        self.tags = kwargs.pop("tags", None)
        self.owner_id = kwargs.pop("owner_id", None)
        self.link = kwargs.pop("link", None)
        self.image_id = kwargs.pop("image_id", None)

        super().__init__(**kwargs)

    def __repr__(self) -> str:
        """Return a string representation of the project."""
        return f"<Project(id={self._id}, uuid={self._uuid}, title={self.title}, description={self.description}, is_featured={self.is_featured})>"  # noqa: E501

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

    @validates("is_featured")
    def validate_is_featured(self, key: str, value: Any) -> bool:  # noqa: D102
        if not isinstance(value, bool):
            raise ValueError("is_featured must be a boolean")

        return value

    @validates("title", "description")
    def validate_title_and_description(self, key: str, value: str) -> str:  # noqa: D102
        if not value:
            raise ValueError(f"{key} cannot be empty")

        return value

    @hybrid_property
    def tags(self) -> list[str]:  # noqa: D102
        return self._tags.split(",")

    @tags.setter
    def tags(self, value: list[str]) -> None:  # noqa: D102
        if not value:
            raise ValueError("Tags cannot be empty")
        self._tags = ",".join(value)

    @hybrid_property
    def link(self) -> str:  # noqa: D102
        return self._link

    @link.setter
    def link(self, value: str | None) -> None:  # noqa: D102
        if not value:
            self._link = None
        elif not re.match(r"^https?://", value):
            raise ValueError("Link must start with http:// or https://")
        else:
            self._link = value

    @validates("owner_id")
    def validate_owner_id(self, key: str, value: int) -> int:  # noqa: D102
        if not value:
            raise ValueError("Owner ID cannot be empty")

        # Check if the owner_id exists in the users table
        from app.models.users import Users

        if not db.session.get(Users, value):
            raise ValueError("Owner ID does not exist")

        return value

    def to_dict(self) -> dict:
        """Return a dictionary representation of the project."""
        return {
            "uuid": self._uuid,
            "title": self.title,
            "description": self.description,
            "tags": self.tags,
            "is_featured": self.is_featured,
            "link": self.link,
            "image_id": self.image_id,
        }
