from flask import Blueprint, jsonify, request, Response
from app.models import Projects
from app.routes.decorators import auth_required
from app.extensions import db

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


@projects_bp.route("/", methods=["POST"])
@auth_required(admin_required=True)
def create_project(**kwargs) -> Response:
    """Create a new project.

    The payload must contain the following fields:
        - title: str - The title of the project
        - description: str - The description of the project
        - is_featured: bool - Whether the project is featured
        - tags: list[str] - The tags of the project

    Returns:
        The UUID of the new project.
    """
    json_data: dict = request.get_json(silent=True) or {}
    title: str | None = json_data.get("title")
    description: str | None = json_data.get("description")
    is_featured: bool | None = json_data.get("is_featured")
    tags: list[str] | None = json_data.get("tags")

    # if not title or not description or not is_featured or not tags:
    #     return jsonify({"message": "Missing required fields"}), 400

    try:
        project = Projects(
            title=title, description=description, is_featured=is_featured, tags=tags, owner_id=kwargs["current_user"].id
        )
        db.session.add(project)
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    db.session.commit()

    return jsonify({"message": "Project created", "uuid": project.uuid}), 201
