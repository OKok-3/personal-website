"""Routes for the application."""

from app.routes.users import users_bp
from app.routes.auth import auth_bp

__all__ = ["users_bp", "auth_bp"]
