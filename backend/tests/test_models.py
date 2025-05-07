import pytest
from app.models import Users


class TestUserModel:
    """Test suite for the User model."""

    @pytest.fixture
    def user(self):
        """Create a user."""
        user = Users(username="testuser", email="testuser@example.com")
        user.set_password("Testuser123!")
        return user

    def test_user_creation(self, session, user):
        """Test the creation of a user."""
        session.add(user)
        session.commit()
        user = session.query(Users).filter_by(username="testuser").one()

        # Check that the user is created correctly and is in the database
        assert user is not None
        assert user.id is not None
        assert user.username == "testuser"
        assert user.email == "testuser@example.com"
        assert user.check_password("Testuser123!")

    def test_write_hashed_pwd_raises_attribute_error(self, user):
        """Test that writing the password raises an attribute error."""
        # Raises TypeError because pw_hash setter takes no arguments
        with pytest.raises(TypeError):
            user.pw_hash = "newpassword"

    def test_check_password_returns_true(self, user):
        """Test that check_password returns true for the correct password."""
        assert user.check_password("Testuser123!")

    def test_user_creation_with_none_password_raises_value_error(self, user):
        """Test that creating a user with None password raises a ValueError."""
        with pytest.raises(ValueError):
            user.set_password(None)

    def test_user_creation_with_empty_password_raises_value_error(self, user):
        """Test that creating a user with empty password raises a ValueError."""
        with pytest.raises(ValueError):
            user.set_password("")

    def test_user_creation_with_invalid_email_raises_value_error(self, user):
        """Test that creating a user with invalid email raises a ValueError."""
        with pytest.raises(ValueError):
            user.email = "invalid-email"
