import pytest
from sqlalchemy.exc import IntegrityError
from app.models import Users


class TestUserModel:
    """Test suite for the User model."""

    @pytest.fixture
    def user(self):
        """Create a user."""
        user = Users(username="testuser", email="testuser@example.com", password="Testuser123!")
        return user

    def test_user_creation(self, session, user):
        """Test the creation of a user."""
        session.add(user)
        session.flush()
        user = session.query(Users).filter_by(username="testuser").one()

        # Check that the user is created correctly and is in the database
        assert user is not None
        assert user.id is not None
        assert user.username == "testuser"
        assert user.email == "testuser@example.com"
        assert user.check_password("Testuser123!")
        assert user.public_id is not None
        assert user.admin is False

    def test_set_user_admin(self, user):
        """Test that the user's admin status can be set correctly."""
        user.admin = True
        assert user.admin is True

    def test_user_role_setter_invalid_role(self, user):
        """Test that the user's role can be set to an invalid role."""
        with pytest.raises(ValueError):
            user.admin = "invalid value"

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

    def test_change_valid_user_email(self, user):
        """Test that changing a user's email works."""
        user.email = "newemail@example.com"
        assert user.email == "newemail@example.com"

    def test_create_user_with_duplicate_email(self, session, user):
        """Test that creating a user with a duplicate email raises a ValueError."""
        session.add(user)
        session.flush()
        with pytest.raises(IntegrityError):
            session.add(Users(username="testuser2", email="testuser@example.com", password="Testuser123!"))
            session.flush()

    def test_change_invalid_user_email(self, user):
        """Test that changing a user's email to an invalid email raises a ValueError."""
        with pytest.raises(ValueError):
            user.email = "invalid-email"

    def test_change_user_username(self, user):
        """Test that changing a user's username works."""
        user.username = "newusername"
        assert user.username == "newusername"

    def test_create_user_with_duplicate_username(self, session, user):
        """Test that creating a user with a duplicate username raises a ValueError."""
        session.add(user)
        session.flush()
        with pytest.raises(IntegrityError):
            session.add(Users(username="testuser", email="testuser2@example.com", password="Testuser123!"))
            session.flush()
