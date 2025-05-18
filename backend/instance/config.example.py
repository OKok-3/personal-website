# Example configuration file for the application. ASSUMES TO BE IN THE INSTANCE FOLDER.
import os
from datetime import timedelta

SECRET_KEY: str = ""

SQLALCHEMY_DATABASE_URI: str = "sqlite://"
SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
JWT_TTL: timedelta = timedelta(seconds=1)
JWT_ALGORITHM: str = "HS256"

MAX_CONTENT_LENGTH: int = 0
MAX_FORM_MEMORY_SIZE: int = 0
STATIC_FOLDER: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

ALLOWED_FILE_TYPES: list[str] = []
ALLOWED_EXTENSIONS: list[str] = []
