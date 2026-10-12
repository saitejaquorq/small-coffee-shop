// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Check, Bell, Home, FileText, Clock, ArrowLeft, CheckCircle } = Icons;

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

  // Simulated order data — what the cart screen would have passed after POST /api/orders
  const [order] = React.useState({
    cart_order_id: 'CF-2847',
    customer_name: 'Maren Holloway',
    pickup_time: 'in 15 minutes',
    created_at: '2026-10-12T09:42:00',
    total: 18.75,
    items: [
      {
        id: 1,
        menu_item_name: 'Cortado',
        quantity: 1,
        unit_price: 4.50,
        notes: 'oat milk, extra shot',
      },
      {
        id: 2,
        menu_item_name: 'Cold Brew Tonic',
        quantity: 2,
        unit_price: 5.25,
        notes: '',
      },
      {
        id: 3,
        menu_item_name: 'Almond Croissant',
        quantity: 1,
        unit_price: 3.75,
        notes: 'warmed, please',
      },
    ],
  });

  const [copied, setCopied] = React.useState(false);
  const orderIdRef = React.useRef(null);

  const handleCopyId = () => {
    // Simulate clipboard copy
    setCopied(true);
    if (orderIdRef.current) {
      orderIdRef.current.select();
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const lineTotal = (item) => item.unit_price * item.quantity;

  return (
    <div
      style={{
        fontFamily: brand.fontBody,
        backgroundColor: brand.backgroundColor,
        minHeight: '100vh',
      }}
      className="min-h-screen w-full"
    >
      <div className="mx-auto max-w-xl px-6 py-16 sm:py-20">
        {/* Success indicator */}
        <div className="flex flex-col items-center text-center mb-12">
          <div
            className="flex items-center justify-center mb-6"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: brand.primaryColor,
            }}
            aria-hidden="true"
          >
            {React.createElement(Icons.CheckCircle, {
              size: 28,
              color: '#F5F2EC',
              strokeWidth: 1.75,
            })}
          </div>

          <p
            className="text-sm tracking-wide uppercase mb-3"
            style={{ color: brand.neutralColor, letterSpacing: '0.08em' }}
          >
            Order placed
          </p>

          <h1
            className="text-3xl sm:text-4xl font-semibold leading-tight"
            style={{
              fontFamily: brand.fontHeading,
              color: '#2C3329',
            }}
          >
            Your order is in, {order.customer_name.split(' ')[0]}.
          </h1>

          <p
            className="mt-4 text-base leading-relaxed max-w-sm"
            style={{ color: '#6B6B63' }}
          >
            Show the order ID below at the kiosk to pay and pick up your drinks.
          </p>
        </div>

        {/* Order ID — the focal point */}
        <div
          className="rounded-lg p-8 mb-10 text-center"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E4DC',
            borderRadius: brand.radius,
          }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: brand.neutralColor, letterSpacing: '0.12em' }}
          >
            Cart Order ID
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: brand.fontHeading,
                color: '#3A3024',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.04em',
              }}
            >
              {order.cart_order_id}
            </span>
          </div>

          <button
            onClick={handleCopyId}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 rounded-md px-3 py-1.5"
            style={{
              color: brand.primaryColor,
              focusRingColor: brand.primaryColor,
            }}
            aria-label="Copy order ID to clipboard"
          >
            {copied ? (
              <>
                {React.createElement(Icons.Check, { size: 16, strokeWidth: 2 })}
                Copied to clipboard
              </>
            ) : (
              <>
                {React.createElement(Icons.FileText, { size: 16, strokeWidth: 1.75 })}
                Copy order ID
              </>
            )}
          </button>

          {/* Hidden input for clipboard selection semantics */}
          <input
            ref={orderIdRef}
            type="text"
            value={order.cart_order_id}
            readOnly
            aria-hidden="true"
            tabIndex={-1}
            style={{ position: 'absolute', left: '-9999px' }}
          />
        </div>

        {/* Pickup info */}
        <div
          className="flex items-center justify-between gap-4 px-6 py-5 mb-10 rounded-lg"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E4DC',
            borderRadius: brand.radius,
          }}
        >
          <div className="flex items-center gap-3">
            {React.createElement(Icons.Clock, {
              size: 20,
              color: brand.primaryColor,
              strokeWidth: 1.75,
            })}
            <div>
              <p
                className="text-xs uppercase tracking-wide mb-0.5"
                style={{ color: brand.neutralColor, letterSpacing: '0.08em' }}
              >
                Pickup
              </p>
              <p className="text-base font-medium" style={{ color: '#2C3329' }}>
                {order.pickup_time}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p
              className="text-xs uppercase tracking-wide mb-0.5"
              style={{ color: brand.neutralColor, letterSpacing: '0.08em' }}
            >
              For
            </p>
            <p className="text-base font-medium" style={{ color: '#2C3329' }}>
              {order.customer_name}
            </p>
          </div>
        </div>

        {/* Order summary */}
        <div className="mb-10">
          <h2
            className="text-xs uppercase tracking-widest mb-5"
            style={{ color: brand.neutralColor, letterSpacing: '0.12em' }}
          >
            Order Summary
          </h2>

          <div
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E4DC',
              borderRadius: brand.radius,
            }}
          >
            {order.items.map((item, index) => (
              <div key={item.id}>
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-lg font-medium"
                          style={{ color: '#2C3329' }}
                        >
                          {item.menu_item_name}
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: brand.neutralColor }}
                        >
                          ×{item.quantity}
                        </span>
                      </div>
                      {item.notes && (
                        <p
                          className="mt-1 text-sm leading-relaxed"
                          style={{
                            color: '#6B6B63',
                            fontStyle: 'italic',
                          }}
                        >
                          {item.notes}
                        </p>
                      )}
                      <p
                        className="mt-2 text-sm"
                        style={{ color: brand.neutralColor, fontVariantNumeric: 'tabular-nums' }}
                      >
                        ${item.unit_price.toFixed(2)} each
                      </p>
                    </div>
                    <span
                      className="text-lg font-semibold whitespace-nowrap"
                      style={{ color: '#2C3329', fontVariantNumeric: 'tabular-nums' }}
                    >
                      ${lineTotal(item).toFixed(2)}
                    </span>
                  </div>
                </div>
                {index < order.items.length - 1 && (
                  <div style={{ borderTop: '1px solid #EDE9E1' }} />
                )}
              </div>
            ))}

            {/* Total */}
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ borderTop: '2px solid #E8E4DC' }}
            >
              <span
                className="text-base font-semibold uppercase tracking-wide"
                style={{ color: '#2C3329', letterSpacing: '0.06em' }}
              >
                Total
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: '#2C3329', fontVariantNumeric: 'tabular-nums' }}
              >
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Kiosk instructions */}
        <div
          className="rounded-lg p-6 mb-10"
          style={{
            backgroundColor: 'rgba(196, 167, 125, 0.10)',
            border: '1px solid rgba(196, 167, 125, 0.30)',
            borderRadius: brand.radius,
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <div
                className="flex items-center justify-center"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: brand.accentColor,
                }}
              >
                {React.createElement(Icons.Bell, {
                  size: 16,
                  color: '#FFFFFF',
                  strokeWidth: 1.75,
                })}
              </div>
            </div>
            <div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: '#3A3024' }}
              >
                Pay at the kiosk
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#5C5240' }}
              >
                Take your order ID <strong style={{ fontWeight: 600 }}>{order.cart_order_id}</strong> to the kiosk
                at the front counter. The barista will have your order ready by your pickup time.
                No online payment — you pay in person.
              </p>
            </div>
          </div>
        </div>

        {/* No tracking note */}
        <p
          className="text-center text-sm mb-8"
          style={{ color: brand.neutralColor }}
        >
          This confirmation page is your only record. There's no online order tracking —
          the kiosk is the next step.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('menu')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
            style={{
              backgroundColor: brand.primaryColor,
              color: '#F5F2EC',
              borderRadius: brand.radius,
            }}
          >
            {React.createElement(Icons.Home, { size: 18, color: '#F5F2EC', strokeWidth: 1.75 })}
            Back to menu
          </button>

          <button
            onClick={() => navigate('cart')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium transition-colors hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
            style={{
              backgroundColor: 'transparent',
              color: '#2C3329',
              border: '1px solid #D5D0C7',
              borderRadius: brand.radius,
            }}
          >
            {React.createElement(Icons.ArrowLeft, { size: 18, color: '#2C3329', strokeWidth: 1.75 })}
            View cart
          </button>
        </div>
      </div>
    </div>
  );
}
