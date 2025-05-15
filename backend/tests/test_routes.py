import base64
import random
from typing import Any

import pytest
from flask.testing import FlaskClient
from sqlalchemy.orm import Session

from app.models import Users, Projects


@pytest.fixture(scope="function")
def user_data() -> dict:
    """Return a dictionary of user data."""
    return {"username": "testuser", "password": "Test1234!", "email": "test@example.com", "is_admin": False}


@pytest.fixture(scope="function")
def admin_data() -> dict:
    """Return a dictionary of admin data."""
    return {"username": "admin", "password": "Admin1234!", "email": "admin@example.com", "is_admin": True}


@pytest.fixture(scope="function")
def register_user(client: FlaskClient, user_data: dict):
    """Register a user."""
    client.post("/api/auth/register", json=user_data)


@pytest.fixture(scope="function")
def register_admin(admin_data: dict, session: Session):
    """Register an admin user.

    Because an admin user cannot be registered via the routes, we will create it manually in the database.
    """
    admin = Users(**admin_data)
    session.add(admin)
    session.commit()


@pytest.fixture(scope="function")
def admin_token(client: FlaskClient, admin_data: dict) -> str:
    """Return a JWT token for the admin user."""
    credentials = f"{admin_data['username']}:{admin_data['password']}"
    credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")

    response = client.post("/api/auth/login", headers={"Authorization": f"Basic {credentials}"})

    return response.json["token"]


@pytest.fixture(scope="function")
def user_token(client: FlaskClient, user_data: dict) -> str:
    """Return a JWT token for the user."""
    credentials = f"{user_data['username']}:{user_data['password']}"
    credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")

    response = client.post("/api/auth/login", headers={"Authorization": f"Basic {credentials}"})

    return response.json["token"]


@pytest.mark.usefixtures("session")
class TestAuthRoutes:
    """Test suite for the Auth routes."""

    ##############################################################################################################
    ########################################### TESTING REGISTER ROUTE ###########################################
    ##############################################################################################################

    def test_register_user(self, client: FlaskClient, user_data: dict):
        """Test the POST /register route."""
        response = client.post("/api/auth/register", json=user_data)

        assert response.status_code == 200
        assert response.json == {"message": "User registered successfully"}

    ########################################### TESTING MISSING VALUES ###########################################

    @pytest.mark.parametrize("attribute", ["username", "password", "email"])
    def test_register_user_missing_attribute(self, client: FlaskClient, user_data: dict, attribute: str):
        """Test the POST /register route with a missing attribute."""
        user_data.pop(attribute)
        response = client.post("/api/auth/register", json=user_data)

        if attribute == "email":
            assert response.status_code == 200
            assert response.json == {"message": "User registered successfully"}
        else:
            assert response.status_code == 400
            assert response.json == {"error": "Missing username or password"}

    ########################################## TESTING DUPLICATE VALUES ##########################################

    @pytest.mark.parametrize("attribute", ["username", "email"])
    def test_register_user_duplicate_attribute(self, client: FlaskClient, user_data: dict, attribute: str):
        """Test the POST /register route with a duplicate attribute."""
        client.post("/api/auth/register", json=user_data)
        user_data[attribute] = "alt_" + user_data[attribute]
        response = client.post("/api/auth/register", json=user_data)

        error_attr = "Username" if attribute == "email" else "Email"

        assert response.status_code == 401
        assert response.json["error"] == f"{error_attr} already exists"

    ########################################### TESTING INVALID VALUES ###########################################

    @pytest.mark.parametrize("username", ["not", "", None])
    def test_register_user_invalid_username(self, client: FlaskClient, user_data: dict, username: str):
        """Test the POST /register route with an invalid username."""
        user_data["username"] = username
        response = client.post("/api/auth/register", json=user_data)

        assert response.status_code == 400
        assert response.json["error"] is not None  # TODO: Add more specific error message

    @pytest.mark.parametrize("password", ["short", "!@#$%^&*", "password", "12345678"])
    def test_register_user_invalid_password(self, client: FlaskClient, user_data: dict, password: str):
        """Test the POST /register route with an invalid password.

        Because password validation and error behaviour has been extensively tested when testing projects data model,
        we will only test if the error message is returned correctly here.
        """
        user_data["password"] = password
        response = client.post("/api/auth/register", json=user_data)

        assert response.status_code == 400
        assert response.json == {
            "error": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"  # noqa: E501
        }

    ##############################################################################################################
    ########################################### TESTING LOGIN ROUTE ##############################################
    ##############################################################################################################

    @pytest.fixture(scope="function")
    def user_credentials(self, user_data: dict) -> str:
        """Return a dictionary of user data."""
        credentials = f"{user_data['username']}:{user_data['password']}"
        return base64.b64encode(credentials.encode("utf-8")).decode("utf-8")

    @pytest.mark.usefixtures("register_user")
    def test_login_user(self, client: FlaskClient, user_credentials: str, session: Session):
        """Test the POST /login route."""
        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {user_credentials}"})

        user = session.query(Users).filter(Users.username == "testuser").one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "Login successful"
        assert response.json["token"] is not None

        # Check if the user was updated with the last login timestamp
        assert user is not None
        assert user.last_login is not None

    ########################################### TESTING MISSING VALUES ###########################################

    @pytest.mark.usefixtures("register_user")
    def test_login_user_missing_username(self, client: FlaskClient, user_data: dict):
        """Test the POST /login route with a missing username."""
        user_credentials = f":{user_data['password']}"
        user_credentials = base64.b64encode(user_credentials.encode("utf-8")).decode("utf-8")

        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {user_credentials}"})

        assert response.status_code == 401
        assert response.json == {"error": "Missing username or password"}

    @pytest.mark.usefixtures("register_user")
    def test_login_user_missing_password(self, client: FlaskClient, user_data: dict):
        """Test the POST /login route with a missing password."""
        user_credentials = f"{user_data['username']}:"
        user_credentials = base64.b64encode(user_credentials.encode("utf-8")).decode("utf-8")

        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {user_credentials}"})

        assert response.status_code == 401
        assert response.json == {"error": "Missing username or password"}

    @pytest.mark.usefixtures("register_user")
    def test_login_missing_credentials(self, client: FlaskClient):
        """Test the POST /login route with a missing username and password."""
        response = client.post("/api/auth/login", headers={"Authorization": "Basic "})

        assert response.status_code == 401
        assert response.json == {"error": "Missing username or password"}

    @pytest.mark.usefixtures("register_user")
    def test_login_without_headers(self, client: FlaskClient):
        """Test the POST /login route without headers."""
        response = client.post("/api/auth/login")

        assert response.status_code == 401
        assert response.json == {"error": "Missing username or password"}

    ############################################## TESTING INVALID VALUES ##############################################

    @pytest.mark.usefixtures("register_user")
    def test_login_user_invalid_username(self, client: FlaskClient, user_data: dict):
        """Test the POST /login route with an invalid username."""
        user_credentials = f"invalid:{user_data['password']}"
        user_credentials = base64.b64encode(user_credentials.encode("utf-8")).decode("utf-8")

        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {user_credentials}"})

        assert response.status_code == 401
        assert response.json == {"error": "User not found"}

    @pytest.mark.usefixtures("register_user")
    def test_login_user_invalid_password(self, client: FlaskClient, user_data: dict):
        """Test the POST /login route with an invalid password."""
        user_credentials = f"{user_data['username']}:invalid"
        user_credentials = base64.b64encode(user_credentials.encode("utf-8")).decode("utf-8")

        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {user_credentials}"})

        assert response.status_code == 401
        assert response.json == {"error": "Invalid password"}


@pytest.mark.usefixtures("session")
class TestUsersRoutes:
    """Test suite for the Users routes."""

    ##############################################################################################################
    ########################################## TESTING GET USERS ROUTE ###########################################
    ##############################################################################################################

    @pytest.mark.usefixtures("register_admin")
    def test_get_all_users_with_admin_token(self, client: FlaskClient, admin_token: str, admin_data: dict):
        """Test the GET /users route with admin token."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": "all"})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched all users"
        assert len(response.json["users"]) == 1
        assert response.json["users"][0]["username"] == admin_data["username"]
        assert response.json["users"][0]["email"] == admin_data["email"]
        assert response.json["users"][0]["is_admin"] is admin_data["is_admin"]
        assert response.json["users"][0]["created_at"] is not None
        assert response.json["users"][0]["updated_at"] is not None
        assert response.json["users"][0]["last_login"] is not None

    @pytest.mark.usefixtures("register_admin", "register_user")
    @pytest.mark.parametrize("attr", ["uuid", "username", "email"])
    @pytest.mark.parametrize("user_type", ["admin", "user"])
    def test_get_user_self_data_with_admin(
        self,
        client: FlaskClient,
        admin_token: str,
        user_token: str,
        admin_data: dict,
        user_data: dict,
        attr: str,
        user_type: str,
    ):
        """Test the GET /users route with admin token."""
        if user_type == "admin":
            token = admin_token
            user = admin_data
        else:
            token = user_token
            user = user_data

        if attr == "uuid":
            user["uuid"] = Users.query.filter(Users.username == user["username"]).one_or_none().uuid

        response = client.get("/api/users/", headers={"Authorization": f"Bearer {token}"}, json={attr: user[attr]})

        assert response.status_code == 200
        assert response.json["message"] == f"Fetched user by {attr}"
        assert len(response.json["users"]) == 1
        assert response.json["users"][0]["username"] == user["username"]
        assert response.json["users"][0]["email"] == user["email"]
        assert response.json["users"][0]["is_admin"] is user["is_admin"]
        assert response.json["users"][0]["created_at"] is not None
        assert response.json["users"][0]["updated_at"] is not None
        assert response.json["users"][0]["last_login"] is not None

    ########################################### TESTING MISSING VALUES ###########################################

    @pytest.mark.usefixtures("register_admin")
    def test_no_payload_gets_self_data(self, client: FlaskClient, admin_token: str, admin_data: dict):
        """Test the GET /users route with a missing payload."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched user by self"
        assert len(response.json["users"]) == 1
        assert response.json["users"][0]["username"] == admin_data["username"]
        assert response.json["users"][0]["email"] == admin_data["email"]
        assert response.json["users"][0]["is_admin"] is admin_data["is_admin"]
        assert response.json["users"][0]["created_at"] is not None
        assert response.json["users"][0]["updated_at"] is not None
        assert response.json["users"][0]["last_login"] is not None

    @pytest.mark.usefixtures("register_admin")
    @pytest.mark.parametrize("uuid", [None, ""])
    def test_no_uuid_gets_self_data_admin(self, client: FlaskClient, admin_token: str, admin_data: dict, uuid: str):
        """Test the GET /users route with a missing uuid."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": uuid})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched user by self"
        assert len(response.json["users"]) == 1
        assert response.json["users"][0]["username"] == admin_data["username"]
        assert response.json["users"][0]["email"] == admin_data["email"]
        assert response.json["users"][0]["is_admin"] is admin_data["is_admin"]
        assert response.json["users"][0]["created_at"] is not None
        assert response.json["users"][0]["updated_at"] is not None
        assert response.json["users"][0]["last_login"] is not None

    @pytest.mark.usefixtures("register_user")
    @pytest.mark.parametrize("uuid", [None, ""])
    def test_no_uuid_gets_self_data_user(self, client: FlaskClient, user_token: str, user_data: dict, uuid: str):
        """Test the GET /users route with a missing uuid."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": uuid})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched user by self"
        assert len(response.json["users"]) == 1
        assert response.json["users"][0]["username"] == user_data["username"]
        assert response.json["users"][0]["email"] == user_data["email"]
        assert response.json["users"][0]["is_admin"] is user_data["is_admin"]
        assert response.json["users"][0]["created_at"] is not None
        assert response.json["users"][0]["updated_at"] is not None
        assert response.json["users"][0]["last_login"] is not None

    ########################################### TESTING PERMISSIONS #############################################

    @pytest.mark.usefixtures("register_user")
    def test_get_all_users_insufficient_permissions(self, client: FlaskClient, user_token: str):
        """Test the GET /users route with a missing uuid."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": "all"})

        assert response.status_code == 403
        assert response.json["error"] == "Unauthorized. Insufficient permissions"

    @pytest.mark.usefixtures("register_user")
    @pytest.mark.parametrize("uuid", ["non_existent", True])
    def test_get_non_existent_user_by_user(self, client: FlaskClient, user_token: str, uuid: str):
        """Test the GET /users route with a non-existent user by a user."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": uuid})

        assert response.status_code == 404
        assert response.json["error"] == "User not found"

    @pytest.mark.usefixtures("register_admin")
    @pytest.mark.parametrize("uuid", ["non_existent", True])
    def test_get_non_existent_user_by_admin(self, client: FlaskClient, admin_token: str, uuid: str):
        """Test the GET /users route with a non-existent user by an admin."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": uuid})

        assert response.status_code == 404
        assert response.json["error"] == "User not found"

    @pytest.mark.usefixtures("register_admin", "register_user")
    def test_get_other_user_by_user(self, client: FlaskClient, user_token: str, admin_data: dict):
        """Test the GET /users route with a user trying to get another user."""
        admin_uuid = Users.query.filter(Users.username == admin_data["username"]).one_or_none().uuid
        response = client.get(
            "/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": admin_uuid}
        )

        assert response.status_code == 403
        assert response.json["error"] == "Unauthorized. Insufficient permissions"

    @pytest.mark.usefixtures("register_admin", "register_user")
    def test_get_other_user_by_admin(self, client: FlaskClient, admin_token: str, user_data: dict):
        """Test the GET /users route with an admin trying to get another user."""
        user_uuid = Users.query.filter(Users.username == user_data["username"]).one_or_none().uuid
        response = client.get(
            "/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": user_uuid}
        )

        assert response.status_code == 200
        assert response.json["message"] == "Fetched user by uuid"
        assert len(response.json["users"]) == 1
        assert response.json["users"][0]["username"] == user_data["username"]
        assert response.json["users"][0]["email"] == user_data["email"]
        assert response.json["users"][0]["is_admin"] is user_data["is_admin"]
        assert response.json["users"][0]["created_at"] is not None
        assert response.json["users"][0]["updated_at"] is not None
        assert response.json["users"][0]["last_login"] is None

    ##############################################################################################################
    ########################################## TESTING DELETE USERS ROUTE ########################################
    ##############################################################################################################

    @pytest.mark.usefixtures("register_admin", "register_user")
    @pytest.mark.parametrize("user_type", ["admin", "user"])
    def test_delete_user(
        self, client: FlaskClient, admin_token: str, user_token: str, admin_data: dict, user_data: dict, user_type: str
    ):
        """Test users can delete themselves."""
        if user_type == "admin":
            token = admin_token
            user = admin_data
        else:
            token = user_token
            user = user_data

        uuid = Users.query.filter(Users.username == user["username"]).one_or_none().uuid
        response = client.delete("/api/users/", headers={"Authorization": f"Bearer {token}"}, json={"uuid": uuid})

        assert response.status_code == 200
        assert response.json["message"] == "User deleted"
        assert Users.query.filter(Users.username == user["username"]).one_or_none() is None

    @pytest.mark.usefixtures("register_admin", "register_user")
    def test_delete_user_by_admin(self, client: FlaskClient, admin_token: str, user_data: dict):
        """Test admins can delete users."""
        user_uuid = Users.query.filter(Users.username == user_data["username"]).one_or_none().uuid
        response = client.delete(
            "/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": user_uuid}
        )

        assert response.status_code == 200
        assert response.json["message"] == "User deleted"
        assert Users.query.filter(Users.username == user_data["username"]).one_or_none() is None

    ########################################### TESTING MISSING VALUES ###########################################

    @pytest.mark.usefixtures("register_admin", "register_user")
    @pytest.mark.parametrize("user_type", ["admin", "user"])
    @pytest.mark.parametrize("uuid", [None, ""])
    def test_delete_user_missing_uuid(
        self, client: FlaskClient, admin_token: str, user_token: str, user_type: str, uuid: str
    ):
        """Test UUID is required to delete a user."""
        if user_type == "admin":
            token = admin_token
        else:
            token = user_token

        response = client.delete("/api/users/", headers={"Authorization": f"Bearer {token}"}, json={"uuid": uuid})

        assert response.status_code == 400
        assert response.json["error"] == "Missing uuid"

    ########################################### TESTING PERMISSIONS #############################################

    @pytest.mark.usefixtures("register_admin", "register_user")
    def test_delete_user_insufficient_permissions(
        self, client: FlaskClient, user_token: str, user_data: dict, admin_data: dict
    ):
        """Test regular users cannot delete other users."""
        admin_uuid = Users.query.filter(Users.username == admin_data["username"]).one_or_none().uuid
        response = client.delete(
            "/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": admin_uuid}
        )

        assert response.status_code == 403
        assert response.json["error"] == "Unauthorized. Insufficient permissions"

    ##############################################################################################################
    ########################################## TESTING UPDATE USERS ROUTE ########################################
    ##############################################################################################################

    @pytest.mark.usefixtures("register_admin", "register_user")
    @pytest.mark.parametrize("attr", ["username", "email", "password", "is_admin"])
    @pytest.mark.parametrize("user_type", ["admin", "user"])
    def test_update_user(
        self,
        client: FlaskClient,
        admin_token: str,
        user_token: str,
        admin_data: dict,
        user_data: dict,
        attr: str,
        user_type: str,
    ):
        """Test users can update their own account."""
        if user_type == "admin":
            token = admin_token
            data = admin_data
        else:
            token = user_token
            data = user_data

        uuid = Users.query.filter(Users.username == data["username"]).one_or_none().uuid
        data["uuid"] = uuid

        if attr == "is_admin" and user_type == "admin":
            data[attr] = not data[attr]

        if attr != "is_admin":
            data[attr] = "alt_" + data[attr]

        response = client.put("/api/users/", headers={"Authorization": f"Bearer {token}"}, json=data)
        user = Users.query.filter(Users.uuid == uuid).one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "User updated"

        print(user_type)

        if attr == "password":
            assert user.verify_password(data["password"])
        else:
            assert user.to_dict()[attr] == data[attr]

    ########################################### TESTING MISSING VALUES ###########################################

    @pytest.mark.usefixtures("register_admin", "register_user")
    @pytest.mark.parametrize("user_type", ["admin", "user"])
    def test_update_user_missing_uuid(self, client: FlaskClient, admin_token: str, user_token: str, user_type: str):
        """Test UUID is required to update a user."""
        if user_type == "admin":
            token = admin_token
        else:
            token = user_token

        response = client.put("/api/users/", headers={"Authorization": f"Bearer {token}"}, json={})

        assert response.status_code == 400
        assert response.json["error"] == "Missing uuid"

    @pytest.mark.usefixtures("register_admin", "register_user")
    @pytest.mark.parametrize("user_type", ["admin", "user"])
    @pytest.mark.parametrize("attr", ["username", "email", "password", "is_admin"])
    def test_update_user_missing_attr(
        self,
        client: FlaskClient,
        admin_token: str,
        user_token: str,
        admin_data: dict,
        user_data: dict,
        user_type: str,
        attr: str,
    ):
        """Test missing attributes are ignored, except for email which is seen as deleting the email."""
        if user_type == "admin":
            token = admin_token
            data = admin_data
        else:
            token = user_token
            data = user_data

        uuid = Users.query.filter(Users.username == data["username"]).one_or_none().uuid
        data["uuid"] = uuid

        original_value = data.pop(attr)

        response = client.put("/api/users/", headers={"Authorization": f"Bearer {token}"}, json=data)

        user = Users.query.filter(Users.uuid == uuid).one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "User updated"
        match attr:
            case "username":
                assert user.username == original_value
            case "email":
                assert user.email is None
            case "password":
                assert user.verify_password(original_value)
            case "is_admin":
                assert user.is_admin == original_value


@pytest.mark.usefixtures("session", "register_admin", "register_user")
class TestProjectsRoutes:
    """Test the projects routes."""

    @classmethod
    def create_projects(cls, admin_data: dict, session: Session) -> None:
        """Randomly create multiple projects for testing."""
        admin_id = Users.query.filter(Users.username == admin_data["username"]).one_or_none().id

        for _ in range(random.randint(1, 10)):
            project = Projects(
                title=f"Test Title {random.randint(1, 1000)}",
                description=f"Test Description {random.randint(1, 1000)}",
                is_featured=random.choice([True, False]),
                tags=[f"tag {random.randint(1, 1000)}" for _ in range(random.randint(1, 5))],
                owner_id=admin_id,
            )
            session.add(project)
        session.flush()

    @pytest.fixture(scope="function")
    def project_data(self) -> dict:
        """Get a project data."""
        return {
            "title": "Test Title",
            "description": "Test Description",
            "is_featured": True,
            "tags": ["tag1", "tag2", "tag3"],
        }

    ##############################################################################################################
    ########################################## TESTING GET PROJECTS ROUTE ########################################
    ##############################################################################################################

    def test_get_all_projects(self, client: FlaskClient, admin_data: dict, session: Session) -> None:
        """Test admins can get all projects."""
        self.create_projects(admin_data, session)
        response = client.get("/api/projects/")

        assert response.status_code == 200
        assert response.json["message"] == "Fetched all projects"
        assert len(response.json["projects"]) >= 1

    def test_get_project_by_uuid(self, client: FlaskClient, admin_data: dict, session: Session) -> None:
        """Test admins can get a project by UUID."""
        self.create_projects(admin_data, session)
        project = Projects.query.first()
        uuid = project.uuid
        response = client.get("/api/projects/", json={"uuid": uuid})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched project by UUID"
        assert len(response.json["projects"]) == 1
        assert response.json["projects"][0]["uuid"] == uuid
        assert response.json["projects"][0]["title"] == project.title
        assert response.json["projects"][0]["description"] == project.description
        assert response.json["projects"][0]["is_featured"] == project.is_featured
        assert response.json["projects"][0]["tags"] == project.tags

    ##############################################################################################################
    ######################################### TESTING CREATE PROJECT ROUTE #######################################
    ##############################################################################################################

    def test_create_project(self, client: FlaskClient, admin_token: str) -> None:
        """Test admins can create a project with all required fields."""
        response = client.post(
            "/api/projects/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "title": "Test Title",
                "description": "Test Description",
                "is_featured": True,
                "tags": ["tag1", "tag2", "tag3"],
            },
        )

        assert response.status_code == 201
        assert response.json["message"] == "Project created"
        assert response.json["uuid"] is not None

    ############################################ TESTING MISSING VALUES ##########################################

    @pytest.mark.parametrize("attr", ["title", "description", "is_featured", "tags"])
    def test_missing_fields(self, client: FlaskClient, admin_token: str, attr: str, project_data: dict) -> None:
        """Test admins cannot create a project without a title."""
        project_data.pop(attr)
        response = client.post(
            "/api/projects/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json=project_data,
        )

        assert response.status_code == 400
        assert response.json["error"] is not None

    ##############################################################################################################
    ####################################### TESTING UPDATE PROJECT ROUTE #########################################
    ##############################################################################################################

    @pytest.mark.parametrize("attr", ["title", "description", "is_featured", "tags"])
    def test_update_project(
        self, client: FlaskClient, admin_token: str, session: Session, attr: str, admin_data: dict
    ) -> None:
        """Test a project can be updated with all required fields."""
        self.create_projects(admin_data, session)
        project = Projects.query.first()

        uuid = project.uuid
        project_data = project.to_dict()

        if attr == "tags":
            project_data[attr] = [f"updated {tag}" for tag in project_data[attr]]
        elif attr == "is_featured":
            project_data[attr] = not project_data[attr]
        else:
            project_data[attr] = "updated " + project_data[attr]

        response = client.put(
            f"/api/projects/{uuid}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json=project_data,
        )

        assert response.status_code == 200
        assert project.to_dict()[attr] == project_data[attr]

    ########################################### TESTING MISSING VALUES ###########################################

    @pytest.mark.parametrize("attr", ["title", "description", "is_featured", "tags"])
    def test_update_project_missing_fields(
        self, client: FlaskClient, admin_token: str, admin_data: dict, session: Session, attr: str
    ) -> None:
        """Test a project can be updated with missing fields."""
        self.create_projects(admin_data, session)
        project = Projects.query.first()
        uuid = project.uuid
        project_data = project.to_dict()
        original_value = project_data.pop(attr)

        response = client.put(
            f"/api/projects/{uuid}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json=project_data,
        )

        # The attribute's value should remain the same
        assert response.status_code == 200
        assert project.to_dict()[attr] == original_value

    @pytest.mark.parametrize("json_data", [None, {}])
    def test_update_project_no_fields(
        self, client: FlaskClient, admin_token: str, admin_data: dict, session: Session, json_data: Any
    ) -> None:
        """Test a project can be updated with no fields."""
        self.create_projects(admin_data, session)
        uuid = Projects.query.first().uuid

        response = client.put(
            f"/api/projects/{uuid}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json=json_data,
        )

        assert response.status_code == 400
        assert response.json["message"] == "No fields provided"

    ######################################## TESTING DELETE PROJECT ROUTE ########################################

    def test_delete_project(self, client: FlaskClient, admin_token: str, admin_data: dict, session: Session) -> None:
        """Test a project can be deleted."""
        self.create_projects(admin_data, session)
        uuid = Projects.query.first().uuid

        response = client.delete(
            f"/api/projects/{uuid}",
            headers={"Authorization": f"Bearer {admin_token}"},
        )

        assert response.status_code == 200
        assert response.json["message"] == "Project deleted"
        assert Projects.query.filter(Projects.uuid == uuid).one_or_none() is None

    ########################################### TESTING PERMISSIONS #############################################

    def test_update_project_insufficient_permissions(
        self, client: FlaskClient, user_token: str, admin_data: dict, session: Session
    ) -> None:
        """Test a user cannot update a project."""
        self.create_projects(admin_data, session)
        project = Projects.query.first()
        uuid = project.uuid

        response = client.put(
            f"/api/projects/{uuid}",
            headers={"Authorization": f"Bearer {user_token}"},
            json=project.to_dict(),
        )

        assert response.status_code == 403
        assert response.json["error"] == "Unauthorized. Insufficient permissions"
