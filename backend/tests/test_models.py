import pytest
from app.models import Users
from sqlalchemy.orm import Session


class TestUserModel:
    """Test suite for the User model."""

    def test_create_user(self, username: str, password: str, email: str, session: Session) -> None:
        """Test the creation of a user with valid username, password, and email."""
        user = Users(username=username, password=password, email=email)
        session.add(user)
        session.flush()

        assert user.uuid is not None
        assert user.username == username
        assert user.verify_password(password)
        assert not user.is_admin
        assert user.created_at is not None
        assert user.updated_at is not None
        assert user.last_login is None

    def test_create_user_without_email(self, username: str, password: str, session: Session) -> None:
        """Test the creation of a user without an email."""
        user = Users(username=username, password=password)
        session.add(user)
        session.flush()

        assert user.uuid is not None
        assert user.username == username
        assert user.verify_password(password)
        assert not user.is_admin
        assert user.created_at is not None
        assert user.updated_at is not None
        assert user.last_login is None

    def test_create_user_with_empty_username(self, password: str) -> None:
        """Test the creation of a user with an empty username."""
        with pytest.raises(ValueError):
            Users(username="", password=password)

    def test_create_user_with_None_username(self, password: str) -> None:
        """Test the creation of a user with a None username."""
        with pytest.raises(ValueError):
            Users(username=None, password=password)

    def test_create_user_with_short_username(self, password: str) -> None:
        """Test the creation of a user with a short username."""
        with pytest.raises(ValueError):
            Users(username="a", password=password)

    def test_create_user_with_empty_password(self, username: str) -> None:
        """Test the creation of a user with an empty password."""
        with pytest.raises(ValueError):
            Users(username=username, password="")

    def test_create_user_with_None_password(self, username: str) -> None:
        """Test the creation of a user with a None password."""
        with pytest.raises(ValueError):
            Users(username=username, password=None)

    def test_create_user_with_invalid_password(self, username: str) -> None:
        """Test the creation of a user with an invalid password."""
        with pytest.raises(ValueError):
            Users(username=username, password="short")

    def test_create_user_with_invalid_email(self, username: str, password: str) -> None:
        """Test the creation of a user with an invalid email."""
        with pytest.raises(ValueError):
            Users(username=username, password=password, email="invalid-email")

    def test_create_user_with_None_email(self, username: str, password: str, session: Session) -> None:
        """Test the creation of a user with a None email."""
        user = Users(username=username, password=password, email=None)
        session.add(user)
        session.flush()

        assert user.email is None

    def test_verify_password(self, password: str) -> None:
        """Test the verification of a user's password."""
        user = Users(username="testuser", password=password, email="test@example.com")

        assert user.verify_password(password)

    def test_verify_password_with_invalid_password(self, password: str) -> None:
        """Test the verification of a user's password with an invalid password."""
        user = Users(username="testuser", password=password, email="test@example.com")

        assert not user.verify_password("invalid-password")
