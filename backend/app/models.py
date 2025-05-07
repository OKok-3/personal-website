from datetime import datetime

from app import db
from argon2 import PasswordHasher, Type
from sqlalchemy.orm import Mapped, mapped_column


class User(db.Model):
    """User model.

    Attributes:
        id (int): The user's ID.
        username (str): The user's username.
        email (str): The user's email.
        password (str): The user's password.
        created_at (datetime): The user's creation date.
        updated_at (datetime): The user's last update date.
        last_login (datetime): The user's last login date.
    """

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    email: Mapped[str] = mapped_column(nullable=True, unique=True)
    __pw_hash: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=datetime.now())
    updated_at: Mapped[datetime] = mapped_column(nullable=False, default=datetime.now())
    last_login: Mapped[datetime] = mapped_column(nullable=True)

    @property
    def password(self) -> None:  # noqa: D102
        raise AttributeError("password is not a readable attribute")

    @password.setter
    def password(self, raw_password: str) -> None:
        self.__pw_hash = PasswordHasher().hash(
            password=raw_password,
            time_cost=16,
            memory_cost=1024 * 16,
            parallelism=1,
            salt_len=32,
            hash_len=256,
            type=Type.ID,
        )

    def check_password(self, raw_password: str) -> bool:
        """Check the user's password.

        Args:
            raw_password (str): The raw password to check.
        """
        return PasswordHasher().verify(
            password=raw_password,
            hash=self.__pw_hash,
        )

    def to_dict(self) -> dict:  # noqa: D102
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "last_login": self.last_login,
        }
