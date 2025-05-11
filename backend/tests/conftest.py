import tempfile
import os
from collections.abc import Generator
from datetime import timedelta
import pytest
from app import create_app, db as _db
from flask import Flask
from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session


@pytest.fixture(scope="session")
def app() -> Generator[Flask]:
    """Create a temporary database and app."""
    # Create a temporary database
    db_fd, db_path = tempfile.mkstemp()

    # Create the app
    app = create_app(
        test_config={
            "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
            "SQLALCHEMY_TRACK_MODIFICATIONS": False,
            "JWT_TTL": timedelta(days=1),
            "JWT_ALGORITHM": "HS512",
        }
    )

    yield app

    # Teardown: close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture(scope="session")
def db(app: Flask) -> Generator[SQLAlchemy]:
    """Create the database tables."""
    with app.app_context():
        _db.create_all()

        yield _db

        _db.session.remove()
        _db.drop_all()


@pytest.fixture(scope="function")
def session(db: SQLAlchemy) -> Generator[Session]:
    """Create a transaction for each test and roll it back when done."""
    connection = db.engine.connect()
    connection.begin()

    # Create a session bound to the connection
    session = db.session

    yield session

    # Roll back the transaction after the test is done
    session.rollback()
    connection.close()


@pytest.fixture(scope="session")
def client(app: Flask) -> Generator[FlaskClient]:
    """Create a test client for the app."""
    with app.test_client() as client:
        yield client


@pytest.fixture()
def username() -> str:  # noqa: D103
    return "testuser"


@pytest.fixture()
def password() -> str:  # noqa: D103
    return "Test1234!"


@pytest.fixture()
def email() -> str:  # noqa: D103
    return "test@example.com"
