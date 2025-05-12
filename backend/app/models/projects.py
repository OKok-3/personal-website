import uuid
from typing import Any, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.users import Users

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
    name: Mapped[str] = mapped_column(name="name", type_=String(255))
    description: Mapped[str] = mapped_column(name="description", type_=String(255))
    _tags: Mapped[list[str]] = mapped_column(name="tags", type_=String(255), nullable=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    owner: Mapped["Users"] = relationship(back_populates="projects", cascade="all, delete")

    def __init__(self, **kwargs):  # noqa: D107
        self.owner_id = kwargs.pop("owner_id", None)
        self._uuid = str(uuid.uuid4())
        self.tags = kwargs.pop("tags", None)

        super().__init__(**kwargs)

    def __repr__(self) -> str:
        """Return a string representation of the project."""
        return f"<Project(id={self._id}, uuid={self._uuid}, name={self.name}, description={self.description}, is_featured={self.is_featured})>"  # noqa: E501

    @hybrid_property
    def uuid(self) -> str:  # noqa: D102
        return self._uuid

    @uuid.setter
    def uuid(self, _: Any) -> None:  # noqa: D102
        raise AttributeError("UUID is read-only")

    @hybrid_property
    def tags(self) -> list[str]:  # noqa: D102
        return self._tags.split(",")

    @tags.setter
    def tags(self, value: list[str]) -> None:  # noqa: D102
        if not value:
            raise ValueError("Tags cannot be empty")
        self._tags = ",".join(value)

    @validates("owner_id")
    def validate_owner_id(self, key: str, value: int) -> int:  # noqa: D102
        if not value:
            raise ValueError("Owner ID cannot be empty")

        # Check if the owner_id exists in the users table
        from app.models.users import Users

        if not db.session.get(Users, value):
            raise ValueError("Owner ID does not exist")

        return value
