import base64
from datetime import datetime, UTC, timedelta
from collections.abc import Generator
import pytest
import jwt
from flask.testing import FlaskClient
from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session

from app.models import Users


@pytest.fixture(scope="function", autouse=True)
def teardown_db(db: SQLAlchemy) -> Generator[None]:
    """Drop all tables and create them again after each test."""
    db.drop_all()
    db.create_all()


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

    def test_get_users(self, client: FlaskClient, admin_token: str, username: str, admin_username: str) -> None:
        """Test user login."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"})

        assert response.status_code == 200
        assert response.json["users"] is not None
        assert len(response.json["users"]) == 2

    def test_get_users_with_invalid_token(self, client: FlaskClient) -> None:
        """Test user login with invalid token."""
        response = client.get("/api/users/", headers={"Authorization": "Bearer invalid"})

        assert response.status_code == 401
        assert response.json["error"] == "Invalid token"

    def test_get_users_with_expired_token(self, client: FlaskClient, admin_token: str) -> None:
        """Test user login with expired token."""
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
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {token}"})

        assert response.status_code == 401
        assert response.json["error"] == "Token expired"

    def test_get_users_with_deleted_admin(
        self, client: FlaskClient, admin_username: str, admin_token: str, session: Session
    ) -> None:
        """Test user login with deleted admin."""
        session.query(Users).filter_by(username=admin_username).delete()
        session.commit()
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"})

        assert response.status_code == 401
        assert response.json["error"] == "User not found"

    def test_get_user_with_non_admin(self, client: FlaskClient, user_token: str) -> None:
        """Test user login with non-admin."""
        response = client.get("/api/users/", headers={"Authorization": f"Bearer {user_token}"})

        assert response.status_code == 403
        assert response.json["error"] == "Unauthorized. Insufficient permissions"
