"""Package for the backend."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Instantiate the database extension
db = SQLAlchemy()


def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)

    # Check if the instance folder exists
    if not app.config.from_pyfile("config.py"):
        raise FileNotFoundError("No config file found in the instance folder")

    # Initialize the database extension
    db.init_app(app)

    return app
