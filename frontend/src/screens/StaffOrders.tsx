// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Button, Card, CardContent, Input, Label, Badge, Separator, Empty } = UI;
const { Search, Check, Menu, Users, AlertCircle, CheckCircle } = Icons;

const SAMPLE_ORDERS = [
  {
    id: 1,
    cart_order_id: "CF-2847",
    customer_name: "Maya Chen",
    pickup_time: "in 15 min",
    status: "incomplete",
    created_at: "2026-10-12T09:42:00",
    items: [
      { menu_item_name: "Flat White", quantity: 1, unit_price: 4.50, notes: "oat milk, extra shot" },
      { menu_item_name: "Almond Croissant", quantity: 1, unit_price: 4.25, notes: "" }
    ]
  },
  {
    id: 2,
    cart_order_id: "CF-2846",
    customer_name: "James Okonkwo",
    pickup_time: "ASAP",
    status: "incomplete",
    created_at: "2026-10-12T09:38:00",
    items: [
      { menu_item_name: "Drip Coffee", quantity: 2, unit_price: 3.50, notes: "one with cream, one black" }
    ]
  },
  {
    id: 3,
    cart_order_id: "CF-2845",
    customer_name: "Priya Raman",
    pickup_time: "in 30 min",
    status: "incomplete",
    created_at: "2026-10-12T09:31:00",
    items: [
      { menu_item_name: "Cortado", quantity: 1, unit_price: 3.75, notes: "" },
      { menu_item_name: "Iced Matcha Latte", quantity: 1, unit_price: 5.25, notes: "less sweet, oat milk" },
      { menu_item_name: "Pain au Chocolat", quantity: 1, unit_price: 3.95, notes: "" }
    ]
  },
  {
    id: 4,
    cart_order_id: "CF-2844",
    customer_name: "Tom Hadley",
    pickup_time: "ASAP",
    status: "incomplete",
    created_at: "2026-10-12T09:24:00",
    items: [
      { menu_item_name: "Cappuccino", quantity: 1, unit_price: 4.00, notes: "extra foam" },
      { menu_item_name: "Banana Bread", quantity: 1, unit_price: 3.50, notes: "toasted with butter" }
    ]
  },
  {
    id: 5,
    cart_order_id: "CF-2843",
    customer_name: "Sofia Reyes",
    pickup_time: "in 15 min",
    status: "incomplete",
    created_at: "2026-10-12T09:18:00",
    items: [
      { menu_item_name: "Cold Brew", quantity: 1, unit_price: 4.50, notes: "large, less ice" }
    ]
  },
  {
    id: 6,
    cart_order_id: "CF-2842",
    customer_name: "Daniel Foster",
    pickup_time: "in 30 min",
    status: "incomplete",
    created_at: "2026-10-12T09:05:00",
    items: [
      { menu_item_name: "Pour Over (Ethiopia)", quantity: 1, unit_price: 4.75, notes: "" },
      { menu_item_name: "Morning Bun", quantity: 1, unit_price: 3.25, notes: "" }
    ]
  },
  {
    id: 7,
    cart_order_id: "CF-2841",
    customer_name: "Aisha Williams",
    pickup_time: "ASAP",
    status: "incomplete",
    created_at: "2026-10-12T08:52:00",
    items: [
      { menu_item_name: "Latte", quantity: 1, unit_price: 4.25, notes: "vanilla, oat milk" },
      { menu_item_name: "Blueberry Muffin", quantity: 2, unit_price: 3.00, notes: "" }
    ]
  }
];

const STAFF_PASSWORD = "roastdaily";

export default function Screen() {
  const navigate = useNavigate();
  const [authed, setAuthed] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState(SAMPLE_ORDERS);
  const [search, setSearch] = React.useState("");
  const [completingId, setCompletingId] = React.useState(null);
  const [announce, setAnnounce] = React.useState("");

  var handleAuth = function(e) {
    e.preventDefault();
    if (password === STAFF_PASSWORD) {
      setLoading(true);
      setPasswordError("");
      setTimeout(function() {
        setAuthed(true);
        setLoading(false);
      }, 500);
    } else {
      setPasswordError("That passcode doesn't match. Please try again or check with your manager.");
    }
  };

  var handleComplete = function(orderId) {
    var order = orders.find(function(o) { return o.id === orderId; });
    if (order) {
      setAnnounce("Order " + order.cart_order_id + " for " + order.customer_name + " marked complete.");
    }
    setCompletingId(orderId);
    setTimeout(function() {
      setOrders(function(prev) { return prev.filter(function(o) { return o.id !== orderId; }); });
      setCompletingId(null);
    }, 350);
  };

  var handleLock = function() {
    setAuthed(false);
    setPassword("");
    setPasswordError("");
    setSearch("");
  };

  var formatPrice = function(n) { return "$" + n.toFixed(2); };

  var formatTime = function(iso) {
    var d = new Date(iso);
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + String(m).padStart(2, "0") + " " + ampm;
  };

  var getPickupBadgeStyle = function(pickup) {
    if (pickup === "ASAP") {
      return { backgroundColor: brand.primaryColor, color: "#ffffff", border: "none" };
    }
    if (pickup === "in 15 min") {
      return { backgroundColor: brand.accentColor, color: "#3d342a", border: "none" };
    }
    return {
      backgroundColor: "transparent",
      color: brand.neutralColor,
      border: "1px solid " + brand.neutralColor + "60"
    };
  };

  var filteredOrders = orders.filter(function(o) {
    if (!search.trim()) return true;
    var q = search.toLowerCase();
    return o.cart_order_id.toLowerCase().indexOf(q) !== -1 ||
           o.customer_name.toLowerCase().indexOf(q) !== -1;
  });

  var activeCount = orders.length;

  var orderTotal = function(order) {
    return order.items.reduce(function(sum, item) {
      return sum + item.unit_price * item.quantity;
    }, 0);
  };

  /* ── Loading state ── */
  if (loading) {
    return React.createElement("div", {
      className: "flex items-center justify-center px-4",
      style: { minHeight: "60vh", fontFamily: brand.fontBody, backgroundColor: brand.backgroundColor }
    },
      React.createElement("div", { className: "text-center" },
        React.createElement("div", {
          className: "inline-block w-6 h-6 border-2 rounded-full animate-spin",
          style: { borderColor: brand.neutralColor + "40", borderTopColor: brand.primaryColor },
          role: "status",
          "aria-label": "Loading orders"
        }),
        React.createElement("p", {
          className: "text-sm mt-3",
          style: { color: brand.neutralColor }
        }, "Loading incoming orders…")
      )
    );
  }

  /* ── Password gate ── */
  if (!authed) {
    return React.createElement("div", {
      className: "flex items-center justify-center px-4 py-12",
      style: { minHeight: "70vh", fontFamily: brand.fontBody, backgroundColor: brand.backgroundColor }
    },
      React.createElement("div", { className: "w-full max-w-md" },
        React.createElement("style", null,
          "@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } } " +
          "button:focus-visible { outline: 2px solid " + brand.primaryColor + "; outline-offset: 2px; } " +
          "input:focus-visible { outline: 2px solid " + brand.primaryColor + "; outline-offset: 1px; }"
        ),
        React.createElement(Card, {
          style: {
            backgroundColor: "#ffffff",
            borderRadius: brand.radius,
            border: "1px solid " + brand.neutralColor + "22",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }
        },
          React.createElement(CardContent, { className: "pt-8 pb-6 px-8" },
            React.createElement("div", { className: "text-center mb-6" },
              React.createElement("div", {
                className: "inline-flex items-center justify-center w-12 h-12 rounded-full mb-4",
                style: { backgroundColor: brand.backgroundColor }
              },
                React.createElement(Users, { size: 22, style: { color: brand.primaryColor }, "aria-hidden": "true" })
              ),
              React.createElement("h1", {
                className: "text-2xl font-semibold tracking-tight",
                style: { fontFamily: brand.fontHeading, color: "#2a2a2a" }
              }, "Staff Area"),
              React.createElement("p", {
                className: "text-sm mt-2",
                style: { color: brand.neutralColor, lineHeight: 1.5 }
              }, "Enter the shared passcode to view incoming pickup orders.")
            ),
            React.createElement("form", { onSubmit: handleAuth, className: "space-y-4" },
              React.createElement("div", { className: "space-y-2" },
                React.createElement(Label, {
                  htmlFor: "staff-password",
                  className: "text-sm font-medium",
                  style: { color: "#2a2a2a" }
                }, "Passcode"),
                React.createElement(Input, {
                  id: "staff-password",
                  type: "password",
                  value: password,
                  onChange: function(e) { setPassword(e.target.value); setPasswordError(""); },
                  placeholder: "Enter staff passcode",
                  autoFocus: true,
                  "aria-describedby": passwordError ? "password-error" : undefined,
                  style: {
                    borderRadius: brand.radius,
                    borderColor: passwordError ? "#b85c4a" : brand.neutralColor + "40",
                    fontSize: "1rem",
                    padding: "0.625rem 0.75rem",
                    fontFamily: brand.fontBody
                  }
                })
              ),
              passwordError ? React.createElement("div", {
                id: "password-error",
                role: "alert",
                className: "text-sm px-3 py-2.5 flex items-start gap-2",
                style: {
                  color: "#9c4a3a",
                  backgroundColor: "#f5ebe8",
                  borderRadius: brand.radius,
                  lineHeight: 1.45
                }
              },
                React.createElement(AlertCircle, { size: 15, className: "mt-0.5 flex-shrink-0", "aria-hidden": "true" }),
                React.createElement("span", null, passwordError)
              ) : null,
              React.createElement(Button, {
                type: "submit",
                style: {
                  backgroundColor: brand.primaryColor,
                  color: "#ffffff",
                  borderRadius: brand.radius,
                  width: "100%",
                  padding: "0.625rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: brand.fontBody
                },
                className: "transition-opacity hover:opacity-90"
              }, "Enter Staff Area")
            ),
            React.createElement("div", {
              className: "mt-5 pt-5 text-center",
              style: { borderTop: "1px solid " + brand.neutralColor + "20" }
            },
              React.createElement("p", {
                className: "text-xs",
                style: { color: brand.neutralColor }
              },
                "Demo passcode: ",
                React.createElement("span", {
                  style: { fontVariantNumeric: "tabular-nums", fontWeight: 500 }
                }, "roastdaily")
              )
            )
          )
        ),
        React.createElement("div", { className: "text-center mt-4" },
          React.createElement("button", {
            onClick: function() { navigate("menu"); },
            className: "text-sm transition-colors hover:underline",
            style: { color: brand.neutralColor, fontFamily: brand.fontBody }
          }, "← Back to menu")
        )
      )
    );
  }

  /* ── Authenticated: order list ── */
  return React.createElement("div", {
    className: "px-4 py-8 md:px-6 md:py-10",
    style: { fontFamily: brand.fontBody, backgroundColor: brand.backgroundColor, minHeight: "100vh" }
  },
    React.createElement("style", null,
      "@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } } " +
      "button:focus-visible { outline: 2px solid " + brand.primaryColor + "; outline-offset: 2px; border-radius: 4px; } " +
      "input:focus-visible { outline: 2px solid " + brand.primaryColor + "; outline-offset: 1px; }"
    ),
    React.createElement("div", {
      className: "sr-only",
      "aria-live": "polite",
      role: "status"
    }, announce),
    React.createElement("div", { className: "max-w-2xl mx-auto" },
      /* Header */
      React.createElement("div", { className: "flex items-center justify-between mb-1" },
        React.createElement("h1", {
          className: "text-2xl md:text-3xl font-semibold tracking-tight",
          style: { fontFamily: brand.fontHeading, color: "#2a2a2a" }
        }, "Staff Orders"),
        React.createElement("div", { className: "flex items-center gap-1.5" },
          React.createElement("span", {
            "aria-hidden": "true",
            className: "relative flex h-2 w-2"
          },
            React.createElement("span", {
              className: "animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
              style: { backgroundColor: brand.primaryColor }
            }),
            React.createElement("span", {
              className: "relative inline-flex rounded-full h-2 w-2",
              style: { backgroundColor: brand.primaryColor }
            })
          ),
          React.createElement("span", {
            className: "text-xs font-medium",
            style: { color: brand.neutralColor }
          }, "Live")
        )
      ),
      React.createElement("p", {
        className: "text-sm mb-6",
        style: { color: brand.neutralColor }
      },
        React.createElement("span", { style: { fontVariantNumeric: "tabular-nums" } }, activeCount),
        " active " + (activeCount === 1 ? "order" : "orders") + " · sorted newest first"
      ),

      /* Search */
      React.createElement("div", { className: "relative mb-6" },
        React.createElement(Label, { htmlFor: "order-search", className: "sr-only" }, "Search orders"),
        React.createElement(Search, {
          size: 16,
          className: "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none",
          style: { color: brand.neutralColor },
          "aria-hidden": "true"
        }),
        React.createElement(Input, {
          id: "order-search",
          type: "text",
          value: search,
          onChange: function(e) { setSearch(e.target.value); },
          placeholder: "Search by order ID or customer name",
          className: "pl-9",
          style: {
            borderRadius: brand.radius,
            backgroundColor: "#ffffff",
            borderColor: brand.neutralColor + "30",
            fontSize: "0.875rem",
            padding: "0.625rem 0.75rem 0.625rem 2.25rem",
            fontFamily: brand.fontBody
          }
        })
      ),

      /* Orders */
      filteredOrders.length === 0 && search.trim() === "" ? (
        /* Empty: no active orders */
        React.createElement("div", { className: "text-center py-16 px-4" },
          React.createElement("div", {
            className: "inline-flex items-center justify-center w-14 h-14 rounded-full mb-4",
            style: { backgroundColor: "#ffffff", border: "1px solid " + brand.neutralColor + "20" }
          },
            React.createElement(CheckCircle, { size: 28, style: { color: brand.primaryColor }, "aria-hidden": "true" })
          ),
          React.createElement("h2", {
            className: "text-lg font-medium mb-1",
            style: { fontFamily: brand.fontHeading, color: "#2a2a2a" }
          }, "All caught up"),
          React.createElement("p", {
            className: "text-sm max-w-xs mx-auto",
            style: { color: brand.neutralColor, lineHeight: 1.55 }
          }, "No active orders right now. New orders will appear here the moment a customer places one.")
        )
      ) : filteredOrders.length === 0 && search.trim() !== "" ? (
        /* Empty: no search results */
        React.createElement("div", { className: "text-center py-16 px-4" },
          React.createElement("div", {
            className: "inline-flex items-center justify-center w-14 h-14 rounded-full mb-4",
            style: { backgroundColor: "#ffffff", border: "1px solid " + brand.neutralColor + "20" }
          },
            React.createElement(Search, { size: 24, style: { color: brand.neutralColor }, "aria-hidden": "true" })
          ),
          React.createElement("h2", {
            className: "text-lg font-medium mb-1",
            style: { fontFamily: brand.fontHeading, color: "#2a2a2a" }
          }, "No matching orders"),
          React.createElement("p", {
            className: "text-sm mb-3",
            style: { color: brand.neutralColor, lineHeight: 1.55 }
          }, "No orders match “" + search + "”. Try a different order ID or customer name."),
          React.createElement("button", {
            onClick: function() { setSearch(""); },
            className: "text-sm font-medium transition-colors hover:underline",
            style: { color: brand.primaryColor, fontFamily: brand.fontBody }
          }, "Clear search")
        )
      ) : (
        /* Order cards */
        React.createElement("div", { className: "space-y-4" },
          filteredOrders.map(function(order) {
            var total = orderTotal(order);
            var isCompleting = completingId === order.id;
            return React.createElement("div", {
              key: order.id,
              style: {
                backgroundColor: "#ffffff",
                borderRadius: brand.radius,
                border: "1px solid " + brand.neutralColor + "22",
                opacity: isCompleting ? 0 : 1,
                transform: isCompleting ? "translateY(-6px)" : "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
              }
            },
              React.createElement("div", { className: "p-5 md:p-6" },
                /* Order ID + pickup badge */
                React.createElement("div", { className: "flex items-start justify-between mb-3" },
                  React.createElement("span", {
                    style: {
                      color: brand.accentColor,
                      fontVariantNumeric: "tabular-nums",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      fontFamily: brand.fontHeading,
                      letterSpacing: "0.03em"
                    }
                  }, order.cart_order_id),
                  React.createElement(Badge, {
                    style: getPickupBadgeStyle(order.pickup_time)
                  }, order.pickup_time)
                ),
                /* Customer + time */
                React.createElement("div", { className: "mb-4" },
                  React.createElement("p", {
                    className: "font-medium text-base",
                    style: { color: "#2a2a2a" }
                  }, order.customer_name),
                  React.createElement("p", {
                    className: "text-xs mt-0.5",
                    style: { color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }
                  }, "Placed at " + formatTime(order.created_at))
                ),
                /* Items */
                React.createElement("div", { className: "space-y-3" },
                  order.items.map(function(item, idx) {
                    return React.createElement("div", { key: idx },
                      React.createElement("div", { className: "flex items-baseline justify-between gap-3" },
                        React.createElement("span", {
                          className: "text-sm",
                          style: { color: "#2a2a2a", lineHeight: 1.5 }
                        },
                          React.createElement("span", {
                            style: { color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }
                          }, item.quantity + "×"),
                          " ",
                          item.menu_item_name
                        ),
                        React.createElement("span", {
                          className: "text-sm flex-shrink-0",
                          style: { color: "#2a2a2a", fontVariantNumeric: "tabular-nums" }
                        }, formatPrice(item.unit_price * item.quantity))
                      ),
                      item.notes ? React.createElement("p", {
                        className: "text-xs italic mt-1 pl-6",
                        style: { color: brand.neutralColor, lineHeight: 1.4 }
                      }, item.notes) : null
                    );
                  })
                ),
                /* Separator + total */
                React.createElement("div", {
                  className: "my-4",
                  style: { borderTop: "1px solid " + brand.neutralColor + "20" }
                }),
                React.createElement("div", { className: "flex items-baseline justify-between" },
                  React.createElement("span", {
                    className: "text-sm",
                    style: { color: brand.neutralColor }
                  }, "Total"),
                  React.createElement("span", {
                    className: "text-base font-semibold",
                    style: { color: "#2a2a2a", fontVariantNumeric: "tabular-nums" }
                  }, formatPrice(total))
                )
              ),
              /* Complete button */
              React.createElement("div", { className: "px-5 md:px-6 pb-5 md:pb-6" },
                React.createElement(Button, {
                  onClick: function() { handleComplete(order.id); },
                  disabled: isCompleting,
                  style: {
                    backgroundColor: brand.primaryColor,
                    color: "#ffffff",
                    borderRadius: brand.radius,
                    width: "100%",
                    padding: "0.625rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: brand.fontBody
                  },
                  className: "transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
                },
                  React.createElement(Check, { size: 15, "aria-hidden": "true" }),
                  isCompleting ? "Completing…" : "Mark Complete"
                )
              )
            );
          })
        )
      ),

      /* Footer navigation */
      React.createElement("div", {
        className: "mt-10 pt-6 flex items-center justify-between flex-wrap gap-3",
        style: { borderTop: "1px solid " + brand.neutralColor + "20" }
      },
        React.createElement("button", {
          onClick: function() { navigate("admin-menu"); },
          className: "text-sm font-medium transition-colors hover:underline",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody }
        }, "Admin Menu"),
        React.createElement("div", { className: "flex items-center gap-5" },
          React.createElement("button", {
            onClick: function() { navigate("menu"); },
            className: "text-sm transition-colors hover:underline",
            style: { color: brand.neutralColor, fontFamily: brand.fontBody }
          }, "View Menu"),
          React.createElement("button", {
            onClick: handleLock,
            className: "text-sm transition-colors hover:underline",
            style: { color: brand.neutralColor, fontFamily: brand.fontBody }
          }, "Lock Staff Area")
        )
      )
    )
  );
}
