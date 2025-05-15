import jwt
from functools import wraps
from flask import request, jsonify, current_app
from app.models import Users


def auth_required(admin_required: bool = False):
    """Decorator to check if the user is authenticated."""

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None

            # Check if the Authorization header is present and valid
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

            # Decode the token and check if it is valid
            try:
                data = jwt.decode(
                    jwt=token,
                    key=str(current_app.config["SECRET_KEY"]),
                    algorithms=[str(current_app.config["JWT_ALGORITHM"])],
                )
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401
            except Exception as e:
                return jsonify({"error": str(e)}), 404

            # Check if the user exists. Sometimes a valid token may belong to a deleted user
            current_user = Users.query.filter(Users.uuid == data["user"]["uuid"]).one_or_none()
            if not current_user:
                return jsonify({"error": "User not found"}), 401

            # Check if the user is an admin
            if admin_required and not current_user.is_admin:
                return jsonify({"error": "Unauthorized. Insufficient permissions"}), 403

            # Add the current user object and associated token to the kwargs
            kwargs["current_user"] = current_user
            kwargs["token"] = token
            return f(*args, **kwargs)

        return decorated_function

    return decorator
