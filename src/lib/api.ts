import { MENU_ITEMS, type MenuItem } from "@/data/menu";
import type { CartLine } from "@/lib/cart";

/**
 * Mock API layer. These are the only two seams that will later point at the
 * Kong CE gateway (GET /api/v1/menu, POST /api/v1/orders) instead of mocks.
 */

export async function getMenu(): Promise<MenuItem[]> {
  await delay(120);
  return MENU_ITEMS;
}

export type OrderItemPayload = {
  item_code: string;
  qty: number;
  options: Record<string, unknown> | null;
};

export type OrderPayload = {
  items: OrderItemPayload[];
  channel: "kiosk";
};

export type OrderResponse = {
  order_no: string;
  payment_status: "PENDING" | "PAID";
  fulfillment_status: "RECEIVED" | "PREPARING" | "READY";
  total: number;
};

export function buildOrderPayload(cartItems: CartLine[]): OrderPayload {
  return {
    items: cartItems.map((line) => ({
      item_code: line.item_code,
      qty: line.qty,
      options: line.options,
    })),
    channel: "kiosk",
  };
}

export async function submitOrder(cartItems: CartLine[]): Promise<OrderResponse> {
  const payload = buildOrderPayload(cartItems);
  // Future: await fetch(`${GATEWAY_URL}/api/v1/orders`, { method: "POST", body: JSON.stringify(payload) })
  await delay(700);

  const total = cartItems.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);

  return {
    order_no: generateOrderNumber(),
    payment_status: "PENDING",
    fulfillment_status: "RECEIVED",
    total,
  };
}

function generateOrderNumber(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `${letter}${digits}`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
