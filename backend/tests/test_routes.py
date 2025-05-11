from collections.abc import Generator

import pytest
from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy



@pytest.fixture(scope="function", autouse=True)
def teardown_db(db: SQLAlchemy) -> Generator[None]:
    """Drop all tables and create them again after each test."""
    db.drop_all()
    db.create_all()


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

        assert response.status_code == 400
        assert (
            response.json["error"]
            == "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"  # noqa: E501
        )
