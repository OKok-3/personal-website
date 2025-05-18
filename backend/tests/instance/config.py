# Configuration for testing only
import os
import tempfile
from datetime import timedelta

# Create a temporary database
db_fd, db_path = tempfile.mkstemp()

SECRET_KEY: str = "dev"
SQLALCHEMY_DATABASE_URI: str = f"sqlite:///{db_path}"
SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
JWT_TTL: timedelta = timedelta(seconds=30)
JWT_ALGORITHM: str = "HS256"

MAX_CONTENT_LENGTH: int = 5 * 1024 * 1024  # 5 MB
MAX_FORM_MEMORY_SIZE: int = 5 * 1024 * 1024  # 5 MB
STATIC_FOLDER: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

ALLOWED_FILE_TYPES: list[str] = ["image", "document"]
ALLOWED_EXTENSIONS: list[str] = ["svg", "png"]

# Teardown to close and remove the temporary database
os.close(db_fd)
os.unlink(db_path)
