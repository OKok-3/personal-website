import base64
import random
import string
from datetime import datetime, UTC, timedelta
from collections.abc import Generator

import pytest
import jwt
from flask.testing import FlaskClient
from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session

from app.models import Users, Projects


@pytest.fixture(scope="function", autouse=True)
def teardown_db(db: SQLAlchemy) -> Generator[None]:
    """Drop all tables and create them again after each test."""
    db.drop_all()
    db.create_all()
    yield


@pytest.fixture
def user_credentials(username: str, password: str) -> str:
    """Return the credentials for the user."""
    return base64.b64encode(f"{username}:{password}".encode()).decode()


@pytest.fixture
def admin_credentials(admin_username: str, password: str) -> str:
    """Return the credentials for the admin."""
    return base64.b64encode(f"{admin_username}:{password}".encode()).decode()


class TestAuthRegisterRoutes:
    """Test suites for the /api/auth/register routes."""

    def test_register_user(self, client: FlaskClient, username: str, password: str, email: str) -> None:
        """Test basic user registration."""
        response = client.post("/api/auth/register", json={"username": username, "password": password, "email": email})

        assert response.status_code == 200
        assert response.json["message"] == "User registered successfully"

    def test_register_user_with_missing_username(self, client: FlaskClient, password: str, email: str) -> None:
        """Test user registration with missing username."""
        response = client.post("/api/auth/register", json={"password": password, "email": email})

        assert response.status_code == 400
        assert response.json["error"] == "Missing username or password"

    def test_register_user_with_empty_username(self, client: FlaskClient, password: str, email: str) -> None:
        """Test user registration with empty username."""
        response = client.post("/api/auth/register", json={"username": "", "password": password, "email": email})

        assert response.status_code == 400
        assert response.json["error"] == "Missing username or password"

    def test_register_user_with_missing_password(self, client: FlaskClient, username: str, email: str) -> None:
        """Test user registration with missing password."""
        response = client.post("/api/auth/register", json={"username": username, "email": email})

        assert response.status_code == 400
        assert response.json["error"] == "Missing username or password"

    def test_register_user_with_empty_password(self, client: FlaskClient, username: str, email: str) -> None:
        """Test user registration with empty password."""
        response = client.post("/api/auth/register", json={"username": username, "password": "", "email": email})

        assert response.status_code == 400
        assert response.json["error"] == "Missing username or password"

    def test_register_user_with_missing_email(self, client: FlaskClient, username: str, password: str) -> None:
        """Test user registration with missing email."""
        response = client.post("/api/auth/register", json={"username": username, "password": password})

        assert response.status_code == 200
        assert response.json["message"] == "User registered successfully"

    def test_register_user_with_empty_email(self, client: FlaskClient, username: str, password: str) -> None:
        """Test user registration with empty email."""
        response = client.post("/api/auth/register", json={"username": username, "password": password, "email": ""})

        assert response.status_code == 200
        assert response.json["message"] == "User registered successfully"

    def test_register_user_with_existing_username(
        self, client: FlaskClient, username: str, password: str, email: str
    ) -> None:
        """Test user registration with existing username."""
        client.post("/api/auth/register", json={"username": username, "password": password + "_", "email": "2" + email})
        response = client.post("/api/auth/register", json={"username": username, "password": password, "email": email})

        assert response.status_code == 401
        assert response.json["error"] == "Username already exists"

    def test_register_user_with_existing_email(
        self, client: FlaskClient, username: str, password: str, email: str
    ) -> None:
        """Test user registration with existing email."""
        client.post("/api/auth/register", json={"username": username, "password": password + "_", "email": email})
        response = client.post(
            "/api/auth/register", json={"username": username + "_", "password": password, "email": email}
        )

        assert response.status_code == 401
        assert response.json["error"] == "Email already exists"

    def test_register_user_with_invalid_email(self, client: FlaskClient, username: str, password: str) -> None:
        """Test user registration with invalid email."""
        response = client.post(
            "/api/auth/register", json={"username": username, "password": password, "email": "invalid"}
        )

        assert response.status_code == 400
        assert response.json["error"] == "Invalid email address"

    def test_register_user_with_invalid_password(self, client: FlaskClient, username: str, email: str) -> None:
        """Test user registration with invalid password."""
        response = client.post("/api/auth/register", json={"username": username, "password": "short", "email": email})

        assert (
            response.json["error"]
            == "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"  # noqa: E501
        )
        assert response.status_code == 400


class TestAuthLoginRoutes:
    """Test suites for the /api/auth/login routes."""

    @pytest.fixture(scope="function", autouse=True)
    def create_user(self, session: Session, username: str, password: str, email: str) -> None:
        """Create a user in the database."""
        user = Users(username=username, password=password, email=email)
        session.add(user)
        session.commit()

    @classmethod
    def create_credentials(cls, username: str, password: str) -> str:
        """Create the credentials for the user."""
        return base64.b64encode(f"{username}:{password}".encode()).decode()

    def test_login_user(self, client: FlaskClient, user_credentials: str, username: str) -> None:
        """Test user login."""
        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {user_credentials}"})
        user = Users.query.filter_by(username=username).one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "Login successful"
        assert response.json["token"] is not None
        assert user.last_login is not None

    def test_login_user_with_invalid_username(self, client: FlaskClient, password: str) -> None:
        """Test user login with invalid username."""
        response = client.post(
            "/api/auth/login", headers={"Authorization": f"Basic {self.create_credentials('invalid', password)}"}
        )

        assert response.status_code == 401
        assert response.json["error"] == "User not found"

    def test_login_user_with_invalid_password(self, client: FlaskClient, username: str) -> None:
        """Test user login with invalid password."""
        response = client.post(
            "/api/auth/login", headers={"Authorization": f"Basic {self.create_credentials(username, 'invalid')}"}
        )

        assert response.status_code == 401
        assert response.json["error"] == "Invalid password"

    def test_login_user_with_missing_credentials(self, client: FlaskClient) -> None:
        """Test user login with missing credentials."""
        response = client.post("/api/auth/login")

        assert response.status_code == 401
        assert response.json["error"] == "Missing username or password"

    def test_login_user_with_empty_credentials(self, client: FlaskClient) -> None:
        """Test user login with empty credentials."""
        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {self.create_credentials('', '')}"})

        assert response.status_code == 401
        assert response.json["error"] == "Missing username or password"

    def test_login_user_with_invalid_credentials(self, client: FlaskClient) -> None:
        """Test user login with invalid (non-base64 encoded)credentials."""
        response = client.post("/api/auth/login", headers={"Authorization": "Basic invalid"})

        assert response.status_code == 401
        assert response.json["error"] == "Missing username or password"


class TestUsersRoutes:
    """Test suites for the /api/users routes."""

    @pytest.fixture(scope="function", autouse=True)
    def create_admin(self, session: Session, admin_username: str, password: str, admin_email: str) -> None:
        """Create an admin user in the database."""
        admin = Users(username=admin_username, password=password, email=admin_email, is_admin=True)
        session.add(admin)
        session.commit()

    @pytest.fixture(scope="function", autouse=True)
    def create_user(self, session: Session, username: str, password: str, email: str) -> None:
        """Create a user in the database."""
        user = Users(username=username, password=password, email=email)
        session.add(user)
        session.commit()

    @pytest.fixture(scope="function")
    def admin_token(self, client: FlaskClient, admin_credentials: str) -> str:
        """Return the admin token."""
        return client.post("/api/auth/login", headers={"Authorization": f"Basic {admin_credentials}"}).json["token"]

    @pytest.fixture(scope="function")
    def user_token(self, client: FlaskClient, user_credentials: str) -> str:
        """Return the user token."""
        return client.post("/api/auth/login", headers={"Authorization": f"Basic {user_credentials}"}).json["token"]

    def test_get_all_users(self, client: FlaskClient, admin_token: str) -> None:
        """Test get all users."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": "all"})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched all users"
        assert response.json["users"] is not None
        assert len(response.json["users"]) == 2

    def test_get_all_users_with_invalid_token(self, client: FlaskClient) -> None:
        """Test get all users with invalid token."""
        response = client.get("/api/users/", headers={"Authorization": "Bearer invalid"}, json={"uuid": "all"})

        assert response.status_code == 401
        assert response.json["error"] == "Invalid token"

    def test_get_all_users_with_expired_token(self, client: FlaskClient, admin_token: str) -> None:
        """Test get all users with expired token."""
        token = jwt.decode(
            jwt=admin_token,
            key=str(current_app.config["SECRET_KEY"]),
            algorithms=str(current_app.config["JWT_ALGORITHM"]),
        )
        token["exp"] = datetime.now(UTC) - timedelta(seconds=1)
        token = jwt.encode(
            payload=token,
            key=str(current_app.config["SECRET_KEY"]),
            algorithm=str(current_app.config["JWT_ALGORITHM"]),
        )
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {token}"}, json={"uuid": "all"})

        assert response.status_code == 401
        assert response.json["error"] == "Token expired"

    def test_get_all_users_with_deleted_admin(
        self, client: FlaskClient, admin_username: str, admin_token: str, session: Session
    ) -> None:
        """Test get all users with deleted admin."""
        session.query(Users).filter_by(username=admin_username).delete()
        session.commit()
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": "all"})

        assert response.status_code == 401
        assert response.json["error"] == "User not found"

    def test_get_all_users_with_non_admin(self, client: FlaskClient, user_token: str) -> None:
        """Test get all users with non-admin."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": "all"})

        assert response.status_code == 403
        assert response.json["error"] == "Unauthorized. Insufficient permissions"

    def test_get_user_by_uuid_with_admin(self, client: FlaskClient, admin_token: str, username: str) -> None:
        """Test get user by UUID with admin."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": uuid})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched user by UUID"
        assert response.json["users"][0]["username"] == username

    def test_get_user_by_uuid_with_non_admin(self, client: FlaskClient, user_token: str, username: str) -> None:
        """Test get user by UUID with non-admin."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": uuid})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched user by UUID"
        assert response.json["users"][0]["username"] == username

    def test_get_user_own_data(self, client: FlaskClient, user_token: str, username: str) -> None:
        """Test get user's own data."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={})

        assert response.status_code == 200
        assert response.json["message"] == "Fetched current user"
        assert response.json["users"][0]["username"] == username

    def test_get_non_existent_user_by_uuid_with_admin(
        self, client: FlaskClient, admin_token: str, username: str, session: Session
    ) -> None:
        """Test get non-existent user by UUID with admin."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        session.query(Users).filter_by(username=username).delete()
        session.commit()
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": uuid})

        assert response.status_code == 404
        assert response.json["error"] == "User not found"

    def test_get_non_existent_user_by_uuid_with_user(self, client: FlaskClient, user_token: str) -> None:
        """Test get non-existent user by UUID with user."""
        response = client.get(
            "/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": "non-existent"}
        )

        assert response.status_code == 404
        assert response.json["error"] == "User not found"

    def test_delete_user_by_uuid_with_admin(
        self, client: FlaskClient, admin_token: str, username: str, session: Session
    ) -> None:
        """Test delete user by UUID with admin."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        response = client.delete("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": uuid})

        assert response.status_code == 200
        assert response.json["message"] == "User deleted"
        assert session.query(Users).filter_by(username=username).one_or_none() is None

    def test_delete_user_by_uuid_with_non_admin(
        self, client: FlaskClient, user_token: str, username: str, session: Session
    ) -> None:
        """Test delete user by UUID with non-admin."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        response = client.delete("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": uuid})

        assert response.status_code == 200
        assert response.json["message"] == "User deleted"
        assert session.query(Users).filter_by(username=username).one_or_none() is None

    def test_delete_user_by_uuid_with_empty_payload(
        self, client: FlaskClient, user_token: str, username: str, session: Session
    ) -> None:
        """Test delete user by UUID with empty payload. Should delete the current user."""
        response = client.delete("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={})

        assert response.status_code == 200
        assert response.json["message"] == "User deleted"
        assert session.query(Users).filter_by(username=username).one_or_none() is None

    def test_delete_other_user_by_uuid_with_user(self, client: FlaskClient, user_token: str, session: Session) -> None:
        """Test delete other user by UUID with user."""
        new_user = Users(username="testuser2", password="Password123!", email="testuser2@example.com")
        session.add(new_user)
        session.commit()

        uuid = Users.query.filter_by(username="testuser2").one_or_none().uuid
        response = client.delete("/api/users/", headers={"Authorization": f"Bearer {user_token}"}, json={"uuid": uuid})

        assert response.status_code == 403
        assert response.json["error"] == "Unauthorized. Insufficient permissions"
        assert session.query(Users).filter_by(username="testuser2").one_or_none() is not None

    def test_delete_non_existent_user_by_uuid_with_admin(
        self, client: FlaskClient, admin_token: str, username: str, session: Session
    ) -> None:
        """Test delete non-existent user by UUID with admin."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        session.query(Users).filter_by(username=username).delete()
        session.commit()

        response = client.delete("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": uuid})

        assert response.status_code == 404
        assert response.json["error"] == "User not found"

    def test_update_user_by_uuid_with_admin(
        self, client: FlaskClient, admin_token: str, username: str, session: Session
    ) -> None:
        """Test update user by UUID with admin with all fields."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        response = client.put(
            "/api/users/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "uuid": uuid,
                "user": {
                    "username": "newusername",
                    "password": "Password123!",
                    "email": "newemail@example.com",
                    "is_admin": False,
                },
            },
        )
        session.commit()

        user = Users.query.filter_by(uuid=uuid).one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "User updated"
        assert user is not None
        assert user.username == "newusername"
        assert user.email == "newemail@example.com"
        assert user.is_admin is False
        assert user.verify_password("Password123!") is True

    def test_update_user_by_uuid_with_admin_with_missing_user_data(
        self, client: FlaskClient, admin_token: str, username: str
    ) -> None:
        """Test update user by UUID with admin with missing user data."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        response = client.put("/api/users/", headers={"Authorization": f"Bearer {admin_token}"}, json={"uuid": uuid})

        assert response.status_code == 400
        assert response.json["error"] == "User data is required"

    def test_update_user_by_uuid_with_admin_with_missing_uuid(
        self, client: FlaskClient, admin_token: str, admin_username: str
    ) -> None:
        """Test update user by UUID with admin with missing UUID. Should update the admin's own data."""
        response = client.put(
            "/api/users/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "user": {
                    "username": "newadminusername",
                    "password": "Password12345!",
                    "email": "newadminemail@example.com",
                    "is_admin": True,
                }
            },
        )

        admin = Users.query.filter_by(username="newadminusername").one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "User updated"
        assert admin is not None
        assert admin.username == "newadminusername"
        assert admin.email == "newadminemail@example.com"
        assert admin.is_admin is True
        assert admin.verify_password("Password12345!") is True

    def test_update_user_by_uuid_with_user_with_missing_uuid(
        self, client: FlaskClient, user_token: str, username: str, email: str, password: str
    ) -> None:
        """Test update user by UUID with user with missing UUID. Should update the user's own data."""
        response = client.put(
            "/api/users/",
            headers={"Authorization": f"Bearer {user_token}"},
            json={
                "user": {
                    "username": "new" + username,
                    "password": "new" + password,
                    "email": "new" + email,
                    "is_admin": False,
                }
            },
        )

        user = Users.query.filter_by(username="new" + username).one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "User updated"
        assert user is not None
        assert user.username == "new" + username
        assert user.email == "new" + email
        assert user.is_admin is False
        assert user.verify_password("new" + password) is True

    def test_update_user_by_uuid_with_only_username(self, client: FlaskClient, user_token: str, username: str) -> None:
        """Test update user by UUID with user with only username."""
        uuid = Users.query.filter_by(username=username).one_or_none().uuid
        response = client.put(
            "/api/users/",
            headers={"Authorization": f"Bearer {user_token}"},
            json={"uuid": uuid, "user": {"username": "new" + username}},
        )
        user = Users.query.filter_by(username="new" + username).one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "User updated"
        assert user is not None
        assert user.username == "new" + username

    def test_update_user_by_uuid_with_only_username_without_uuid(
        self, client: FlaskClient, user_token: str, username: str
    ) -> None:
        """Test update user by UUID with user with only username without UUID. Should update the user's own data."""
        response = client.put(
            "/api/users/",
            headers={"Authorization": f"Bearer {user_token}"},
            json={"user": {"username": "new" + username}},
        )
        user = Users.query.filter_by(username="new" + username).one_or_none()

        assert response.status_code == 200
        assert response.json["message"] == "User updated"
        assert user is not None
        assert user.username == "new" + username


class TestProjectsRoutes:
    """Test suites for the /api/projects routes."""

    @pytest.fixture(scope="function", autouse=True)
    def admin(self, session: Session, admin_username: str, password: str, admin_email: str) -> None:
        """Create an admin user in the database."""
        admin = Users(username=admin_username, password=password, email=admin_email, is_admin=True)
        session.add(admin)
        session.commit()
        return admin

    def test_get_all_projects_with_empty_database(self, client: FlaskClient) -> None:
        """Test get all projects with empty database."""
        response = client.get("/api/projects/")

        assert response.status_code == 200
        assert response.json["message"] == "Fetched all projects"
        assert response.json["projects"] == []

    def test_get_all_projects_with_non_empty_database(
        self, client: FlaskClient, admin: Users, session: Session
    ) -> None:
        """Test get all projects with non-empty database."""
        num_projects = random.randint(5, 20)

        projects = []
        for _ in range(num_projects):
            project = Projects(
                title=f"Project {_ + 1}",
                description=f"Description {_ + 1}",
                owner_id=admin._id,
                is_featured=random.choice([True, False]),
                tags=random.sample(string.ascii_letters, random.randint(1, 10)),
            )
            session.add(project)
            projects.append(project)
        session.flush()

        response = client.get("/api/projects/")

        assert response.status_code == 200
        assert response.json["message"] == "Fetched all projects"
        assert len(response.json["projects"]) == num_projects
        for project in projects:
            assert project.to_dict() in response.json["projects"]
