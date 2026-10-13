"""Seed data inserted on startup so the menu endpoint returns real data.

The seed runs after ``Base.metadata.create_all`` in ``main.py``. It is
idempotent: if at least one category already exists the seed is a no-op, so
restarting the server does not duplicate rows.
"""

from sqlalchemy.orm import Session

from app.models import Category, MenuItem

__all__ = ["run_seed"]


def run_seed(session: Session) -> None:
    """Insert seed categories and menu items when the database is empty."""
    if session.query(Category).first() is not None:
        return

    coffee = Category(name="Coffee", display_order=1)
    tea = Category(name="Tea", display_order=2)
    pastries = Category(name="Pastries", display_order=3)

    session.add_all([coffee, tea, pastries])
    session.flush()

    items = [
        MenuItem(
            category_id=coffee.id,
            name="Espresso",
            description="A rich, concentrated shot of our house blend.",
            price=3.00,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=coffee.id,
            name="Americano",
            description="Espresso diluted with hot water for a smooth cup.",
            price=3.50,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=coffee.id,
            name="Latte",
            description="Espresso with steamed milk and a light foam.",
            price=4.50,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=coffee.id,
            name="Cappuccino",
            description="Equal parts espresso, steamed milk, and milk foam.",
            price=4.00,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=coffee.id,
            name="Caramel Macchiato",
            description="Vanilla and caramel over espresso and steamed milk.",
            price=5.00,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=tea.id,
            name="Green Tea",
            description="Freshly brewed green tea, light and refreshing.",
            price=2.50,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=tea.id,
            name="Black Tea",
            description="Classic full-bodied black tea.",
            price=2.50,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=tea.id,
            name="Chai Latte",
            description="Spiced black tea with steamed milk and honey.",
            price=4.00,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=pastries.id,
            name="Butter Croissant",
            description="Flaky, buttery croissant baked fresh daily.",
            price=3.50,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=pastries.id,
            name="Blueberry Muffin",
            description="Moist muffin packed with fresh blueberries.",
            price=3.00,
            image_url=None,
            is_available=True,
        ),
        MenuItem(
            category_id=pastries.id,
            name="Everything Bagel",
            description="Toasted bagel with cream cheese.",
            price=3.25,
            image_url=None,
            is_available=True,
        ),
    ]

    session.add_all(items)
    session.commit()