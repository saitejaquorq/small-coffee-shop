// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Button, Input, Label, Empty } = UI;
const { Plus, Check, Menu, Package, Trash, ArrowLeft, AlertCircle } = Icons;

export default function Screen() {
  const navigate = useNavigate();
  const brand = {
    primaryColor: '#5B6F5B',
    accentColor: '#C4A77D',
    neutralColor: '#A8A8A0',
    backgroundColor: '#F5F2EC',
    radius: '0.5rem',
    fontHeading: 'Inter, system-ui, sans-serif',
    fontBody: 'Inter, system-ui, sans-serif',
  };

  // Seed cart with a realistic order-in-progress
  const initialCart = [
    {
      lineId: 'c1',
      id: 'm1',
      name: 'Flat White',
      description: 'Double ristretto, steamed whole milk, velvet microfoam.',
      price: 4.50,
      quantity: 2,
      notes: 'One with oat milk, one regular',
    },
    {
      lineId: 'c2',
      id: 'm2',
      name: 'Almond Croissant',
      description: 'Day-baked, hand-laminated, toasted almond filling.',
      price: 3.75,
      quantity: 1,
      notes: '',
    },
    {
      lineId: 'c3',
      id: 'm3',
      name: 'Pour Over — Ethiopia Yirgacheffe',
      description: 'Single origin, washed. Notes of jasmine, peach, black tea.',
      price: 5.00,
      quantity: 1,
      notes: 'Extra hot',
    },
  ];

  const [cart, setCart] = React.useState(initialCart);
  const [customerName, setCustomerName] = React.useState('');
  const [pickupTime, setPickupTime] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [placing, setPlacing] = React.useState(false);
  const [nameTouched, setNameTouched] = React.useState(false);

  const lineTotal = (item) => item.price * item.quantity;
  const cartTotal = cart.reduce((sum, item) => sum + lineTotal(item), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (lineId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (lineId) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const updateNotes = (lineId, notes) => {
    setCart((prev) =>
      prev.map((item) =>
        item.lineId === lineId ? { ...item, notes } : item
      )
    );
  };

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) errs.customerName = 'Tell us the name to put on the order.';
    if (!pickupTime) errs.pickupTime = 'Choose when you’d like to pick up.';
    if (cart.length === 0) errs.cart = 'Your cart is empty — add something from the menu first.';
    return errs;
  };

  const handlePlaceOrder = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPlacing(true);
    // Generate a unique cart order ID
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let idPart = '';
    for (let i = 0; i < 6; i++) {
      idPart += chars[Math.floor(Math.random() * chars.length)];
    }
    const cartOrderId = 'CF-' + idPart;

    setTimeout(() => {
      setPlacing(false);
      navigate('order-confirmation');
    }, 600);
  };

  const pickupOptions = [
    { value: 'asap', label: 'ASAP', hint: 'Ready as soon as it’s made' },
    { value: '15', label: 'In 15 minutes', hint: '~12:45 pickup window' },
    { value: '30', label: 'In 30 minutes', hint: '~1:00 pickup window' },
  ];

  const fmtPrice = (n) => '$' + n.toFixed(2);

  const inputBase = {
    fontFamily: brand.fontBody,
    borderRadius: brand.radius,
    border: '1px solid #E0DBD0',
    backgroundColor: '#FFFDF9',
  };

  const headingStyle = {
    fontFamily: brand.fontHeading,
    fontWeight: 600,
    letterSpacing: '-0.02em',
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: brand.backgroundColor, fontFamily: brand.fontBody }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{
          backgroundColor: 'rgba(245, 242, 236, 0.95)',
          backdropFilter: 'blur(8px)',
          borderColor: '#E5E0D4',
        }}
      >
        <div className="mx-auto max-w-2xl px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('menu')}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: brand.primaryColor }}
            aria-label="Back to menu"
          >
            <Icons.ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Menu
          </button>
          <span
            className="text-xs uppercase tracking-wider font-medium"
            style={{ color: brand.neutralColor }}
          >
            Cart & Checkout
          </span>
          <span
            className="inline-flex items-center justify-center text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: cart.length > 0 ? brand.primaryColor : '#E0DBD0',
              color: cart.length > 0 ? '#FFFFFF' : brand.neutralColor,
              fontVariantNumeric: 'tabular-nums',
              minWidth: '1.5rem',
            }}
            aria-label={`${itemCount} items in cart`}
          >
            {itemCount}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-10">
        {/* Screen heading */}
        <h1
          className="text-3xl sm:text-4xl mb-1"
          style={headingStyle}
        >
          Your Cart
        </h1>
        <p
          className="text-sm mb-8 sm:mb-10"
          style={{ color: brand.neutralColor }}
        >
          {cart.length === 0
            ? 'Nothing here yet.'
            : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready to review.`}
        </p>

        {/* Empty cart state */}
        {cart.length === 0 ? (
          <UI.Empty
            className="py-16 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E8E3D7' }}
              >
                <Icons.Package className="w-7 h-7" aria-hidden="true" style={{ color: brand.neutralColor }} />
              </div>
              <div>
                <p
                  className="text-lg mb-1"
                  style={headingStyle}
                >
                  Your cart is empty
                </p>
                <p
                  className="text-sm max-w-xs mx-auto"
                  style={{ color: brand.neutralColor }}
                >
                  Browse the menu and add something you’d like. We’ll keep it here while you decide.
                </p>
              </div>
              <UI.Button
                onClick={() => navigate('menu')}
                style={{
                  backgroundColor: brand.primaryColor,
                  color: '#FFFFFF',
                  borderRadius: brand.radius,
                  fontFamily: brand.fontBody,
                  fontWeight: 500,
                  padding: '0.625rem 1.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                className="hover:opacity-90"
              >
                Browse the menu
              </UI.Button>
            </div>
          </UI.Empty>
        ) : (
          <>
            {/* Cart items */}
            <section aria-label="Cart items" className="mb-8">
              <div className="divide-y" style={{ borderColor: '#E5E0D4' }}>
                {cart.map((item) => (
                  <div
                    key={item.lineId}
                    className="py-5 first:pt-0"
                    style={{ animation: 'fadeIn 0.25s ease' }}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base font-semibold leading-snug mb-0.5"
                          style={{ fontFamily: brand.fontHeading }}
                        >
                          {item.name}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: brand.neutralColor }}
                        >
                          {item.description}
                        </p>
                      </div>
                      <div
                        className="text-right shrink-0"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        <div className="text-base font-semibold">
                          {fmtPrice(lineTotal(item))}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: brand.neutralColor }}
                        >
                          {fmtPrice(item.price)} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls + remove */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="inline-flex items-center rounded-lg overflow-hidden"
                        style={{
                          border: '1px solid #E0DBD0',
                          borderRadius: brand.radius,
                          backgroundColor: '#FFFDF9',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.lineId, -1)}
                          className="w-9 h-9 flex items-center justify-center text-lg font-medium transition-colors"
                          style={{ color: brand.primaryColor, borderRight: '1px solid #E8E3D7', backgroundColor: 'transparent' }}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          –
                        </button>
                        <span
                          className="w-10 text-center text-sm font-semibold"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                          aria-label={`${item.quantity} in cart`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.lineId, 1)}
                          className="w-9 h-9 flex items-center justify-center text-lg font-medium transition-colors"
                          style={{ color: brand.primaryColor, borderLeft: '1px solid #E8E3D7', backgroundColor: 'transparent' }}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.lineId)}
                        className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-60"
                        style={{ color: '#B85C5C' }}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Icons.Trash className="w-4 h-4" aria-hidden="true" />
                        Remove
                      </button>
                    </div>

                    {/* Per-item notes */}
                    <div className="mt-2">
                      <UI.Label
                        htmlFor={`notes-${item.lineId}`}
                        className="text-xs font-medium mb-1.5 block"
                        style={{ color: brand.neutralColor }}
                      >
                        Note for this item
                      </UI.Label>
                      <UI.Input
                        id={`notes-${item.lineId}`}
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateNotes(item.lineId, e.target.value)}
                        placeholder="e.g. oat milk, extra shot, no sugar"
                        style={{
                          ...inputBase,
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          color: '#2A2A24',
                        }}
                        aria-label={`Special instructions for ${item.name}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add more link */}
              <button
                onClick={() => navigate('menu')}
                className="inline-flex items-center gap-1.5 text-sm font-medium mt-6 transition-opacity hover:opacity-70"
                style={{ color: brand.primaryColor }}
              >
                <Icons.Plus className="w-4 h-4" aria-hidden="true" />
                Add more from the menu
              </button>
            </section>

            {/* Order total */}
            <div
              className="rounded-xl px-5 py-4 mb-8 flex items-center justify-between"
              style={{
                backgroundColor: '#EDE8DC',
                borderRadius: brand.radius,
              }}
            >
              <span
                className="text-sm font-medium uppercase tracking-wide"
                style={{ color: brand.neutralColor }}
              >
                Total
              </span>
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: brand.fontHeading,
                  fontVariantNumeric: 'tabular-nums',
                  color: '#2A2A24',
                }}
              >
                {fmtPrice(cartTotal)}
              </span>
            </div>

            {/* Checkout form */}
            <section aria-label="Checkout details" className="mb-8">
              <h2
                className="text-lg mb-1"
                style={headingStyle}
              >
              Checkout
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: brand.neutralColor }}
              >
                No account needed. Just tell us who it’s for and when you’ll collect it.
              </p>

              <div className="space-y-6">
                {/* Customer name */}
                <div>
                  <UI.Label
                    htmlFor="customer-name"
                    className="text-sm font-medium mb-2 block"
                    style={{ color: '#2A2A24' }}
                  >
                    Your name
                  </UI.Label>
                  <UI.Input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) {
                        setErrors((prev) => ({ ...prev, customerName: undefined }));
                      }
                    }}
                    onBlur={() => setNameTouched(true)}
                    placeholder="First name is fine"
                    style={{
                      ...inputBase,
                      width: '100%',
                      padding: '0.75rem 1rem',
                      fontSize: '1rem',
                      color: '#2A2A24',
                      borderColor: errors.customerName ? '#C9716A' : '#E0DBD0',
                    }}
                    aria-invalid={!!errors.customerName}
                    aria-describedby={errors.customerName ? 'name-error' : undefined}
                  />
                  {errors.customerName && (
                    <p
                      id="name-error"
                      className="text-sm mt-1.5 flex items-center gap-1.5"
                      style={{ color: '#C9716A' }}
                      role="alert"
                    >
                      <Icons.AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Pickup time */}
                <fieldset>
                  <legend
                    className="text-sm font-medium mb-3 block"
                    style={{ color: '#2A2A24' }}
                  >
                    Pickup time
                  </legend>
                  <div
                    className="grid grid-cols-1 gap-2.5"
                    role="radiogroup"
                    aria-label="Pickup time"
                  >
                    {pickupOptions.map((opt) => {
                      const selected = pickupTime === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className="flex items-center justify-between px-4 py-3 cursor-pointer transition-all"
                          style={{
                            border: selected
                              ? `2px solid ${brand.primaryColor}`
                              : '1px solid #E0DBD0',
                            borderRadius: brand.radius,
                            backgroundColor: selected ? 'rgba(91,111,91,0.06)' : '#FFFDF9',
                          }}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="pickup-time"
                              value={opt.value}
                              checked={selected}
                              onChange={(e) => {
                                setPickupTime(e.target.value);
                                if (errors.pickupTime) {
                                  setErrors((prev) => ({ ...prev, pickupTime: undefined }));
                                }
                              }}
                              className="sr-only"
                              aria-label={opt.label}
                            />
                            <span
                              className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                              style={{
                                borderColor: selected ? brand.primaryColor : '#C9C4B8',
                              }}
                            >
                              {selected && (
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: brand.primaryColor }}
                                />
                              )}
                            </span>
                            <span>
                              <span
                                className="text-sm font-medium block"
                                style={{ color: '#2A2A24' }}
                              >
                                {opt.label}
                              </span>
                              <span
                                className="text-xs block"
                                style={{ color: brand.neutralColor }}
                              >
                                {opt.hint}
                              </span>
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.pickupTime && (
                    <p
                      className="text-sm mt-2 flex items-center gap-1.5"
                      style={{ color: '#C9716A' }}
                      role="alert"
                    >
                      <Icons.AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.pickupTime}
                    </p>
                  )}
                </fieldset>
              </div>
            </section>

            {/* Place order */}
            <div className="sticky bottom-0 -mx-5 px-5 py-4 border-t sm:-mx-0 sm:mx-0 sm:rounded-xl"
              style={{
                backgroundColor: 'rgba(245, 242, 236, 0.97)',
                backdropFilter: 'blur(8px)',
                borderColor: '#E5E0D4',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs uppercase tracking-wide font-medium"
                  style={{ color: brand.neutralColor }}
                >
                  Total to pay at kiosk
                </span>
                <span
                  className="text-xl font-bold"
                  style={{
                    fontFamily: brand.fontHeading,
                    fontVariantNumeric: 'tabular-nums',
                    color: '#2A2A24',
                  }}
                >
                  {fmtPrice(cartTotal)}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full flex items-center justify-center gap-2 py-3.5 text-base font-semibold transition-all"
                style={{
                  backgroundColor: placing ? brand.neutralColor : brand.primaryColor,
                  color: '#FFFFFF',
                  borderRadius: brand.radius,
                  fontFamily: brand.fontBody,
                  border: 'none',
                  cursor: placing ? 'not-allowed' : 'pointer',
                  opacity: placing ? 0.7 : 1,
                }}
                aria-label="Place your order"
              >
                {placing ? (
                  <>
                    <span
                      className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                      style={{ animation: 'spin 0.6s linear infinite' }}
                      aria-hidden="true"
                    />
                    Placing your order…
                  </>
                ) : (
                  <>
                    Place order
                    <Icons.Check className="w-5 h-5" aria-hidden="true" />
                  </>
                )}
              </button>
              <p
                className="text-center text-xs mt-2.5"
                style={{ color: brand.neutralColor }}
              >
                Pay in person at the kiosk with your order ID. No online payment.
              </p>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder, textarea::placeholder {
          color: #B5B0A4;
        }
        input:focus, textarea:focus, select:focus {
          outline: 2px solid ${brand.primaryColor};
          outline-offset: -1px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
