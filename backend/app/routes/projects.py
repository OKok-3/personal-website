from flask import Blueprint, jsonify
from app.models import Projects

projects_bp = Blueprint("projects", __name__)


@projects_bp.route("/", methods=["GET"])
def get_projects():
    """Get all projects.

    Returns:
        A JSON response containing all projects.
    """
    return jsonify(
        {"message": "Fetched all projects", "projects": [project.to_dict() for project in Projects.query.all()]}
    ), 200
