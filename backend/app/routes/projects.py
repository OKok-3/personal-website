from flask import Blueprint, jsonify, request, Response
from app.models import Projects

projects_bp = Blueprint("projects", __name__)


@projects_bp.route("/", methods=["GET"])
def get_projects() -> Response:
    """Get all projects.

    Returns:
        A JSON response containing all projects.
    """
    json_data: dict = request.get_json(silent=True) or {}
    uuid: str | None = json_data.get("uuid")

    projects: list[Projects] = []
    message: str = ""

    # If nothing is provided, assume all projects are requested
    if not uuid:
        projects.extend(Projects.query.all())
        message = "Fetched all projects"
    else:
        projects.append(Projects.query.filter(Projects.uuid == uuid).one_or_none())
        message = "Fetched project by UUID"

    return jsonify({"message": message, "projects": [project.to_dict() for project in projects]}), 200
