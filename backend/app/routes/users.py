from flask import Blueprint, jsonify, Response, request
from app.models import Users
from app.routes.decorators import auth_required

users_bp = Blueprint("users", __name__)


@users_bp.route("/", methods=["GET"])
@auth_required()
def get_user(**kwargs) -> Response:
    """Get a user by UUID or all users.

    The payload should be a JSON object with the following keys:
    - uuid: The UUID of the user to get.

    If the uuid field is "all" and the user is an admin, all users will be returned.
    Otherwise, the user will only see their own data.

    Args:
        uuid (str): The UUID of the user to get.
        **kwargs: Additional keyword arguments.
        current_user (Users): The current user.

    Returns:
        Response: A response object containing the user data.
    """
    uuid = request.json.get("uuid")

    # Get all users if the user is an admin and the uuid is "all"
    if uuid == "all" and kwargs["current_user"].is_admin:
        data = Users.query.all()
        return jsonify({"message": "Fetched all users", "users": [user.to_dict() for user in data]}), 200

    # Reject the request if the user is not an admin and the uuid is "all"
    if uuid == "all" and not kwargs["current_user"].is_admin:
        return jsonify({"error": "Unauthorized. Insufficient permissions"}), 403

    # Get the user's own data if the uuid is not provided
    if not uuid:
        return jsonify({"message": "Fetched current user", "users": [kwargs["current_user"].to_dict()]}), 200

    # Get the user's data by UUID
    data = Users.query.filter(Users.uuid == uuid).one_or_none()

    if not data:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "Fetched user by UUID", "users": [data.to_dict()]}), 200
