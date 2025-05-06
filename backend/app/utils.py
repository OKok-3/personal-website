import secrets

from flask import Flask


def load_config(app: Flask) -> None:
    """Load the config file.

    If the config file is not found, a sample config file will be created.

    Args:
        app (Flask): The Flask app.
    """
    try:
        app.config.from_pyfile("config.py")
    except FileNotFoundError:
        with open(f"{app.instance_path}/config.py", "w") as f:
            f.write("import os\n\n")
            f.write(f'SECRET_KEY="{secrets.token_hex(64)}"\n')
            f.write('SQLALCHEMY_DATABASE_URI=f"sqlite:///{os.path.join(os.path.dirname(__file__), "db.sqlite")}"\n')
            f.write("SQLALCHEMY_TRACK_MODIFICATIONS=False\n")

        raise FileNotFoundError(
            "No config file found in the instance folder."
            "A sample config file has been created for you."
            "Please edit the config file and try again."
        )
