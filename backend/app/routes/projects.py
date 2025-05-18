from flask import Blueprint, jsonify, request, Response
from app.models import Projects
from app.decorators import auth_required
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
        - link: str - The link to the project showcase
        - image_id: int - The ID of the image to be associated with the project

    Returns:
        The UUID of the new project.
    """
    json_data: dict = request.get_json(silent=True) or {}
    title: str | None = json_data.get("title")
    description: str | None = json_data.get("description")
    is_featured: bool | None = json_data.get("is_featured")
    tags: list[str] | None = json_data.get("tags")
    link: str | None = json_data.get("link")

    try:
        project = Projects(
            title=title,
            description=description,
            is_featured=is_featured,
            tags=tags,
            owner_id=kwargs["current_user"].id,
            link=link,
        )
        db.session.add(project)
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    db.session.commit()

    return jsonify({"message": "Project created", "uuid": project.uuid}), 201


@projects_bp.route("/<uuid>", methods=["PUT", "DELETE"])
@auth_required(admin_required=True)
def update_project(uuid: str, **kwargs) -> Response:
    """Update a project by UUID. PUT updates a project, DELETE deletes a project.

    The payload must contain at least one of the following fields:
        - title: str - The title of the project
        - description: str - The description of the project
        - is_featured: bool - Whether the project is featured
        - tags: list[str] - The tags of the project

    If a field is not provided, or provided with an empty string,it will not be updated.

    Returns:
        A message indicating the project was updated.
    """
    project = Projects.query.filter(Projects.uuid == uuid).one_or_none()
    if not project:
        return jsonify({"message": "Project not found"}), 404

    # Deleting a project
    if request.method == "DELETE":
        try:
            db.session.delete(project)
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

        db.session.commit()
        return jsonify({"message": "Project deleted"}), 200

    # Updating a project
    json_data: dict = request.get_json(silent=True) or {}

    if not json_data:
        return jsonify({"message": "No fields provided"}), 400

    title: str | None = json_data.get("title")
    description: str | None = json_data.get("description")
    is_featured: bool | None = json_data.get("is_featured")
    tags: list[str] | None = json_data.get("tags")
    cover_image_id: int | None = json_data.get("cover_image_id")

    try:
        project.title = title or project.title
        project.description = description or project.description
        project.is_featured = is_featured if is_featured is not None else project.is_featured
        project.tags = tags or project.tags
        project.cover_image_id = cover_image_id or project.cover_image_id
    except (ValueError, AttributeError) as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    db.session.commit()

    return jsonify({"message": "Project updated"}), 200
