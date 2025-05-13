from flask import Flask  # noqa: D104
from app.utils import load_config
from app.routes import users_bp, auth_bp, projects_bp
from app.extensions import db


def create_app(test_config=None):
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)

    # Initialize the
    if test_config is None:
        load_config(app)
    else:
        app.config.from_mapping(test_config)

    # Initialize the database extension
    db.init_app(app)

    # Create the database tables
    with app.app_context():
        db.create_all()

    # Register the users blueprint
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    return app
