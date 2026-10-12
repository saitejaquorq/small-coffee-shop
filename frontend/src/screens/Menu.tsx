// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Plus, ChevronRight, Menu } = Icons;

const CAFE_NAME = "Steadwell Coffee";

const CATEGORIES = [
  { id: "cat-1", name: "Hot Drinks", display_order: 1 },
  { id: "cat-2", name: "Cold Drinks", display_order: 2 },
  { id: "cat-3", name: "Pastries", display_order: 3 },
  { id: "cat-4", name: "Seasonal", display_order: 4 },
];

const MENU_ITEMS = [
  { id: "mi-1", category_id: "cat-1", name: "Flat White", description: "Double ristretto with steamed whole milk and velvety microfoam", price: 5.00, image_url: null, is_available: true },
  { id: "mi-2", category_id: "cat-1", name: "Cortado", description: "Equal parts espresso and warm milk — balanced and smooth", price: 4.50, image_url: null, is_available: true },
  { id: "mi-3", category_id: "cat-1", name: "Pour Over", description: "Single-origin Ethiopian Yirgacheffe, hand-poured to order", price: 5.50, image_url: null, is_available: true },
  { id: "mi-4", category_id: "cat-1", name: "Espresso", description: "House blend pulled tight with a golden crema", price: 3.50, image_url: null, is_available: true },
  { id: "mi-5", category_id: "cat-1", name: "Cappuccino", description: "Classic ratio with a thick foam crown and cocoa dusting", price: 4.75, image_url: null, is_available: true },
  { id: "mi-6", category_id: "cat-1", name: "Chai Latte", description: "House-blend masala chai steeped with steamed milk", price: 4.50, image_url: null, is_available: true },
  { id: "mi-7", category_id: "cat-2", name: "Cold Brew", description: "Eighteen-hour steep, smooth and low in acidity", price: 4.50, image_url: null, is_available: true },
  { id: "mi-8", category_id: "cat-2", name: "Iced Latte", description: "Double espresso over ice with cold whole milk", price: 5.00, image_url: null, is_available: true },
  { id: "mi-9", category_id: "cat-2", name: "Iced Mocha", description: "Cold brew, dark cocoa syrup, and cream over ice", price: 5.75, image_url: null, is_available: true },
  { id: "mi-10", category_id: "cat-2", name: "Sparkling Yuzu", description: "Yuzu syrup, sparkling water, a twist of lemon peel", price: 4.50, image_url: null, is_available: true },
  { id: "mi-11", category_id: "cat-3", name: "Almond Croissant", description: "Buttery laminated dough, frangipane filling, toasted almonds", price: 4.25, image_url: null, is_available: true },
  { id: "mi-12", category_id: "cat-3", name: "Sourdough Toast", description: "Thick-cut sourdough, cultured butter, flaky sea salt", price: 3.50, image_url: null, is_available: true },
  { id: "mi-13", category_id: "cat-3", name: "Banana Bread", description: "Brown butter, toasted walnuts, a slice of nostalgia", price: 3.75, image_url: null, is_available: true },
  { id: "mi-14", category_id: "cat-3", name: "Pain au Chocolat", description: "Dark chocolate batons folded in flaky viennoiserie", price: 3.75, image_url: null, is_available: true },
  { id: "mi-15", category_id: "cat-4", name: "Maple Pecan Latte", description: "Real maple syrup, toasted pecan, steamed whole milk", price: 5.75, image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e63d?w=160&h=160&fit=crop&auto=format", is_available: true },
  { id: "mi-16", category_id: "cat-4", name: "Pumpkin Spice Scone", description: "Brown sugar, cinnamon, clove, cream cheese glaze", price: 3.95, image_url: "https://images.unsplash.com/photo-1586076294515-8c5c7a5c75a0?w=160&h=160&fit=crop&auto=format", is_available: true },
];

const CSS = `
@keyframes menuFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cartBump { 0%, 100% { transform: scale(1); } 40% { transform: scale(1.18); } }
@keyframes slideUp { from { transform: translateY(110%); opacity: 0.6; } to { transform: translateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { [data-anim] { animation: none !important; transition: none !important; } }
`;

export default function Screen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState("cat-1");
  const [cart, setCart] = React.useState([]);
  const [imgErrors, setImgErrors] = React.useState([]);
  const [bumpKey, setBumpKey] = React.useState(0);

  const visibleCategories = CATEGORIES.filter(cat =>
    MENU_ITEMS.some(item => item.category_id === cat.id && item.is_available)
  );

  const activeItems = MENU_ITEMS.filter(
    item => item.category_id === activeCategory && item.is_available
  );

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.quantity * i.price, 0);

  const getQty = (itemId) => {
    const found = cart.find(ci => ci.id === itemId);
    return found ? found.quantity : 0;
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        notes: "",
        image_url: item.image_url,
      }];
    });
    setBumpKey(k => k + 1);
  };

  const handleImgError = (itemId) => {
    setImgErrors(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
  };

  const activeCatName = visibleCategories.find(c => c.id === activeCategory)?.name || "";
  const fmtPrice = (n) => "$" + n.toFixed(2);

  return (
    <div
      style={{
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontBody,
        minHeight: "100vh",
        color: brand.primaryColor,
      }}
    >
      <style>{CSS}</style>

      {/* Header */}
      <header className="px-6 pt-12 pb-8" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <p
          className="text-[11px] font-medium"
          style={{ letterSpacing: "0.25em", textTransform: "uppercase", color: brand.neutralColor }}
        >
          {CAFE_NAME}
        </p>
        <h1
          className="text-4xl font-semibold tracking-tight mt-2"
          style={{ color: brand.primaryColor }}
        >
          Menu
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
          Brewed to order, served for pickup. Add what you'd like — we'll have it ready.
        </p>
      </header>

      {/* Category tabs — sticky so they stay available while scrolling */}
      <div
        className="sticky top-0 z-10"
        style={{ backgroundColor: brand.backgroundColor }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
          <div
            role="tablist"
            aria-label="Menu categories"
            className="flex gap-1 overflow-x-auto"
            style={{ borderBottom: "1px solid " + brand.neutralColor + "30", scrollbarWidth: "none" }}
          >
            {visibleCategories.map(cat => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  id={"tab-" + cat.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="menu-panel"
                  onClick={() => setActiveCategory(cat.id)}
                  className="py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    color: isActive ? brand.primaryColor : brand.neutralColor,
                    borderBottom: "2px solid " + (isActive ? brand.primaryColor : "transparent"),
                    marginBottom: "-1px",
                    outlineColor: brand.primaryColor,
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu items for the active category */}
      <div
        id="menu-panel"
        role="tabpanel"
        aria-label={activeCatName}
        key={activeCategory}
        data-anim
        style={{ maxWidth: "640px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem", animation: "menuFadeIn 0.35s ease-out" }}
      >
        {activeItems.map((item, idx) => {
          const qty = getQty(item.id);
          const showImg = item.image_url && !imgErrors.includes(item.id);
          const imgFailed = item.image_url && imgErrors.includes(item.id);
          return (
            <div key={item.id}>
              <div
                className="flex items-start gap-4 py-6"
                data-anim
                style={{ animation: "menuFadeIn 0.35s ease-out " + (idx * 0.05) + "s both" }}
              >
                {/* Optional image — only rendered if admin provided a URL (AC-006/AC-007) */}
                {item.image_url && (
                  showImg ? (
                    <img
                      src={item.image_url}
                      alt=""
                      aria-hidden="true"
                      className="rounded-lg object-cover flex-shrink-0"
                      style={{ width: 64, height: 64 }}
                      onError={() => handleImgError(item.id)}
                    />
                  ) : (
                    <div
                      className="rounded-lg flex-shrink-0"
                      style={{
                        width: 64,
                        height: 64,
                        background: "linear-gradient(135deg, " + brand.primaryColor + "35, " + brand.accentColor + "55)",
                      }}
                      aria-hidden="true"
                    />
                  )
                )}

                {/* Item content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2
                      className="text-base font-semibold leading-snug"
                      style={{ color: brand.primaryColor }}
                    >
                      {item.name}
                    </h2>
                    <span
                      className="text-base font-semibold flex-shrink-0"
                      style={{ color: brand.primaryColor, fontVariantNumeric: "tabular-nums" }}
                    >
                      {fmtPrice(item.price)}
                    </span>
                  </div>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: brand.neutralColor }}
                  >
                    {item.description}
                  </p>

                  {/* Add-to-cart area */}
                  <div className="mt-3 flex items-center gap-3">
                    {qty > 0 && (
                      <span
                        className="text-xs font-semibold rounded-full"
                        style={{
                          color: brand.accentColor,
                          backgroundColor: brand.accentColor + "1A",
                          fontVariantNumeric: "tabular-nums",
                          padding: "2px 8px",
                        }}
                      >
                        {qty} in cart
                      </span>
                    )}
                    <button
                      onClick={() => addToCart(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium transition-opacity duration-150 hover:opacity-80 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        backgroundColor: brand.primaryColor + "14",
                        color: brand.primaryColor,
                        padding: "6px 14px",
                        outlineColor: brand.primaryColor,
                      }}
                      aria-label={"Add " + item.name + " to cart"}
                    >
                      <Icons.Plus style={{ width: 15, height: 15 }} aria-hidden="true" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
              {idx < activeItems.length - 1 && (
                <div style={{ height: "1px", backgroundColor: brand.neutralColor + "18" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer — subtle links to staff and admin areas */}
      <footer
        className="pt-8 pb-6"
        style={{ maxWidth: "640px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <p className="text-xs" style={{ color: brand.neutralColor + "90" }}>
          {CAFE_NAME} · 42 Mill Lane · Open daily 7–4
        </p>
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => navigate("staff-orders")}
            className="text-xs underline transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: brand.neutralColor, outlineColor: brand.neutralColor }}
          >
            Staff login
          </button>
          <span style={{ color: brand.neutralColor + "60" }}>·</span>
          <button
            onClick={() => navigate("admin-menu")}
            className="text-xs underline transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: brand.neutralColor, outlineColor: brand.neutralColor }}
          >
            Admin
          </button>
        </div>
      </footer>

      {/* Spacer so the sticky cart bar never covers footer when cart is empty */}
      <div style={{ height: cartCount > 0 ? "0" : "2rem" }} />

      {/* Sticky cart bar — appears only when items have been added (AC-019) */}
      {cartCount > 0 && (
        <div
          className="sticky bottom-0 z-20"
          style={{
            backgroundColor: brand.backgroundColor,
            borderTop: "1px solid " + brand.neutralColor + "25",
            animation: "slideUp 0.3s ease-out",
          }}
          data-anim
        >
          <div
            className="flex items-center justify-between gap-4 py-4"
            style={{ maxWidth: "640px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                key={bumpKey}
                data-anim
                style={{
                  backgroundColor: brand.primaryColor,
                  color: brand.backgroundColor,
                  fontVariantNumeric: "tabular-nums",
                  animation: "cartBump 0.4s ease-out",
                }}
                className="inline-flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
              >
                <span style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </span>
              </span>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: brand.primaryColor, fontVariantNumeric: "tabular-nums" }}
                >
                  {cartCount} {cartCount === 1 ? "item" : "items"} · {fmtPrice(cartTotal)}
                </p>
                <p className="text-xs" style={{ color: brand.neutralColor }}>
                  Review and place your pickup order
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("cart")}
              className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 flex-shrink-0"
              style={{
                backgroundColor: brand.primaryColor,
                color: brand.backgroundColor,
                padding: "10px 20px",
                outlineColor: brand.primaryColor,
              }}
            >
              View cart
              <Icons.ChevronRight style={{ width: 16, height: 16 }} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
