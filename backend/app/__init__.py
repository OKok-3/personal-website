from flask import Flask  # noqa: D104
from app.utils import load_config
from app.routes import users_bp, auth_bp, projects_bp, page_data_bp, files_bp
from app.extensions import db


def create_app(testing: bool = False):
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)

    # Initialize the
    if testing:
        app.config.from_object("tests.instance.config")
    else:
        load_config(app)

    # Initialize the database extension
    db.init_app(app)

    # Create the database tables
    with app.app_context():
        db.create_all()

    # Register the users blueprint
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(page_data_bp, url_prefix="/api/page_data")
    app.register_blueprint(files_bp, url_prefix="/api/files")

    return app
