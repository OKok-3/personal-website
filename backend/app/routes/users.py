from flask import Blueprint, jsonify, Response, request
from app.models import Users
from app.decorators import auth_required
from app.extensions import db

users_bp = Blueprint("users", __name__)


@users_bp.route("/", methods=["GET"])
@auth_required()
def get_user(**kwargs) -> Response:
    """Get a user by UUID, email, username, or any combination of the three.

    The payload should be a JSON object with at least one of the following keys:
    - uuid: The UUID of the user to get.
    - email: The email of the user to get.
    - username: The username of the user to get.

    If the uuid field is "all" and the user is an admin, all users will be returned.
    Otherwise, the user will only see their own data.

    Args:
        uuid (str): The UUID of the user to get.
        **kwargs: Additional keyword arguments.
        current_user (Users): The current user.

    Returns:
        Response: A response object containing user data.
    """
    if not request.get_json(silent=True):
        uuid, username, email = None, None, None
    else:
        uuid = request.json.get("uuid", None)
        username = request.json.get("username", None)
        email = request.json.get("email", None)

    # For cases where the client is requesting all users
    if uuid == "all":
        if not kwargs["current_user"].is_admin:
            return jsonify({"error": "Unauthorized. Insufficient permissions"}), 403

        data = Users.query.all()
        return jsonify({"message": "Fetched all users", "users": [user.to_dict() for user in data]}), 200

    # For cases where the client is requesting a specific user
    attr: str = ""
    if uuid:
        user = Users.query.filter(Users.uuid == uuid).one_or_none()
        attr = "uuid"
    elif username:
        user = Users.query.filter(Users.username == username).one_or_none()
        attr = "username"
    elif email:
        user = Users.query.filter(Users.email == email).one_or_none()
        attr = "email"
    else:
        # The case where the client is requesting their own data
        user = kwargs["current_user"]
        attr = "self"

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.uuid != kwargs["current_user"].uuid and not kwargs["current_user"].is_admin:
        return jsonify({"error": "Unauthorized. Insufficient permissions"}), 403

    return jsonify({"message": f"Fetched user by {attr}", "users": [user.to_dict()]}), 200


@users_bp.route("/", methods=["DELETE"])
@auth_required()
def delete_user(**kwargs) -> Response:
    """Delete a user by UUID. UUID must be provided to delete a user.

    The payload should be a JSON object with the following keys:
    - uuid: The UUID of the user to delete.

    Returns:
        Response: A response object containing a message.
    """
    json_data = request.get_json(silent=True)
    if not json_data or not json_data.get("uuid"):
        return jsonify({"error": "Missing uuid"}), 400
    else:
        uuid = json_data.get("uuid")

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
    """Update a user by UUID. UUID must be provided to update a user.

    The payload should be a JSON object with the following keys:
    - uuid: The UUID of the user to update.
    - username: The new username of the user.
    - email: The new email of the user.
    - password: The new password of the user.
    - is_admin: Whether the user is an admin.

    Returns:
        Response: A response object containing a message.
    """
    json_data = request.get_json(silent=True)
    if not json_data or not json_data.get("uuid"):
        return jsonify({"error": "Missing uuid"}), 400
    else:
        uuid = json_data.get("uuid")

    username = json_data.get("username", None)
    email = json_data.get("email", None)
    password = json_data.get("password", None)
    is_admin = json_data.get("is_admin", None)

    # If the uuid is not the current user's UUID, and the user is not an admin, reject the request
    if uuid != kwargs["current_user"].uuid and not kwargs["current_user"].is_admin:
        return jsonify({"error": "Unauthorized. Insufficient permissions. Only admins can update other users"}), 403

    user = Users.query.filter(Users.uuid == uuid).one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Only admins are allowed to promote a user
    if is_admin and not kwargs["current_user"].is_admin:
        return jsonify({"error": "Unauthorized. Insufficient permissions. Only admins can promote a user"}), 403

    # Update the user's data
    user.username = username or user.username
    user.email = email if email else ""  # Email is deletable
    user.is_admin = is_admin if is_admin is not None else user.is_admin

    if password:
        user.password = password

    db.session.commit()

    return jsonify({"message": "User updated"}), 200
