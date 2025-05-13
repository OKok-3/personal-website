import re
import uuid
from typing import Any, TYPE_CHECKING
from datetime import datetime, UTC

from app.extensions import db
from argon2 import PasswordHasher, Type
from argon2.exceptions import VerifyMismatchError
from sqlalchemy.orm import mapped_column, validates, relationship, Mapped
from sqlalchemy.types import Integer, String, DateTime, Boolean, Text
from sqlalchemy.ext.hybrid import hybrid_property

if TYPE_CHECKING:
    from app.models.projects import Projects


class Users(db.Model):  # noqa: D101
    __tablename__ = "users"

    _id: Mapped[int] = mapped_column(name="id", type_=Integer, primary_key=True)
    _uuid: Mapped[str] = mapped_column(name="uuid", type_=String(length=36), unique=True)
    username: Mapped[str] = mapped_column(name="username", type_=String(length=255), unique=True)
    _password: Mapped[str] = mapped_column(name="password", type_=Text)
    email: Mapped[str | None] = mapped_column(name="email", type_=String(length=255), unique=True)
    is_admin: Mapped[bool] = mapped_column(name="is_admin", type_=Boolean, default=False)
    _created_at: Mapped[datetime] = mapped_column(name="created_at", type_=DateTime, default=datetime.now(UTC))
    _updated_at: Mapped[datetime] = mapped_column(name="updated_at", type_=DateTime, default=datetime.now(UTC))
    _last_login: Mapped[datetime | None] = mapped_column(name="last_login", type_=DateTime, default=None)
    projects: Mapped[set["Projects"]] = relationship(back_populates="owner", cascade="all, delete-orphan")

    def __init__(self, **kwargs):  # noqa: D107
        self.password = kwargs.pop("password", None)
        self._uuid = str(uuid.uuid4())

        super().__init__(**kwargs)

    def __str__(self) -> str:
        """Return a string representation of the user."""
        return f"<User(id={self._id}, uuid={self._uuid}, username={self.username}, email={self.email}, is_admin={self.is_admin}, created_at={self._created_at}, updated_at={self._updated_at}, last_login={self._last_login})>"  # noqa: E501

    @hybrid_property
    def id(self) -> int:  # noqa: D102
        return self._id

    @id.setter
    def id(self, _: Any) -> None:  # noqa: D102
        raise AttributeError("ID is read-only")

    @validates("username")
    def validate_username(self, _: Any, value: str) -> str:  # noqa: D102
        if not value or len(value) < 4:
            raise ValueError("Username must be at least 4 characters long")

        return value

    @hybrid_property
    def uuid(self) -> str:  # noqa: D102
        return self._uuid

    @uuid.setter
    def uuid(self, _: Any) -> None:  # noqa: D102
        raise AttributeError("UUID is read-only")

    @hybrid_property
    def password(self) -> str:  # noqa: D102
        raise AttributeError("Password is not directly accessible. Use the 'verify_password' method instead.")

    @password.setter
    def password(self, value: str) -> None:  # noqa: D102
        if not value:
            raise ValueError("Password cannot be empty")

        if re.match(r"^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$", value):
            raise ValueError(
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"  # noqa: E501
            )

        self._password = PasswordHasher(
            time_cost=16,
            memory_cost=1024 * 2,
            parallelism=2,
            salt_len=16,
            hash_len=32,
            type=Type.ID,
        ).hash(value)

    def verify_password(self, password: str) -> bool:
        """Verify the password.

        Args:
            password (str): The password to verify.

        Returns:
            bool: True if the password is valid, False otherwise.
        """
        try:
            return PasswordHasher().verify(self._password, password)
        except VerifyMismatchError:
            return False

    @validates("email")
    def validate_email(self, key: str, value: str) -> str:  # noqa: D102
        if not value:
            return None

        if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", value):
            raise ValueError("Invalid email address")

        return value

    @validates("is_admin")
    def validate_is_admin(self, key: str, value: Any) -> bool:  # noqa: D102
        if not isinstance(value, bool):
            raise ValueError("is_admin must be a boolean")

        return value

    @hybrid_property
    def created_at(self) -> datetime:  # noqa: D102
        return self._created_at

    @created_at.setter
    def created_at(self, timestamp: datetime) -> None:  # noqa: D102
        self._created_at = timestamp.astimezone(UTC)

    @hybrid_property
    def updated_at(self) -> datetime:  # noqa: D102
        return self._updated_at

    @updated_at.setter
    def updated_at(self, timestamp: datetime) -> None:  # noqa: D102
        self._updated_at: datetime = timestamp.astimezone(UTC)

    @hybrid_property
    def last_login(self) -> datetime:  # noqa: D102
        return self._last_login

    @last_login.setter
    def last_login(self, timestamp: datetime) -> None:  # noqa: D102
        self._last_login: datetime = timestamp.astimezone(UTC)

    def to_dict(self) -> dict:
        """Return a dictionary representation of the user."""
        return {
            "uuid": self._uuid,
            "username": self.username,
            "email": self.email,
            "is_admin": self.is_admin,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "last_login": self.last_login,
        }
