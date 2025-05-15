from flask import Blueprint, jsonify, Response, request

from app.models import PageData, Users
from app.extensions import db
from app.decorators import auth_required

page_data_bp = Blueprint("page_data", __name__)


@page_data_bp.route("/<page>", methods=["GET"])
def get_page_data(page: str, **kwargs) -> Response:
    """Get the page data for the given page."""
    page_data = PageData.query.filter_by(page=page).one_or_none()
    return jsonify({"message": "Fetched page data", "data": page_data.data})


@page_data_bp.route("/<page>", methods=["POST"])
@auth_required(admin_required=True)
def create_page_data(page: str, current_user: Users, **kwargs) -> Response:
    """Create a new page data for the given page."""
    data: dict | None = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "No data provided"}), 400

    page_name: str | None = data.get("page", None)
    page_data: dict = data.get("data", {})

    if not page_name:
        return jsonify({"error": "Page name is required"}), 400

    if PageData.query.filter_by(page=page_name).one_or_none():
        return jsonify({"error": "Page already exists"}), 400

    try:
        page_data = PageData(page=page_name, data=page_data, owner_id=current_user.id)
    except ValueError as e:
        return jsonify({"error": f"Error creating page data: {str(e)}"}), 400

    db.session.add(page_data)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": f"Page data created for page {page}"}), 201
