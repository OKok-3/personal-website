from datetime import datetime, UTC
import re
import string
import uuid
from app.db import db
from argon2 import PasswordHasher, Type
from sqlalchemy.orm import Mapped, mapped_column, validates


class Users(db.Model):
    """User model.

    Attributes:
        id (int): The user's ID.
        public_id (str): The user's public ID.
        admin (bool): Whether the user is an admin.
        username (str): The user's username.
        email (str): The user's email.
        password (str): The user's password.
        created_at (datetime): The user's creation date.
        updated_at (datetime): The user's last update date.
        last_login (datetime): The user's last login date.
    """

    id: Mapped[int] = mapped_column(primary_key=True)
    public_id: Mapped[str] = mapped_column(nullable=False, unique=True)
    admin: Mapped[bool] = mapped_column(nullable=False, default=False)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    role: Mapped[str] = mapped_column(nullable=False, default="user")
    email: Mapped[str] = mapped_column(nullable=True, unique=True)
    _pw_hash: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(nullable=False, default=datetime.now(UTC))
    last_login: Mapped[datetime] = mapped_column(nullable=True)

    def __init__(self, password: str, **kwargs) -> None:  # noqa: D107
        super().__init__(**kwargs)
        self.set_password(password)
        self.public_id = str(uuid.uuid4())

    @property
    def password(self) -> None:  # noqa: D102
        raise AttributeError("Password is not a readable attribute")

    @password.setter
    def password(self, **kwargs) -> None:  # noqa: D102
        raise AttributeError("Password is not a writable attribute. Use set_password instead.")

    @property
    def pw_hash(self) -> str:  # noqa: D102
        raise AttributeError("Hashed password is not a readable attribute")

    @pw_hash.setter
    def pw_hash(self) -> None:  # noqa: D102
        raise AttributeError("Hashed password is not directly writable. Set the password instead.")

    def set_password(self, raw_password: str) -> None:
        """Set the user's password.

        Args:
            raw_password (str): The raw password to set.
        """
        self._validate_password(raw_password)

        self._pw_hash = PasswordHasher(
            time_cost=16,
            memory_cost=1024 * 16,
            parallelism=1,
            salt_len=32,
            hash_len=256,
            type=Type.ID,
        ).hash(password=raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Check the user's password.

        Args:
            raw_password (str): The raw password to check.
        """
        return PasswordHasher().verify(
            password=raw_password,
            hash=self._pw_hash,
        )

    def _validate_password(self, raw_password: str) -> None:
        match raw_password:
            case None:
                raise ValueError("Password cannot be None")

            case str():
                if len(raw_password) < 8:
                    raise ValueError("Password must be at least 8 characters long")
                if len(raw_password) > 128:
                    raise ValueError("Password must be less than 128 characters long")
                if not any(char.isupper() for char in raw_password):
                    raise ValueError("Password must contain at least one uppercase letter")
                if not any(char.islower() for char in raw_password):
                    raise ValueError("Password must contain at least one lowercase letter")
                if not any(char.isdigit() for char in raw_password):
                    raise ValueError("Password must contain at least one digit")
                if not any(char in string.punctuation for char in raw_password):
                    raise ValueError("Password must contain at least one punctuation character")

    @validates("email")
    def validate_email(self, key: str, email: str) -> str:
        """Validate the user's email."""
        if email and not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email address")
        return email

    def to_dict(self) -> dict:  # noqa: D102
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "last_login": self.last_login,
        }

    @validates("admin")
    def validate_admin(self, key: str, admin: any) -> bool:
        """Validate the user's admin status."""
        if isinstance(admin, bool):
            return admin
        raise ValueError("Invalid admin status. Admin status must be a boolean")
