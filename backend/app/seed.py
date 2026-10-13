"""Seed data inserted on startup so the menu endpoint returns real data.

The seed runs after ``Base.metadata.create_all`` in ``main.py``. It is
idempotent: if at least one category already exists the seed is a no-op, so
restarting the server does not duplicate rows.
"""

from sqlalchemy.orm import Session

from app.models import Category, MenuItem, Order, OrderItem

__all__ = ["run_seed"]


def run_seed(session: Session) -> None:
    """Insert seed categories and menu items when the database is empty."""
    if session.query(Category).first() is not None:
        _seed_orders(session)
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
    session.flush()

    _seed_orders(session)

    session.commit()


def _seed_orders(session: Session) -> None:
    """Insert seed orders when no orders exist, referencing seeded menu items."""
    if session.query(Order).first() is not None:
        return

    order1 = Order(
        cart_order_id="ORD-00001",
        customer_name="Alice Johnson",
        pickup_time="asap",
        status="incomplete",
    )
    order2 = Order(
        cart_order_id="ORD-00002",
        customer_name="Bob Smith",
        pickup_time="15min",
        status="incomplete",
    )

    session.add_all([order1, order2])
    session.flush()

    order1_items = [
        OrderItem(
            order_id=order1.id,
            menu_item_name="Espresso",
            quantity=2,
            unit_price=3.00,
            notes="Extra shot",
        ),
        OrderItem(
            order_id=order1.id,
            menu_item_name="Butter Croissant",
            quantity=1,
            unit_price=3.50,
            notes=None,
        ),
    ]
    order2_items = [
        OrderItem(
            order_id=order2.id,
            menu_item_name="Latte",
            quantity=1,
            unit_price=4.50,
            notes="Oat milk",
        ),
        OrderItem(
            order_id=order2.id,
            menu_item_name="Green Tea",
            quantity=2,
            unit_price=2.50,
            notes=None,
        ),
    ]

    session.add_all(order1_items + order2_items)
    session.flush()