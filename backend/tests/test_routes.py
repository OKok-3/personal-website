import pytest
from flask.testing import FlaskClient
from flask import Flask
import base64
from flask_sqlalchemy import SQLAlchemy


@pytest.fixture(scope="module")
def client(app: Flask) -> FlaskClient:
    """Create a test client."""
    return app.test_client()


@pytest.fixture(scope="function", autouse=True)
def clear_database(db: SQLAlchemy):
    """Set up and tear down the database for each test."""
    db.drop_all()
    db.create_all()


def create_user(client: FlaskClient, username: str = "testuser", password: str = "Testuser123!"):
    """Create a user."""
    return client.post("/api/auth/register", json={"username": username, "password": password})


class TestAuthRoutes:
    """Test suite for the auth routes. THESE TESTS ARE IN ORDER."""

    def test_register_user(self, client: FlaskClient):
        """Test the register user route."""
        response = create_user(client)
        assert response.status_code == 200
        assert response.json["message"] == "User registered successfully"

    def test_register_user_existing(self, client: FlaskClient):
        """Test the register user route with an existing user."""
        create_user(client)
        response = create_user(client)

        assert response.status_code == 401
        assert response.json["error"] == "User already exists"

    def test_register_user_missing_username(self, client: FlaskClient):
        """Test the register user route with a missing username."""
        response = create_user(client, username=None)
        assert response.status_code == 400
        assert response.json["error"] == "Missing username or password"

    def test_register_user_missing_password(self, client: FlaskClient):
        """Test the register user route with a missing password."""
        response = create_user(client, password=None)
        assert response.status_code == 400
        assert response.json["error"] == "Missing username or password"

    def test_login_user_empty_credentials(self, client: FlaskClient):
        """Test the login user route with empty credentials."""
        response = create_user(client, username="", password="")
        assert response.status_code == 400
        assert response.json["error"] == "Missing username or password"

    def test_register_user_invalid_password(self, client: FlaskClient):
        """Test the register user route with an invalid password."""
        response = create_user(client, password="Invalidpassword")
        assert response.status_code == 400
        assert response.json["error"] is not None

    def test_login_user(self, client: FlaskClient):
        """Test the login user route."""
        create_user(client)
        encoded_credentials = base64.b64encode(b"testuser:Testuser123!").decode("utf-8")
        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {encoded_credentials}"})

        print(response.data.decode("utf-8"))

        assert response.json["message"] == "Login successful"
        assert response.status_code == 200
        assert response.json["token"] is not None

    def test_login_user_invalid_credentials(self, client: FlaskClient):
        """Test the login user route with invalid credentials."""
        create_user(client)
        encoded_credentials = base64.b64encode(b"testuser:Invalidpassword").decode("utf-8")
        response = client.post("/api/auth/login", headers={"Authorization": f"Basic {encoded_credentials}"})

        assert response.status_code == 401
        assert response.json["error"] == "Invalid password"
