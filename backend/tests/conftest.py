import tempfile
import os
from collections.abc import Generator
from datetime import timedelta

import pytest
from flask import Flask
from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session

from app import create_app, db as _db


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
            "JWT_TTL": timedelta(minutes=1),
            "JWT_ALGORITHM": "HS512",
        }
    )

    yield app

    # Teardown: close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture(scope="class")
def db(app: Flask) -> Generator[SQLAlchemy]:
    """Create the database tables."""
    with app.app_context():
        _db.create_all()
        yield _db
        _db.drop_all()


@pytest.fixture(scope="function")
def session(db: SQLAlchemy) -> Generator[Session]:
    """Create a transaction for each test and roll it back when done."""
    session = db.session

    # Start with a fresh session
    session.begin_nested()

    yield session

    session.rollback()

    # Delete all data from all tables
    for table in db.metadata.sorted_tables:
        session.execute(table.delete())

    session.commit()
    session.close()


@pytest.fixture(scope="session")
def client(app: Flask) -> Generator[FlaskClient]:
    """Create a test client for the app."""
    with app.app_context():
        yield app.test_client()
