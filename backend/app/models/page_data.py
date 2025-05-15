import re
from typing import TYPE_CHECKING

from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, validates, relationship
from sqlalchemy.types import Integer, JSON, String
from sqlalchemy.schema import ForeignKey

if TYPE_CHECKING:
    from app.models import Users


class PageData(db.Model):  # noqa: D101
    """Model for storing page data.

    # NOTE: This model won't have any validation because the data is indeterminant, and doesn't really need validation.
    """

    __tablename__ = "page_data"

    page: Mapped[str] = mapped_column(String(255), primary_key=True)
    data: Mapped[dict] = mapped_column(JSON)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    owner: Mapped["Users"] = relationship(back_populates="page_data")

    def __init__(self, *args, **kwargs) -> None:
        """Initialize a new PageData object."""
        self.page = kwargs.get("page")
        self.data = kwargs.get("data")
        self.owner_id = kwargs.get("owner_id")

        super().__init__(*args, **kwargs)

    @validates("page")
    def validate_page(self, key: str, value: str) -> str:
        """Validate the page name."""
        if not value:
            raise ValueError("Page cannot be empty")

        # Regex to check if page name only contains letters, numbers, underscores, and hyphens
        if not re.match(r"^[a-zA-Z0-9_-]+$", value):
            raise ValueError("Page must contain only letters, numbers, underscores, and hyphens")

        return value

    @validates("data")
    def validate_data(self, key: str, value: dict) -> dict:
        """Validate the data."""
        if not value:
            raise ValueError("Data cannot be empty")

        return value

    def __repr__(self) -> str:  # noqa: D105
        return f"<PageData {self.page} {self.data}>"
