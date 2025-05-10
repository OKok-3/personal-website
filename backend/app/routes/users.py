from flask import Blueprint, jsonify
from app.models import Users
from app.routes.decorators import auth_required

users_bp = Blueprint("users", __name__)


@users_bp.route("/", methods=["GET"])
@auth_required
def get_users(current_user: Users):
    """Get all users."""
    # Check if the current user is an admin
    if not current_user.admin:
        return jsonify({"error": "Insufficient permissions"}), 403

    # Get all users
    data = Users.query.all()
    return jsonify([user.to_dict() for user in data]), 200
