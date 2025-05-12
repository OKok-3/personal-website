from flask import Blueprint, jsonify, Response, request
from app.models import Users
from app.routes.decorators import auth_required
from app.db import db

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
        Response: A response object containing user data.
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


@users_bp.route("/", methods=["DELETE"])
@auth_required()
def delete_user(**kwargs) -> Response:
    """Delete a user by UUID.

    The payload should be a JSON object with the following keys:
    - uuid: The UUID of the user to delete.

    Returns:
        Response: A response object containing a message.
    """
    uuid = request.json.get("uuid")

    # If the uuid is not provided, imply the user is deleting their own account
    if not uuid:
        uuid = kwargs["current_user"].uuid

    # If the uuid is not the current user's UUID, and the user is not an admin, reject the request
    if uuid != kwargs["current_user"].uuid and not kwargs["current_user"].is_admin:
        return jsonify({"error": "Unauthorized. Insufficient permissions"}), 403

    # Delete the user by UUID
    data = Users.query.filter(Users.uuid == uuid).one_or_none()

    if not data:
        return jsonify({"error": "User not found"}), 404

    # Delete the user
    db.session.delete(data)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200


@users_bp.route("/", methods=["PUT"])
@auth_required()
def update_user(**kwargs) -> Response:
    """Update a user by UUID.

    The payload should be a JSON object with the following keys:
    - uuid: The UUID of the user to update.
    - username: The new username of the user.
    - email: The new email of the user.
    - password: The new password of the user.
    - is_admin: Whether the user is an admin.

    Returns:
        Response: A response object containing a message.
    """
    uuid = request.json.get("uuid")
    # Assume user is updating their own data if no uuid is provided
    if not uuid:
        uuid = kwargs["current_user"].uuid

    user_data = request.json.get("user")
    if not user_data:
        return jsonify({"error": "User data is required"}), 400

    username = user_data.get("username")
    email = user_data.get("email")
    password = user_data.get("password")
    is_admin = user_data.get("is_admin")

    # If the uuid is not the current user's UUID, and the user is not an admin, reject the request
    if uuid != kwargs["current_user"].uuid and not kwargs["current_user"].is_admin:
        return jsonify({"error": "Unauthorized. Insufficient permissions"}), 403

    user = Users.query.filter(Users.uuid == uuid).one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the user's data
    user.username = username or user.username
    user.email = email or user.email
    user.is_admin = is_admin or user.is_admin

    if password:
        user.password = password

    db.session.commit()

    return jsonify({"message": "User updated"}), 200
