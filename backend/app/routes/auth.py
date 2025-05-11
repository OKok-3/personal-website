from datetime import datetime, timedelta, UTC

import jwt
from flask import Blueprint, jsonify, Response, request, current_app
from app.models import Users
from app.db import db


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register_user() -> Response:
    """Register a user."""
    data = request.json
    username: str | None = data.get("username", None)
    password: str | None = data.get("password", None)
    email: str | None = data.get("email", None)

    # Check if username and password are provided
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    # Check if user already exists
    user = Users.query.filter_by(username=username).one_or_none()
    if user:
        return jsonify({"error": "Username already exists"}), 401

    if email and Users.query.filter_by(email=email).one_or_none():
        return jsonify({"error": "Email already exists"}), 401

    # Create a new user
    try:
        user = Users(username=username, password=password, email=email)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 200


@auth_bp.route("/login", methods=["POST"])
def login_user() -> Response:
    """Login a user."""
    data = request.authorization
    username = data.username
    password = data.password

    # Check if username and password are provided
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 401

    # Check if user exists
    user = Users.query.filter_by(username=username).one_or_none()
    if not user:
        return jsonify({"error": "User not found"}), 401

    # Check if password is correct
    try:
        user.check_password(password)
    except VerifyMismatchError:
        return jsonify({"error": "Invalid password"}), 401

    # Generate a JWT token
    token = jwt.encode(
        payload={"public_id": user.public_id, "exp": datetime.now(UTC) + timedelta(hours=1)},
        key=str(current_app.config["SECRET_KEY"]),
        algorithm="HS256",
    )

    user.last_login = datetime.now(UTC)
    db.session.commit()

    return jsonify({"message": "Login successful", "token": token, "user_id": user.public_id}), 200
