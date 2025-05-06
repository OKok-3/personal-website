from flask import Flask  # noqa: D104
from flask_sqlalchemy import SQLAlchemy

from app.utils import load_config

# Instantiate the database extension
db = SQLAlchemy()


def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)

    # Initialize the
    load_config(app)

    # Initialize the database extension
    db.init_app(app)

    return app
