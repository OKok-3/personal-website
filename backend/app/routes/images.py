import os

from flask import Blueprint, jsonify, request, Response, current_app
from werkzeug.utils import secure_filename

from app.extensions import db
from app.decorators import auth_required
from app.models.images import Images

images_bp = Blueprint("images", __name__)


@images_bp.route("/upload/<image_type>", methods=["POST"])
@auth_required(admin_required=True)
def upload_image(image_type: str, **kwargs) -> Response:
    """Route for uploading an image.

    The payload must contain the following fields:
        - image_type: str - The type of the image
    """
    # If the image_type is not provided, the system assumes that it's of type "image"
    if not image_type:
        image_type = "image"

    file = request.files["file"]

    if not file:
        return jsonify({"error": "You called an upload endpoint without providing a file"}), 400

    extension = secure_filename(file.filename).split(".")[-1].lower()

    try:
        # Create an entry in the database for the image
        image = Images(image_type=image_type, extension=extension)
        db.session.add(image)
        db.session.flush()
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Error creating image entry in the database: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error creating image entry in the database: {e}"}), 500

    # Save the file and the entry in the database
    db.session.commit()
    file.save(os.path.join(current_app.config["STATIC_FOLDER"], f"{image_type}s", f"{image.uuid}.{extension}"))

    return jsonify({"message": "Image uploaded successfully", "uuid": image.uuid}), 200


@images_bp.route("/<image_uuid>", methods=["DELETE"])
@auth_required(admin_required=True)
def delete_image(image_uuid: str, **kwargs) -> Response:
    """Route for deleting an image."""
    image = Images.query.filter_by(uuid=image_uuid).one_or_none()
    if not image:
        return jsonify({"error": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Image deleted successfully"}), 200
