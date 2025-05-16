import pytest
from datetime import timedelta
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Users, Projects, PageData, Images


@pytest.fixture(scope="function")
def user_data() -> dict:
    """Return a dictionary of user data."""
    return {"username": "testuser", "password": "Test1234!", "email": "test@example.com", "is_admin": False}


@pytest.fixture(scope="function")
def user(session: Session, user_data: dict) -> Users:
    """Create a user in the database."""
    user = Users(**user_data)

    session.add(user)
    session.flush()

    user = session.query(Users).filter_by(uuid=user.uuid).one_or_none()

    return user


class TestUsersModel:
    """Test suite for the Users data model."""

    def test_user_creation(self, session: Session, user_data: dict):
        """Test the creation of a user with all required fields."""
        user = Users(**user_data)

        session.add(user)
        session.flush()

        user = session.query(Users).filter_by(uuid=user.uuid).one_or_none()

        assert user._id is not None
        assert user.username == "testuser"
        assert user.verify_password("Test1234!")
        assert user.email == "test@example.com"
        assert user.is_admin is False
        assert user.created_at is not None
        assert user.updated_at is not None
        assert abs(user.created_at - user.updated_at) < timedelta(seconds=1)
        assert user.last_login is None
        assert user.uuid is not None
        assert user.uuid != ""
        assert len(user.projects) == 0

    ######################################## TESTING READ-ONLY ATTRIBUTES ########################################

    def test_user_id_is_read_only(self, user: Users):
        """Test that the user ID is read-only."""
        with pytest.raises(AttributeError):
            user.id = 1

    def test_password_is_write_only(self, user: Users):
        """Test that the user password is write-only."""
        with pytest.raises(AttributeError):
            user.password

    def test_uuid_is_read_only(self, user: Users):
        """Test that the user UUID is read-only."""
        with pytest.raises(AttributeError):
            user.uuid = "new_uuid"

    ############################################# TESTING VALIDATION #############################################

    @pytest.mark.parametrize("email", ["invalid_email", "email.com", "test@.com", "test@example"])
    def test_email_validation(self, user_data: dict, email: str):
        """Test that the email is validated."""
        with pytest.raises(ValueError):
            user_data["email"] = email
            Users(**user_data)

    @pytest.mark.parametrize("password", ["short", "!@#$%^&*", "password", "12345678"])
    def test_password_validation(self, user_data: dict, password: str):
        """Test that the password is validated."""
        with pytest.raises(ValueError):
            user_data["password"] = password
            Users(**user_data)

    def test_username_validation(self, user_data: dict):
        """Test that the username is validated."""
        with pytest.raises(ValueError):
            user_data["username"] = "not"
            Users(**user_data)

    ############################################ TESTING EMPTY VALUES ############################################

    @pytest.mark.parametrize("username", ["", None])
    def test_empty_username(self, user_data: dict, username: str):
        """Test that the username is not empty."""
        with pytest.raises(ValueError):
            user_data["username"] = username
            Users(**user_data)

    @pytest.mark.parametrize("password", ["", None])
    def test_empty_password(self, user_data: dict, password: str):
        """Test that the password is not empty."""
        with pytest.raises(ValueError):
            user_data["password"] = password
            Users(**user_data)

    def test_empty_email(self, user_data: dict, session: Session):
        """Test that the email is not empty."""
        user_data["email"] = None
        user = Users(**user_data)

        session.add(user)
        session.flush()

        user = session.query(Users).filter_by(uuid=user.uuid).one_or_none()

        assert user.email is None

    def test_empty_is_admin(self, user_data: dict, session: Session):
        """Test that the is_admin is not empty."""
        user_data.pop("is_admin")
        user = Users(**user_data)

        session.add(user)
        session.flush()

        user = session.query(Users).filter_by(uuid=user.uuid).one_or_none()

        assert user.is_admin is False

    ##################################### TESTING CHANGING TO INVALID VALUES #####################################

    def test_changing_to_invalid_username(self, user: Users, session: Session):
        """Test that the username cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            user.username = "not"
            session.flush()

    @pytest.mark.parametrize("email", ["invalid_email", "email.com", "test@.com", "test@example"])
    def test_changing_to_invalid_email(self, user: Users, session: Session, email: str):
        """Test that the email cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            user.email = email
            session.flush()

    @pytest.mark.parametrize("password", ["short", "!@#$%^&*", "password", "12345678"])
    def test_changing_to_invalid_password(self, user: Users, session: Session, password: str):
        """Test that the password cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            user.password = password
            session.flush()

    def test_changing_to_invalid_is_admin(self, user: Users, session: Session):
        """Test that the is_admin cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            user.is_admin = "not"
            session.flush()


class TestProjectsModel:
    """Test suite for the Projects data model."""

    @pytest.fixture(scope="function")
    def project_data(self, user: Users) -> dict:
        """Return a dictionary of project data."""
        return {
            "title": "Test Project",
            "description": "Test Description",
            "owner_id": user.id,
            "tags": ["tag1", "tag2"],
        }

    @pytest.fixture(scope="function")
    def project(self, session: Session, project_data: dict):
        """Create a project in the database."""
        project = Projects(**project_data)

        session.add(project)
        session.flush()

        project = session.query(Projects).filter_by(uuid=project.uuid).one_or_none()

        return project

    def test_project_creation(self, session: Session, project_data: dict, user: Users):
        """Test the creation of a project with all required fields."""
        project = Projects(**project_data)

        session.add(project)
        session.flush()

        project = session.query(Projects).filter_by(uuid=project.uuid).one_or_none()

        assert project._id is not None
        assert project.title == project_data["title"]
        assert project.description == project_data["description"]
        assert project.owner_id == user.id
        assert project.is_featured is False
        assert project.tags == project_data["tags"]
        assert project.uuid is not None
        assert project.uuid != ""
        assert len(project.owner.projects) == 1
        assert project in project.owner.projects

    ######################################## TESTING READ-ONLY ATTRIBUTES ########################################

    def test_project_id_is_read_only(self, project: Projects):
        """Test that the project ID is read-only."""
        with pytest.raises(AttributeError):
            project.id = 1

    def test_project_uuid_is_read_only(self, project: Projects):
        """Test that the project UUID is read-only."""
        with pytest.raises(AttributeError):
            project.uuid = "new_uuid"

    ############################################# TESTING VALIDATION #############################################

    def test_is_featured_validation(self, project_data: dict):
        """Test that the is_featured is validated."""
        with pytest.raises(ValueError):
            project_data["is_featured"] = "invalid"
            Projects(**project_data)

    ############################################ TESTING EMPTY VALUES ############################################

    @pytest.mark.parametrize("is_featured", [None, ""])
    def test_empty_is_featured(self, project_data: dict, is_featured: str):
        """Test that the is_featured is not empty."""
        with pytest.raises(ValueError):
            project_data["is_featured"] = is_featured
            Projects(**project_data)

    @pytest.mark.parametrize("title", ["", None])
    def test_empty_title(self, project_data: dict, title: str):
        """Test that the title is not empty."""
        with pytest.raises(ValueError):
            project_data["title"] = title
            Projects(**project_data)

    @pytest.mark.parametrize("description", ["", None])
    def test_empty_description(self, project_data: dict, description: str):
        """Test that the description is not empty."""
        with pytest.raises(ValueError):
            project_data["description"] = description
            Projects(**project_data)

    @pytest.mark.parametrize("tags", [None, ""])
    def test_empty_tags(self, project_data: dict, tags: str):
        """Test that the tags are not empty."""
        with pytest.raises(ValueError):
            project_data["tags"] = tags
            Projects(**project_data)

    ##################################### TESTING CHANGING TO INVALID VALUES #####################################

    def test_changing_to_invalid_is_featured(self, project: Projects, session: Session):
        """Test that the is_featured cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            project.is_featured = "not"
            session.flush()

    def test_changing_to_invalid_title(self, project: Projects, session: Session):
        """Test that the title cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            project.title = ""
            session.flush()

    def test_changing_to_invalid_description(self, project: Projects, session: Session):
        """Test that the description cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            project.description = ""
            session.flush()

    def test_changing_to_invalid_tags(self, project: Projects, session: Session):
        """Test that the tags cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            project.tags = []
            session.flush()

    def test_changing_to_invalid_owner_id(self, project: Projects, session: Session):
        """Test that the owner_id cannot be changed to an invalid value."""
        with pytest.raises(ValueError):
            project.owner_id = 999
            session.flush()

    ######################################## TEST PROJECT-USER RELATIONSHIP ######################################

    def test_project_user_relationship(self, project: Projects, user: Users):
        """Test that the project-user relationship is valid."""
        assert project.owner == user
        assert project in user.projects

    def test_project_user_relationship_deletion(self, project: Projects, user: Users, session: Session):
        """Test that the project-user relationship is deleted when the project is deleted."""
        session.delete(project)
        session.flush()

        project = session.query(Projects).filter_by(uuid=project.uuid).one_or_none()
        user = session.query(Users).filter_by(uuid=user.uuid).one_or_none()

        assert len(user.projects) == 0
        assert project is None

    def test_user_change_doesnt_affect_project(self, user: Users, project: Projects, session: Session):
        """Test that the user change doesn't affect the project."""
        user.username = "new_username"
        session.flush()

        project = session.query(Projects).filter_by(uuid=project.uuid).one_or_none()

        assert project.owner == user


class TestPageDataModel:
    """Test suite for the PageData data model.

    NOTE: This is not a comprehensive testing suite because the data is indeterminant, and doesn't really need
    validation.
    """

    def test_page_data_creation(self, session: Session, user: Users):
        """Test the creation of a page data with all required fields."""
        page_data = PageData(page="test_page", data={"test": "test"}, owner_id=user.id)

        session.add(page_data)
        session.flush()

        page_data = session.query(PageData).filter_by(page=page_data.page).one_or_none()

        assert page_data.page == "test_page"
        assert page_data.data == {"test": "test"}
        assert page_data.owner_id == user.id

    def test_creating_identical_page_data(self, session: Session, user: Users):
        """Test that creating identical page data doesn't create a new record."""
        page_data = PageData(page="test_page", data={"test1": "test1"}, owner_id=user.id)
        session.add(page_data)

        page_data = PageData(page="test_page", data={"test2": "test2"}, owner_id=user.id)
        session.add(page_data)

        with pytest.raises(IntegrityError):
            session.flush()


class TestImagesModel:
    """Test suite for the Images data model."""

    def test_image_creation(self, session: Session, user: Users):
        """Test the creation of an image with all required fields."""
        image = Images(type="image")

        session.add(image)
        session.flush()

        image = session.query(Images).filter_by(uuid=image.uuid).one_or_none()

        assert image.type == "image"
        assert image.uuid is not None

    def test_image_type_validation(self, session: Session, user: Users):
        """Test that the image type is validated."""
        with pytest.raises(ValueError):
            image = Images(type="invalid")
            session.add(image)
            session.flush()
