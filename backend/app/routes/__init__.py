"""Routes for the application."""

from app.routes.users import users_bp
from app.routes.auth import auth_bp
from app.routes.projects import projects_bp
from app.routes.page_data import page_data_bp
from app.routes.uploads import uploads_bp

__all__ = ["users_bp", "auth_bp", "projects_bp", "page_data_bp", "uploads_bp"]
