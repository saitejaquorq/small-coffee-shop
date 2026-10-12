import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import Menu from "@/screens/Menu";
import Cart from "@/screens/Cart";
import OrderConfirmation from "@/screens/OrderConfirmation";
import StaffOrders from "@/screens/StaffOrders";
import AdminMenu from "@/screens/AdminMenu";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

export default function App() {
  return (
    <div className="flex min-h-screen">
      <aside
        className="w-56 shrink-0 border-r p-4"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <p
          className="mb-4 px-3 text-sm font-semibold"
          style={{ fontFamily: "var(--brand-font-heading)" }}
        >
          {"Small coffee shop website where"}
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/menu" className={navLinkClass}>
            {"Menu"}
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            {"Cart & Checkout"}
          </NavLink>
          <NavLink to="/order-confirmation" className={navLinkClass}>
            {"Order Confirmation"}
          </NavLink>
          <NavLink to="/staff-orders" className={navLinkClass}>
            {"Staff Orders"}
          </NavLink>
          <NavLink to="/admin-menu" className={navLinkClass}>
            {"Admin Menu Management"}
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/staff-orders" element={<StaffOrders />} />
          <Route path="/admin-menu" element={<AdminMenu />} />
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </main>
    </div>
  );
}
