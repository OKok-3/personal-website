import pytest
from app.models import User


class TestUserModel:
    """Test suite for the User model."""

    @pytest.fixture
    def user(self):
        """Create a user."""
        return User(username="testuser", email="testuser@example.com", password="password")

    def test_user_creation(self, session, user):
        """Test the creation of a user."""
        session.add(user)
        session.commit()
        user = session.query(User).filter_by(username="testuser").one()

        # Check that the user is created correctly and is in the database
        assert user is not None
        assert user.id is not None
        assert user.username == "testuser"
        assert user.email == "testuser@example.com"
        assert user.check_password("password")

    def test_read_pwd_raises_attribute_error(self, user):
        """Test that reading the password raises an attribute error."""
        with pytest.raises(AttributeError):
            _ = user.password

    def test_write_hased_pwd_raises_attribute_error(self, user):
        """Test that writing the password raises an attribute error."""
        # Raises TypeError because pw_hash setter takes no arguments
        with pytest.raises(TypeError):
            user.pw_hash = "newpassword"

    def test_check_password_returns_true(self, user):
        """Test that check_password returns true for the correct password."""
        assert user.check_password("password")

    def test_user_creation_with_none_password_raises_value_error(self):
        """Test that creating a user with None password raises a ValueError."""
        with pytest.raises(ValueError):
            User(username="testuser", email="testuser@example.com", password=None)

    def test_user_creation_with_empty_password_raises_value_error(self):
        """Test that creating a user with empty password raises a ValueError."""
        with pytest.raises(ValueError):
            User(username="testuser", email="testuser@example.com", password="")

    def test_user_creation_with_missing_password_raises_value_error(self):
        """Test that creating a user with missing password raises a ValueError."""
        with pytest.raises(ValueError):
            User(username="testuser", email="testuser@example.com")
