import os

from flask import Blueprint, jsonify, request, Response, current_app, send_file
from werkzeug.utils import secure_filename

from app.extensions import db
from app.decorators import auth_required
from app.models.files import Files

files_bp = Blueprint("files", __name__)


@files_bp.route("/upload/<file_type>", methods=["POST"])
@auth_required(admin_required=True)
def upload_file(file_type: str, **kwargs) -> Response:
    """Route for uploading a file.

    The payload must contain the following fields:
        - file: File - The file to upload
    """
    file = request.files["file"]

    if not file:
        return jsonify({"error": "No file provided"}), 400

    filename = secure_filename(file.filename)
    extension = filename.split(".")[-1].lower()

    try:
        # Create an entry in the database for the file
        file = Files(name=filename, file_type=file_type, extension=extension)
        db.session.add(file)
        db.session.flush()
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Error creating file entry in the database: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error creating file entry in the database: {e}"}), 500

    # Save the file and the entry in the database
    db.session.commit()
    file.save(os.path.join(current_app.config["STATIC_FOLDER"], f"{file_type}", f"{file.uuid}.{extension}"))

    return jsonify({"message": "File uploaded successfully", "uuid": file.uuid}), 200


@files_bp.route("/<file_uuid>", methods=["DELETE"])
@auth_required(admin_required=True)
def delete_file(file_uuid: str, **kwargs) -> Response:
    """Route for deleting a file."""
    file = Files.query.filter_by(uuid=file_uuid).one_or_none()
    if not file:
        return jsonify({"error": "File not found"}), 404

    db.session.delete(file)
    db.session.commit()

    return jsonify({"message": "File deleted successfully"}), 200


@files_bp.route("/<file_uuid>", methods=["GET"])
def get_file(file_uuid: str, **kwargs) -> Response:
    """Route for getting a file.

    The route also allows to specify if the file should be returned as an attachment or not.

    The payload must contain the following fields:
        - as_attachment: Whether to return the file as an attachment or not
    """
    json_data: dict = request.get_json(silent=True) or {}
    as_attachment: bool = json_data.get("as_attachment", False)

    file = Files.query.filter_by(uuid=file_uuid).one_or_none()
    if not file:
        return jsonify({"error": "File not found"}), 404

    return send_file(
        os.path.join(current_app.config["STATIC_FOLDER"], f"{file.file_type}", f"{file.uuid}.{file.extension}"),
        as_attachment=as_attachment,
    )


@files_bp.route("/<file_uuid>", methods=["PUT"])
def update_file(file_uuid: str, **kwargs) -> Response:
    """Route for updating a file.

    The payload should contain at least one of the following fields:
        - name: The name of the file
        - file_type: The type of the file
        - extension: The extension of the file
    """
    file = Files.query.filter_by(uuid=file_uuid).one_or_none()

    if not file:
        return jsonify({"error": "File not found"}), 404

    json_data: dict = request.get_json(silent=True) or {}
    name: str | None = json_data.get("name", file.name)
    file_type: str | None = json_data.get("file_type", file.file_type)
    extension: str | None = json_data.get("extension", file.extension)

    try:
        file.name = name
        file.file_type = file_type
        file.extension = extension
    except (ValueError, AttributeError) as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error updating file: {e}"}), 500

    db.session.commit()

    return jsonify({"message": "File updated successfully"}), 200
