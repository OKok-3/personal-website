import pytest
from app.models import Users, Projects
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


class TestProjectModel:
    """Test suite for the Project model."""

    @pytest.fixture
    def user(self, session: Session) -> Users:
        """Create a user for the project."""
        user = Users(username="testuser", password="Password123!", email="test@example.com")
        session.add(user)
        session.flush()
        return user

    @pytest.fixture
    def project(self, session: Session, user: Users) -> Projects:
        """Create a project for the user."""
        project = Projects(
            name="Test Project", description="Test Description", tags=["tag1", "tag2"], owner_id=user._id
        )
        session.add(project)
        session.flush()
        return project

    def test_create_project(self, session: Session, user: Users) -> None:
        """Test the creation of a project."""
        project = Projects(
            name="Test Project", description="Test Description", tags=["tag1", "tag2"], owner_id=user._id
        )
        session.add(project)
        session.flush()

        assert project.uuid is not None
        assert project.name == "Test Project"
        assert project.description == "Test Description"
        assert project.tags == ["tag1", "tag2"]
        assert project.owner_id == user._id

    def test_create_project_with_unspecified_is_featured(self, session: Session, user: Users) -> None:
        """Test the creation of a project with unspecified is_featured."""
        project = Projects(
            name="Test Project", description="Test Description", owner_id=user._id, tags=["tag1", "tag2"]
        )
        session.add(project)
        session.flush()

        assert project.is_featured is False

    def test_create_project_with_is_featured_being_None(self, session: Session, user: Users) -> None:
        """Test the creation of a project with is_featured being None."""
        project = Projects(
            name="Test Project",
            description="Test Description",
            is_featured=None,
            owner_id=user._id,
            tags=["tag1", "tag2"],
        )
        session.add(project)
        session.flush()

        assert project.is_featured is False

    def test_create_project_with_is_featured_being_True(self, session: Session, user: Users) -> None:
        """Test the creation of a project with is_featured being True."""
        project = Projects(
            name="Test Project",
            description="Test Description",
            is_featured=True,
            owner_id=user._id,
            tags=["tag1", "tag2"],
        )
        session.add(project)
        session.flush()

        assert project.is_featured is True

    def test_create_project_with_empty_tags(self, user: Users, session: Session) -> None:
        """Test the creation of a project with empty tags."""
        with pytest.raises(ValueError):
            project = Projects(name="Test Project", description="Test Description", tags=[], owner_id=user._id)
            session.add(project)
            session.flush()

    def test_create_project_with_None_tags(self, user: Users, session: Session) -> None:
        """Test the creation of a project with None tags."""
        with pytest.raises(ValueError):
            project = Projects(name="Test Project", description="Test Description", tags=None, owner_id=user._id)
            session.add(project)
            session.flush()

    def test_create_project_with_empty_name(self, user: Users, session: Session) -> None:
        """Test the creation of a project with empty name."""
        with pytest.raises(ValueError):
            project = Projects(name="", description="Test Description", owner_id=user._id)
            session.add(project)
            session.flush()

    def test_create_project_with_None_name(self, user: Users, session: Session) -> None:
        """Test the creation of a project with None name."""
        with pytest.raises(ValueError):
            project = Projects(name=None, description="Test Description", owner_id=user._id)
            session.add(project)
            session.flush()

    def test_create_project_with_empty_description(self, user: Users, session: Session) -> None:
        """Test the creation of a project with empty description."""
        with pytest.raises(ValueError):
            project = Projects(name="Test Project", description="", owner_id=user._id)
            session.add(project)
            session.flush()

    def test_create_project_with_None_description(self, user: Users, session: Session) -> None:
        """Test the creation of a project with None description."""
        with pytest.raises(ValueError):
            project = Projects(name="Test Project", description=None, owner_id=user._id)
            session.add(project)
            session.flush()

    def test_create_project_with_non_existent_owner_id(self, session: Session) -> None:
        """Test the creation of a project with a non-existent owner_id."""
        with pytest.raises(ValueError):
            project = Projects(name="Test Project", description="Test Description", owner_id=999, tags=["tag1", "tag2"])
            session.add(project)
            session.flush()

    def test_create_project_with_None_owner_id(self, session: Session) -> None:
        """Test the creation of a project with None owner_id."""
        with pytest.raises(ValueError):
            project = Projects(
                name="Test Project", description="Test Description", owner_id=None, tags=["tag1", "tag2"]
            )
            session.add(project)
            session.flush()

    def test_create_project_with_unspecified_owner_id(self, session: Session) -> None:
        """Test the creation of a project with unspecified owner_id."""
        with pytest.raises(ValueError):
            project = Projects(name="Test Project", description="Test Description", tags=["tag1", "tag2"])
            session.add(project)
            session.flush()

    def test_user_projects_relationship(self, user: Users, project: Projects) -> None:
        """Test the relationship between a user and their projects."""
        assert user.projects == {project}
