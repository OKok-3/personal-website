from flask import Blueprint, jsonify, Response
from app.models import Users
from app.routes.decorators import auth_required

users_bp = Blueprint("users", __name__)


@users_bp.route("/", methods=["GET"])
@auth_required(admin_required=True)
def get_users(**kwargs) -> Response:
    """Get all users."""
    data = Users.query.all()
    return jsonify(
        {
            "message": "Users fetched successfully",
            "users": [user.to_dict() for user in data],
        }
    ), 200


@users_bp.route("/<uuid>", methods=["GET"])
@auth_required()
def get_user(uuid: str, **kwargs) -> Response:
    """Get a user by UUID.

    If the user is not an admin, they can only see their own data.If the user is an admin, they can see all users.

    Args:
        uuid (str): The UUID of the user to get.
        **kwargs: Additional keyword arguments.
        current_user (Users): The current user.
        token (str): The token.

    Returns:
        Response: A response object containing the user data.
    """
    if not kwargs["current_user"].is_admin and kwargs["current_user"].uuid != uuid:
        return jsonify({"error": "Unauthorized. Insufficient permissions"}), 403

    data = Users.query.filter(Users.uuid == uuid).one_or_none()

    if not data:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User fetched successfully", "user": data.to_dict()}), 200
