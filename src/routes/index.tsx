import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MENU_ITEMS, type MenuItem } from "@/data/menu";
import { submitOrder, type OrderResponse } from "@/lib/api";
import {
  addLine,
  buildCartLine,
  changeQty,
  removeLine,
  type CartLine,
  type Selection,
} from "@/lib/cart";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { CategoryTabs } from "@/components/kiosk/CategoryTabs";
import { MenuCard } from "@/components/kiosk/MenuCard";
import { OptionsDialog } from "@/components/kiosk/OptionsDialog";
import { CartSidebar } from "@/components/kiosk/CartSidebar";
import { ConfirmationScreen } from "@/components/kiosk/ConfirmationScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kusina ng Bayan — Self-Order Kiosk" },
      {
        name: "description",
        content:
          "Order Filipino favorites — sisig, lugaw, halo-halo and more — from the Kusina ng Bayan self-order kiosk.",
      },
      { property: "og:title", content: "Kusina ng Bayan — Self-Order Kiosk" },
      {
        property: "og:description",
        content:
          "Browse the karinderya menu, customize your lugaw and sisig, and place your order at the counter.",
      },
    ],
  }),
  component: Kiosk,
});

function Kiosk() {
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const items = useMemo(
    () =>
      category === "all"
        ? MENU_ITEMS
        : MENU_ITEMS.filter((i) => i.category === category),
    [category],
  );

  const handleAdd = (item: MenuItem) => {
    if (item.options || item.allow_rice_option) {
      setPendingItem(item);
      return;
    }
    setCart((c) => addLine(c, buildCartLine(item, { type: "none" })));
  };

  const handleConfirmOptions = (selection: Selection) => {
    if (!pendingItem) return;
    setCart((c) => addLine(c, buildCartLine(pendingItem, selection)));
    setPendingItem(null);
  };

  const handlePlaceOrder = async () => {
    if (submitting || cart.length === 0) return;
    setSubmitting(true);
    try {
      const result = await submitOrder(cart);
      setOrder(result);
      setCart([]);
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return <ConfirmationScreen order={order} onNewOrder={() => setOrder(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <KioskHeader />
      <div className="mx-auto grid max-w-[1600px] gap-6 p-6 lg:grid-cols-[1fr_380px]">
        <main>
          <CategoryTabs active={category} onChange={setCategory} />
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <MenuCard key={item.item_code} item={item} onAdd={handleAdd} />
            ))}
          </div>
        </main>

        <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)]">
          <CartSidebar
            cart={cart}
            submitting={submitting}
            onQty={(id, d) => setCart((c) => changeQty(c, id, d))}
            onRemove={(id) => setCart((c) => removeLine(c, id))}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>

      {pendingItem && (
        <OptionsDialog
          item={pendingItem}
          onClose={() => setPendingItem(null)}
          onConfirm={handleConfirmOptions}
        />
      )}
    </div>
  );
}
