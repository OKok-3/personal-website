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
