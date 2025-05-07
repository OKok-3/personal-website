import tempfile
import os

import pytest
from app import create_app, db as _db


@pytest.fixture(scope="session")
def app():
    """Create a temporary database and app."""
    # Create a temporary database
    db_fd, db_path = tempfile.mkstemp()

    # Create the app
    app = create_app(
        test_config={
            "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
            "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        }
    )
    with app.app_context():
        yield app

    # Teardown: close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture(scope="session")
def db(app):
    """Create the database tables."""
    _db.create_all()

    yield _db

    _db.session.remove()
    _db.drop_all()


@pytest.fixture()
def session(db):
    """Create a transaction for each test and roll it back when done."""
    connection = db.engine.connect()
    transaction = connection.begin()

    # Create a session bound to the connection
    session = db.session
    session.begin_nested()

    yield session

    # Roll back the transaction after the test is done
    session.close()
    transaction.rollback()
    connection.close()
