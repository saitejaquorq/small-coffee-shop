// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Button, Card, CardContent, Input, Textarea, Label, Select, Switch, Separator, Tabs, Empty } = UI;
const { Plus, Search, X, Menu, Settings, Package, Trash, Edit, Filter, AlertCircle, CheckCircle } = Icons;

const ADMIN_PASSWORD = "roastery";

const initialCategories = [
  { id: 1, name: "Hot Drinks", display_order: 1 },
  { id: 2, name: "Cold Drinks", display_order: 2 },
  { id: 3, name: "Pastries", display_order: 3 },
  { id: 4, name: "Seasonal", display_order: 4 },
  { id: 5, name: "Tea & Infusions", display_order: 5 },
];

const initialItems = [
  { id: 1, category_id: 1, name: "Espresso", description: "Double shot, house espresso blend", price: 3.25, image_url: null, is_available: true },
  { id: 2, category_id: 1, name: "Cortado", description: "Equal parts espresso and steamed milk, 4oz", price: 4.00, image_url: null, is_available: true },
  { id: 3, category_id: 1, name: "Flat White", description: "Ristretto shots with microfoam, 6oz", price: 4.75, image_url: "/images/flat-white.jpg", is_available: true },
  { id: 4, category_id: 1, name: "Pour Over", description: "Ethiopia Yirgacheffe, single origin, brewed to order", price: 5.25, image_url: null, is_available: true },
  { id: 5, category_id: 1, name: "London Fog", description: "Earl Grey tea latte with vanilla and steamed milk", price: 4.50, image_url: null, is_available: true },
  { id: 6, category_id: 2, name: "Iced Latte", description: "Double espresso over ice with cold milk", price: 4.50, image_url: null, is_available: true },
  { id: 7, category_id: 2, name: "Cold Brew", description: "18-hour steeped, smooth and low-acid", price: 4.75, image_url: null, is_available: true },
  { id: 8, category_id: 2, name: "Iced Matcha Latte", description: "Stone-ground matcha with oat milk over ice", price: 5.25, image_url: "/images/matcha.jpg", is_available: false },
  { id: 9, category_id: 3, name: "Almond Croissant", description: "Twice-baked with almond cream and toasted sliced almonds", price: 4.25, image_url: null, is_available: true },
  { id: 10, category_id: 3, name: "Pain au Chocolat", description: "Dark chocolate batons in laminated butter dough", price: 3.75, image_url: null, is_available: true },
  { id: 11, category_id: 3, name: "Morning Bun", description: "Cinnamon, citrus zest, brown sugar, flaky layers", price: 3.50, image_url: null, is_available: true },
  { id: 12, category_id: 4, name: "Maple Pecan Latte", description: "Maple syrup, pecan praline, steamed whole milk", price: 5.50, image_url: null, is_available: true },
  { id: 13, category_id: 4, name: "Spiced Apple Cider", description: "Local cider mulled with cinnamon and star anise", price: 4.25, image_url: null, is_available: true },
];

export default function Screen() {
  const navigate = useNavigate();
  const [authed, setAuthed] = React.useState(false);
  const [pw, setPw] = React.useState("");
  const [pwError, setPwError] = React.useState("");

  const [categories, setCategories] = React.useState(initialCategories);
  const [items, setItems] = React.useState(initialItems);

  const [tab, setTab] = React.useState("categories");

  // Category state
  const [newCat, setNewCat] = React.useState("");
  const [editCatId, setEditCatId] = React.useState(null);
  const [editCatName, setEditCatName] = React.useState("");
  const [catError, setCatError] = React.useState("");
  const [deleteCatId, setDeleteCatId] = React.useState(null);

  // Item state
  const [showItemForm, setShowItemForm] = React.useState(false);
  const [editItemId, setEditItemId] = React.useState(null);
  const [itemForm, setItemForm] = React.useState({ name: "", description: "", price: "", category_id: "", image_url: "", is_available: true });
  const [itemErrors, setItemErrors] = React.useState({});
  const [deleteItemId, setDeleteItemId] = React.useState(null);
  const [filterCat, setFilterCat] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [toast, setToast] = React.useState(null);

  const showToast = function(msg) {
    setToast(msg);
    setTimeout(function() { setToast(null); }, 2800);
  };

  var handleLogin = function(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPw("");
      setPwError("");
    } else {
      setPwError("That password doesn't match. The admin password is separate from the staff password.");
    }
  };

  var handleAddCategory = function(e) {
    e.preventDefault();
    if (!newCat.trim()) {
      setCatError("Category name is required.");
      return;
    }
    var nextId = Math.max.apply(null, [0].concat(categories.map(function(c) { return c.id; }))) + 1;
    var nextOrder = Math.max.apply(null, [0].concat(categories.map(function(c) { return c.display_order; }))) + 1;
    setCategories(categories.concat([{ id: nextId, name: newCat.trim(), display_order: nextOrder }]));
    setNewCat("");
    setCatError("");
    showToast("Category added");
  };

  var handleSaveCategory = function(id) {
    if (!editCatName.trim()) {
      setCatError("Category name is required.");
      return;
    }
    setCategories(categories.map(function(c) { return c.id === id ? { id: c.id, name: editCatName.trim(), display_order: c.display_order } : c; }));
    setEditCatId(null);
    setEditCatName("");
    setCatError("");
    showToast("Category updated");
  };

  var handleDeleteCategory = function(id) {
    setCategories(categories.filter(function(c) { return c.id !== id; }));
    setDeleteCatId(null);
    showToast("Category removed");
  };

  var resetItemForm = function() {
    setItemForm({ name: "", description: "", price: "", category_id: "", image_url: "", is_available: true });
    setItemErrors({});
    setEditItemId(null);
    setShowItemForm(false);
  };

  var openAddItem = function() {
    resetItemForm();
    setShowItemForm(true);
  };

  var openEditItem = function(item) {
    setItemForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      category_id: String(item.category_id),
      image_url: item.image_url || "",
      is_available: item.is_available
    });
    setEditItemId(item.id);
    setShowItemForm(true);
    setItemErrors({});
  };

  var handleSaveItem = function(e) {
    e.preventDefault();
    var errors = {};
    if (!itemForm.name.trim()) errors.name = "Name is required.";
    var parsedPrice = parseFloat(itemForm.price);
    if (!itemForm.price || isNaN(parsedPrice) || parsedPrice <= 0) errors.price = "Enter a valid price greater than zero.";
    if (!itemForm.category_id) errors.category_id = "Assign a category.";
    setItemErrors(errors);
    if (Object.keys(errors).length > 0) return;

    var itemData = {
      name: itemForm.name.trim(),
      description: itemForm.description.trim(),
      price: Math.round(parsedPrice * 100) / 100,
      category_id: parseInt(itemForm.category_id, 10),
      image_url: itemForm.image_url.trim() || null,
      is_available: itemForm.is_available
    };

    if (editItemId) {
      setItems(items.map(function(i) { return i.id === editItemId ? Object.assign({}, i, itemData) : i; }));
      showToast("Item updated");
    } else {
      var nextId = Math.max.apply(null, [0].concat(items.map(function(i) { return i.id; }))) + 1;
      setItems(items.concat([Object.assign({ id: nextId }, itemData)]));
      showToast("Item added");
    }
    resetItemForm();
  };

  var handleDeleteItem = function(id) {
    setItems(items.filter(function(i) { return i.id !== id; }));
    setDeleteItemId(null);
    showToast("Item removed");
  };

  var filteredItems = items.filter(function(i) {
    if (filterCat !== "all" && i.category_id !== parseInt(filterCat, 10)) return false;
    if (search && i.name.toLowerCase().indexOf(search.toLowerCase()) === -1) return false;
    return true;
  });

  var getCategoryName = function(id) {
    var cat = categories.filter(function(c) { return c.id === id; })[0];
    return cat ? cat.name : "Uncategorized";
  };

  var getItemCount = function(catId) {
    return items.filter(function(i) { return i.category_id === catId; }).length;
  };

  var inputBase = {
    borderRadius: brand.radius,
    fontFamily: brand.fontBody,
    fontSize: "0.875rem"
  };

  // ---- Password Gate ----
  if (!authed) {
    return React.createElement("div", {
      style: { backgroundColor: brand.backgroundColor, fontFamily: brand.fontBody },
      className: "min-h-screen px-4 py-12 sm:px-6 sm:py-20"
    }, [
      React.createElement("div", { key: "anim", dangerouslySetInnerHTML: { __html: '<style>@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.fadeUp{animation:none!important}}</style>' } }),
      React.createElement("div", { key: "wrap", className: "mx-auto max-w-md fadeUp", style: { animation: "fadeUp 0.3s ease-out" } }, [
        React.createElement("h1", {
          key: "h1",
          className: "text-2xl font-semibold tracking-tight",
          style: { color: brand.primaryColor, fontFamily: brand.fontHeading }
        }, "Menu Management"),
        React.createElement("p", {
          key: "sub",
          className: "mt-2 text-sm",
          style: { color: brand.neutralColor }
        }, "Manage categories and items on the public menu."),

        React.createElement(Card, {
          key: "card",
          className: "mt-8",
          style: { backgroundColor: "#ffffff", borderColor: "rgba(168,168,160,0.25)", borderRadius: brand.radius }
        }, React.createElement(CardContent, { className: "p-6 sm:p-8" }, [
          React.createElement("div", { key: "label-row", className: "flex items-center gap-2" }, [
            React.createElement(Icons.Settings, { key: "icon", "aria-hidden": "true", style: { width: 18, height: 18, color: brand.primaryColor } }),
            React.createElement("span", {
              key: "label",
              className: "text-xs font-medium uppercase tracking-wider",
              style: { color: brand.neutralColor }
            }, "Admin Access")
          ]),
          React.createElement("h2", {
            key: "h2",
            className: "mt-4 text-lg font-medium",
            style: { color: "#2a2a2a", fontFamily: brand.fontHeading }
          }, "Enter the admin password"),
          React.createElement("p", {
            key: "desc",
            className: "mt-1.5 text-sm leading-relaxed",
            style: { color: brand.neutralColor }
          }, "The admin password is separate from the staff password. Only the owner or admin can manage the menu."),

          React.createElement("form", { key: "form", onSubmit: handleLogin, className: "mt-5" }, [
            React.createElement("div", { key: "pw-field", className: "mb-1" },
              React.createElement(Label, {
                htmlFor: "admin-pw",
                className: "text-sm font-medium",
                style: { color: "#2a2a2a", fontFamily: brand.fontBody }
              }, "Password")
            ),
            React.createElement(Input, {
              key: "pw-input",
              id: "admin-pw",
              type: "password",
              value: pw,
              onChange: function(e) { setPw(e.target.value); setPwError(""); },
              className: "w-full",
              style: inputBase,
              autoComplete: "current-password",
              "aria-invalid": pwError ? "true" : "false",
              "aria-describedby": pwError ? "pw-error" : undefined
            }),
            pwError ? React.createElement("p", {
              key: "pw-err",
              id: "pw-error",
              className: "mt-2 flex items-start gap-1.5 text-sm",
              style: { color: "#B85450", fontFamily: brand.fontBody },
              role: "alert"
            }, [
              React.createElement(Icons.AlertCircle, { key: "err-ic", "aria-hidden": "true", style: { width: 15, height: 15, flexShrink: 0, marginTop: 2 } }),
              React.createElement("span", { key: "err-txt" }, pwError)
            ]) : null,
            React.createElement(Button, {
              key: "submit",
              type: "submit",
              className: "mt-4 w-full",
              style: { backgroundColor: brand.primaryColor, color: "#ffffff", borderRadius: brand.radius, fontFamily: brand.fontBody, fontWeight: 500 }
            }, "Unlock admin area")
          ]),

          React.createElement("div", {
            key: "divider",
            className: "mt-6 pt-5 border-t",
            style: { borderColor: "rgba(168,168,160,0.2)" }
          }, React.createElement("p", {
            className: "text-xs",
            style: { color: brand.neutralColor, fontFamily: brand.fontBody }
          }, [
            "Looking for the staff order list? ",
            React.createElement("button", {
              key: "staff-link",
              type: "button",
              onClick: function() { navigate("staff-orders"); },
              className: "underline",
              style: { color: brand.primaryColor }
            }, "Go to staff area")
          ]))
        ])),

        React.createElement("p", {
          key: "back",
          className: "mt-6 text-center text-xs",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody }
        }, React.createElement("button", {
          type: "button",
          onClick: function() { navigate("menu"); },
          className: "underline"
        }, "Back to public menu"))
      ])
    ]);
  }

  // ---- Management Area ----

  var tabBtnStyle = function(active) {
    return {
      color: active ? brand.primaryColor : brand.neutralColor,
      borderBottom: active ? "2px solid " + brand.primaryColor : "2px solid transparent",
      marginBottom: "-1px",
      fontFamily: brand.fontBody,
      fontWeight: 500,
      fontSize: "0.875rem",
      padding: "0.75rem 1.25rem",
      transition: "color 0.15s, border-color 0.15s",
      cursor: "pointer",
      background: "transparent",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none"
    };
  };

  var iconBtnStyle = {
    color: brand.neutralColor,
    padding: "0.5rem",
    borderRadius: brand.radius,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "color 0.15s, background 0.15s"
  };

  var itemRowStyle = {
    borderColor: "rgba(168,168,160,0.25)",
    backgroundColor: "#ffffff",
    borderRadius: brand.radius,
    border: "1px solid rgba(168,168,160,0.25)"
  };

  // Render category row
  var renderCategory = function(cat) {
    var count = getItemCount(cat.id);
    if (editCatId === cat.id) {
      return React.createElement("div", {
        key: cat.id,
        className: "flex items-center gap-3 p-4",
        style: itemRowStyle
      }, [
        React.createElement(Input, {
          key: "input",
          value: editCatName,
          onChange: function(e) { setEditCatName(e.target.value); setCatError(""); },
          className: "flex-1",
          style: inputBase,
          "aria-label": "Category name"
        }),
        React.createElement(Button, {
          key: "save",
          onClick: function() { handleSaveCategory(cat.id); },
          style: { backgroundColor: brand.primaryColor, color: "#fff", borderRadius: brand.radius, fontFamily: brand.fontBody, fontWeight: 500, fontSize: "0.8125rem" }
        }, "Save"),
        React.createElement("button", {
          key: "cancel",
          type: "button",
          onClick: function() { setEditCatId(null); setEditCatName(""); setCatError(""); },
          className: "text-sm font-medium",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody }
        }, "Cancel")
      ]);
    }
    return React.createElement("div", {
      key: cat.id,
      className: "flex items-center justify-between p-4",
      style: itemRowStyle
    }, [
      React.createElement("div", { key: "info" }, [
        React.createElement("span", {
          key: "name",
          className: "font-medium",
          style: { fontFamily: brand.fontHeading, color: "#2a2a2a", fontSize: "0.95rem" }
        }, cat.name),
        React.createElement("span", {
          key: "count",
          className: "ml-3 text-xs",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody }
        }, count + (count === 1 ? " item" : " items"))
      ]),
      React.createElement("div", { key: "actions", className: "flex items-center gap-1" },
        deleteCatId === cat.id ? React.createElement("span", {
          className: "flex items-center gap-2 text-xs",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody }
        }, [
          count > 0 ? React.createElement("span", { key: "warn", style: { color: "#B85450" } }, "Items will be left uncategorized. ") : null,
          React.createElement("span", { key: "q" }, "Remove?"),
          React.createElement("button", {
            key: "yes",
            type: "button",
            onClick: function() { handleDeleteCategory(cat.id); },
            className: "text-xs font-medium",
            style: { color: "#B85450" }
          }, "Yes"),
          React.createElement("button", {
            key: "no",
            type: "button",
            onClick: function() { setDeleteCatId(null); },
            className: "text-xs font-medium",
            style: { color: brand.neutralColor }
          }, "No")
        ]) : [
          React.createElement("button", {
            key: "edit",
            type: "button",
            onClick: function() { setEditCatId(cat.id); setEditCatName(cat.name); setCatError(""); },
            "aria-label": "Edit " + cat.name,
            style: iconBtnStyle
          }, React.createElement(Icons.Edit, { "aria-hidden": "true", style: { width: 16, height: 16 } })),
          React.createElement("button", {
            key: "del",
            type: "button",
            onClick: function() { setDeleteCatId(cat.id); },
            "aria-label": "Remove " + cat.name,
            style: iconBtnStyle
          }, React.createElement(Icons.Trash, { "aria-hidden": "true", style: { width: 16, height: 16 } }))
        ]
      )
    ]);
  };

  // Render item row
  var renderItem = function(item) {
    return React.createElement("div", {
      key: item.id,
      className: "p-4 fadeUp",
      style: Object.assign({}, itemRowStyle, { animation: "fadeUp 0.2s ease-out" })
    }, React.createElement("div", { className: "flex items-start justify-between gap-4" }, [
      React.createElement("div", { key: "info", className: "flex-1 min-w-0" }, [
        React.createElement("div", { key: "title-row", className: "flex items-center gap-2 flex-wrap" }, [
          React.createElement("span", {
            key: "name",
            className: "font-medium",
            style: { fontFamily: brand.fontHeading, color: "#2a2a2a", fontSize: "0.95rem" }
          }, item.name),
          !item.is_available ? React.createElement("span", {
            key: "hidden-badge",
            className: "inline-flex items-center text-xs font-medium",
            style: {
              backgroundColor: "rgba(184,84,80,0.1)",
              color: "#B85450",
              borderRadius: brand.radius,
              padding: "0.125rem 0.5rem",
              fontFamily: brand.fontBody
            }
          }, "Hidden") : null,
          item.image_url ? React.createElement("span", {
            key: "img-badge",
            className: "inline-flex items-center text-xs font-medium",
            style: {
              backgroundColor: "rgba(196,167,125,0.15)",
              color: "#9B7D52",
              borderRadius: brand.radius,
              padding: "0.125rem 0.5rem",
              fontFamily: brand.fontBody
            }
          }, "Has image") : null
        ]),
        React.createElement("p", {
          key: "desc",
          className: "mt-1 text-sm leading-snug",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody }
        }, item.description || "No description"),
        React.createElement("div", {
          key: "meta",
          className: "mt-2 flex items-center gap-2.5 text-xs",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody, fontVariantNumeric: "tabular-nums" }
        }, [
          React.createElement("span", { key: "price", style: { fontWeight: 500, color: "#2a2a2a" } }, "$" + item.price.toFixed(2)),
          React.createElement("span", { key: "dot", "aria-hidden": "true" }, "·"),
          React.createElement("span", { key: "cat" }, getCategoryName(item.category_id))
        ])
      ]),
      React.createElement("div", { key: "actions", className: "flex items-center gap-1 shrink-0" },
        deleteItemId === item.id ? React.createElement("span", {
          className: "flex items-center gap-2 text-xs",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody }
        }, [
          React.createElement("span", { key: "q" }, "Remove?"),
          React.createElement("button", {
            key: "yes",
            type: "button",
            onClick: function() { handleDeleteItem(item.id); },
            className: "text-xs font-medium",
            style: { color: "#B85450" }
          }, "Yes"),
          React.createElement("button", {
            key: "no",
            type: "button",
            onClick: function() { setDeleteItemId(null); },
            className: "text-xs font-medium",
            style: { color: brand.neutralColor }
          }, "No")
        ]) : [
          React.createElement("button", {
            key: "edit",
            type: "button",
            onClick: function() { openEditItem(item); },
            "aria-label": "Edit " + item.name,
            style: iconBtnStyle
          }, React.createElement(Icons.Edit, { "aria-hidden": "true", style: { width: 16, height: 16 } })),
          React.createElement("button", {
            key: "del",
            type: "button",
            onClick: function() { setDeleteItemId(item.id); },
            "aria-label": "Remove " + item.name,
            style: iconBtnStyle
          }, React.createElement(Icons.Trash, { "aria-hidden": "true", style: { width: 16, height: 16 } }))
        ]
      )
    ]));
  };

  // Empty state renderer
  var renderEmpty = function(title, desc) {
    return React.createElement("div", {
      className: "text-center py-12 px-4",
      style: { borderRadius: brand.radius, border: "1px dashed rgba(168,168,160,0.35)" }
    }, [
      React.createElement(Icons.Package, {
        key: "ic",
        "aria-hidden": "true",
        style: { width: 28, height: 28, color: brand.neutralColor, opacity: 0.5, margin: "0 auto" }
      }),
      React.createElement("p", {
        key: "title",
        className: "mt-3 font-medium text-sm",
        style: { color: "#2a2a2a", fontFamily: brand.fontBody }
      }, title),
      React.createElement("p", {
        key: "desc",
        className: "mt-1 text-sm",
        style: { color: brand.neutralColor, fontFamily: brand.fontBody }
      }, desc)
    ]);
  };

  // Item form card
  var itemFormCard = showItemForm ? React.createElement(Card, {
    key: "form-card",
    className: "mb-6 fadeUp",
    style: {
      backgroundColor: "#ffffff",
      borderRadius: brand.radius,
      border: "1px solid " + brand.primaryColor,
      animation: "fadeUp 0.25s ease-out"
    }
  }, React.createElement(CardContent, { className: "p-5 sm:p-6" }, [
    React.createElement("div", { key: "form-header", className: "flex items-center justify-between" }, [
      React.createElement("h2", {
        className: "text-base font-medium",
        style: { color: "#2a2a2a", fontFamily: brand.fontHeading }
      }, editItemId ? "Edit item" : "New menu item"),
      React.createElement("button", {
        type: "button",
        onClick: resetItemForm,
        "aria-label": "Close form",
        style: Object.assign({}, iconBtnStyle, { color: brand.neutralColor })
      }, React.createElement(Icons.X, { "aria-hidden": "true", style: { width: 18, height: 18 } }))
    ]),
    React.createElement("form", { key: "form", onSubmit: handleSaveItem, className: "mt-4 space-y-4" }, [
      // Name
      React.createElement("div", { key: "name-field" }, [
        React.createElement(Label, {
          key: "lbl",
          htmlFor: "item-name",
          className: "text-sm font-medium",
          style: { color: "#2a2a2a", fontFamily: brand.fontBody }
        }, "Name"),
        React.createElement(Input, {
          key: "inp",
          id: "item-name",
          value: itemForm.name,
          onChange: function(e) { setItemForm(Object.assign({}, itemForm, { name: e.target.value })); },
          className: "mt-1.5 w-full",
          style: inputBase,
          "aria-invalid": itemErrors.name ? "true" : "false"
        }),
        itemErrors.name ? React.createElement("p", {
          key: "err",
          className: "mt-1 text-xs",
          style: { color: "#B85450", fontFamily: brand.fontBody },
          role: "alert"
        }, itemErrors.name) : null
      ]),
      // Description
      React.createElement("div", { key: "desc-field" }, [
        React.createElement(Label, {
          key: "lbl",
          htmlFor: "item-desc",
          className: "text-sm font-medium",
          style: { color: "#2a2a2a", fontFamily: brand.fontBody }
        }, "Description"),
        React.createElement(Textarea, {
          key: "inp",
          id: "item-desc",
          value: itemForm.description,
          onChange: function(e) { setItemForm(Object.assign({}, itemForm, { description: e.target.value })); },
          className: "mt-1.5 w-full",
          style: inputBase,
          rows: 2
        })
      ]),
      // Price + Category
      React.createElement("div", { key: "pc-row", className: "grid grid-cols-2 gap-4" }, [
        React.createElement("div", { key: "price" }, [
          React.createElement(Label, {
            key: "lbl",
            htmlFor: "item-price",
            className: "text-sm font-medium",
            style: { color: "#2a2a2a", fontFamily: brand.fontBody }
          }, "Price ($)"),
          React.createElement(Input, {
            key: "inp",
            id: "item-price",
            type: "number",
            step: "0.01",
            min: "0",
            value: itemForm.price,
            onChange: function(e) { setItemForm(Object.assign({}, itemForm, { price: e.target.value })); },
            className: "mt-1.5 w-full",
            style: Object.assign({}, inputBase, { fontVariantNumeric: "tabular-nums" }),
            "aria-invalid": itemErrors.price ? "true" : "false"
          }),
          itemErrors.price ? React.createElement("p", {
            key: "err",
            className: "mt-1 text-xs",
            style: { color: "#B85450", fontFamily: brand.fontBody },
            role: "alert"
          }, itemErrors.price) : null
        ]),
        React.createElement("div", { key: "cat" }, [
          React.createElement(Label, {
            key: "lbl",
            htmlFor: "item-cat",
            className: "text-sm font-medium",
            style: { color: "#2a2a2a", fontFamily: brand.fontBody }
          }, "Category"),
          React.createElement(Select, {
            key: "sel",
            id: "item-cat",
            value: itemForm.category_id,
            onChange: function(e) { setItemForm(Object.assign({}, itemForm, { category_id: e.target.value })); },
            className: "mt-1.5 w-full",
            style: inputBase,
            "aria-invalid": itemErrors.category_id ? "true" : "false"
          }, [
            React.createElement("option", { key: "default", value: "" }, "Select…"),
            categories.map(function(c) {
              return React.createElement("option", { key: c.id, value: c.id }, c.name);
            })
          ]),
          itemErrors.category_id ? React.createElement("p", {
            key: "err",
            className: "mt-1 text-xs",
            style: { color: "#B85450", fontFamily: brand.fontBody },
            role: "alert"
          }, itemErrors.category_id) : null
        ])
      ]),
      // Image URL
      React.createElement("div", { key: "img-field" }, [
        React.createElement(Label, {
          key: "lbl",
          htmlFor: "item-img",
          className: "text-sm font-medium",
          style: { color: "#2a2a2a", fontFamily: brand.fontBody }
        }, [
          "Image URL ",
          React.createElement("span", {
            key: "opt",
            className: "font-normal",
            style: { color: brand.neutralColor }
          }, "(optional)")
        ]),
        React.createElement(Input, {
          key: "inp",
          id: "item-img",
          value: itemForm.image_url,
          onChange: function(e) { setItemForm(Object.assign({}, itemForm, { image_url: e.target.value })); },
          className: "mt-1.5 w-full",
          style: inputBase,
          placeholder: "/images/flat-white.jpg"
        })
      ]),
      // Available toggle
      React.createElement("div", { key: "avail-row", className: "flex items-center justify-between" }, [
        React.createElement(Label, {
          key: "lbl",
          htmlFor: "item-avail",
          className: "text-sm font-medium",
          style: { color: "#2a2a2a", fontFamily: brand.fontBody }
        }, "Available on menu"),
        React.createElement(Switch, {
          key: "sw",
          id: "item-avail",
          checked: itemForm.is_available,
          onCheckedChange: function(v) { setItemForm(Object.assign({}, itemForm, { is_available: v })); }
        })
      ]),
      // Buttons
      React.createElement("div", { key: "btns", className: "flex items-center gap-3 pt-2" }, [
        React.createElement(Button, {
          key: "save",
          type: "submit",
          style: { backgroundColor: brand.primaryColor, color: "#fff", borderRadius: brand.radius, fontFamily: brand.fontBody, fontWeight: 500 }
        }, editItemId ? "Save changes" : "Add item"),
        React.createElement("button", {
          key: "cancel",
          type: "button",
          onClick: resetItemForm,
          className: "text-sm font-medium",
          style: { color: brand.neutralColor, fontFamily: brand.fontBody }
        }, "Cancel")
      ])
    ])
  ])) : null;

  // Toast
  var toastEl = toast ? React.createElement("div", {
    key: "toast",
    className: "fixed bottom-6 left-1/2 -translate-x-1/2 fadeUp",
    style: {
      backgroundColor: brand.primaryColor,
      color: "#ffffff",
      borderRadius: brand.radius,
      padding: "0.625rem 1.25rem",
      fontFamily: brand.fontBody,
      fontSize: "0.875rem",
      fontWeight: 500,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      animation: "fadeUp 0.2s ease-out",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    role: "status"
  }, [
    React.createElement(Icons.CheckCircle, { key: "ic", "aria-hidden": "true", style: { width: 16, height: 16 } }),
    toast
  ]) : null;

  return React.createElement("div", {
    style: { backgroundColor: brand.backgroundColor, fontFamily: brand.fontBody },
    className: "min-h-screen px-4 py-8 sm:px-6 sm:py-10"
  }, [
    React.createElement("style", {
      key: "styles",
      dangerouslySetInnerHTML: { __html: '@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.fadeUp{animation:none!important}}' }
    }),
    React.createElement("div", { key: "wrap", className: "mx-auto max-w-3xl" }, [
      // Header
      React.createElement("div", { key: "header", className: "flex items-start justify-between gap-4" }, [
        React.createElement("div", { key: "head-text" }, [
          React.createElement("h1", {
            key: "h1",
            className: "text-2xl font-semibold tracking-tight",
            style: { color: brand.primaryColor, fontFamily: brand.fontHeading }
          }, "Menu Management"),
          React.createElement("p", {
            key: "sub",
            className: "mt-1.5 text-sm",
            style: { color: brand.neutralColor }
          }, "Add, edit, and remove categories and items on the public menu.")
        ]),
        React.createElement("button", {
          key: "view-menu",
          type: "button",
          onClick: function() { navigate("menu"); },
          className: "text-sm underline shrink-0 mt-1",
          style: { color: brand.primaryColor, fontFamily: brand.fontBody }
        }, "View public menu")
      ]),

      // Tabs
      React.createElement("div", {
        key: "tabs",
        className: "mt-8 flex gap-1 border-b",
        style: { borderColor: "rgba(168,168,160,0.3)" },
        role: "tablist"
      }, [
        React.createElement("button", {
          key: "cat-tab",
          role: "tab",
          "aria-selected": tab === "categories",
          onClick: function() { setTab("categories"); },
          style: tabBtnStyle(tab === "categories")
        }, [
          "Categories",
          React.createElement("span", {
            key: "count",
            className: "ml-1.5 text-xs",
            style: { color: brand.neutralColor }
          }, "(" + categories.length + ")")
        ]),
        React.createElement("button", {
          key: "item-tab",
          role: "tab",
          "aria-selected": tab === "items",
          onClick: function() { setTab("items"); },
          style: tabBtnStyle(tab === "items")
        }, [
          "Menu Items",
          React.createElement("span", {
            key: "count",
            className: "ml-1.5 text-xs",
            style: { color: brand.neutralColor }
          }, "(" + items.length + ")")
        ])
      ]),

      // Categories panel
      tab === "categories" ? React.createElement("div", {
        key: "cat-panel",
        className: "mt-6",
        role: "tabpanel",
        "aria-label": "Categories"
      }, [
        React.createElement("div", { key: "cat-list", className: "space-y-3" },
          categories.length === 0
            ? renderEmpty("No categories yet", "Create your first category to start organizing your menu.")
            : categories.map(renderCategory)
        ),
        // Add category form
        React.createElement("div", { key: "add-cat", className: "mt-6" }, [
          React.createElement(Separator, { key: "sep", className: "mb-5", style: { backgroundColor: "rgba(168,168,160,0.2)" } }),
          React.createElement("form", {
            key: "form",
            onSubmit: handleAddCategory,
            className: "flex items-end gap-3"
          }, [
            React.createElement("div", { key: "field", className: "flex-1" }, [
              React.createElement(Label, {
                key: "lbl",
                htmlFor: "new-cat",
                className: "text-sm font-medium block mb-1.5",
                style: { color: "#2a2a2a", fontFamily: brand.fontBody }
              }, "New category name"),
              React.createElement(Input, {
                key: "inp",
                id: "new-cat",
                value: newCat,
                onChange: function(e) { setNewCat(e.target.value); setCatError(""); },
                className: "w-full",
                style: inputBase,
                placeholder: "e.g., Tea & Infusions"
              })
            ]),
            React.createElement(Button, {
              key: "btn",
              type: "submit",
              className: "shrink-0",
              style: { backgroundColor: brand.primaryColor, color: "#fff", borderRadius: brand.radius, fontFamily: brand.fontBody, fontWeight: 500 }
            }, [
              React.createElement(Plus || Icons.Plus, { key: "plus-ic", "aria-hidden": "true", style: { width: 16, height: 16, marginRight: 4 } }),
              "Add category"
            ])
          ]),
          catError ? React.createElement("p", {
            key: "cat-err",
            className: "mt-2 text-sm",
            style: { color: "#B85450", fontFamily: brand.fontBody },
            role: "alert"
          }, catError) : null
        ])
      ]) : null,

      // Items panel
      tab === "items" ? React.createElement("div", {
        key: "item-panel",
        className: "mt-6",
        role: "tabpanel",
        "aria-label": "Menu Items"
      }, [
        itemFormCard,
        // Filter bar
        !showItemForm ? React.createElement("div", {
          key: "filter-bar",
          className: "flex items-center gap-3 flex-wrap sm:flex-nowrap"
        }, [
          React.createElement("div", { key: "search", className: "relative flex-1 min-w-[180px]" }, [
            React.createElement(icons.Search || Icons.Search, {
              "aria-hidden": "true",
              style: { width: 16, height: 16, position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: brand.neutralColor, pointerEvents: "none" }
            }),
            React.createElement(Input, {
              key: "search-inp",
              value: search,
              onChange: function(e) { setSearch(e.target.value); },
              placeholder: "Search items…",
              className: "w-full pl-8",
              style: inputBase,
              "aria-label": "Search menu items"
            })
          ]),
          React.createElement(Select, {
            key: "filter-sel",
            value: filterCat,
            onChange: function(e) { setFilterCat(e.target.value); },
            className: "w-auto",
            style: inputBase,
            "aria-label": "Filter by category"
          }, [
            React.createElement("option", { key: "all", value: "all" }, "All categories"),
            categories.map(function(c) {
              return React.createElement("option", { key: c.id, value: c.id }, c.name);
            })
          ]),
          React.createElement(Button, {
            key: "add-btn",
            onClick: openAddItem,
            className: "shrink-0",
            style: { backgroundColor: brand.primaryColor, color: "#fff", borderRadius: brand.radius, fontFamily: brand.fontBody, fontWeight: 500, whiteSpace: "nowrap" }
          }, [
            React.createElement(Icons.Plus, { key: "ic", "aria-hidden": "true", style: { width: 16, height: 16, marginRight: 4 } }),
            "Add item"
          ])
        ]) : null,

        // Item list
        React.createElement("div", { key: "item-list", className: "mt-5 space-y-3" },
          categories.length === 0
            ? renderEmpty("No categories to assign items to", "Create a category first, then add items to it.")
            : filteredItems.length === 0
              ? renderEmpty(
                  search || filterCat !== "all" ? "No items match your filters" : "No items yet",
                  search || filterCat !== "all" ? "Try adjusting your search or category filter." : "Click “Add item” to create your first menu item."
                )
              : filteredItems.map(renderItem)
        )
      ]) : null,

      // Footer nav
      React.createElement("div", {
        key: "footer",
        className: "mt-12 pt-6 border-t flex items-center gap-5 text-sm",
        style: { borderColor: "rgba(168,168,160,0.2)", fontFamily: brand.fontBody }
      }, [
        React.createElement("button", {
          key: "menu",
          type: "button",
          onClick: function() { navigate("menu"); },
          className: "underline",
          style: { color: brand.primaryColor }
        }, "Public menu"),
        React.createElement("button", {
          key: "staff",
          type: "button",
          onClick: function() { navigate("staff-orders"); },
          className: "underline",
          style: { color: brand.primaryColor }
        }, "Staff orders")
      ])
    ]),
    toastEl
  ]);
}
