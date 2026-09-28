import { RICE_OPTIONS, NO_RICE, type MenuItem, type RiceSelection } from "@/data/menu";

export type CartLine = {
  /** Unique per item + option combination */
  lineId: string;
  item_code: string;
  name: string;
  /** e.g. "With Egg" or "Bagnet, Egg" */
  optionLabel: string | null;
  /** e.g. "2 Plain Rice, 1 Fried Rice" */
  riceLabel: string | null;
  /** Price per unit including the selected options */
  unitPrice: number;
  qty: number;
  /** Shape sent to /api/v1/orders */
  options: Record<string, unknown> | null;
};

export type Selection = (
  | { type: "none" }
  | { type: "variant"; variantId: "with_egg" | "without_egg" }
  | { type: "toppings"; toppingIds: string[] }
) & { rice?: RiceSelection };

export function ricePrice(rice: RiceSelection): number {
  return RICE_OPTIONS.reduce((sum, r) => sum + r.price * rice[r.id], 0);
}

export function buildCartLine(item: MenuItem, selection: Selection): CartLine {
  const base = buildBaseLine(item, selection);
  if (!item.allow_rice_option) return base;
  const rice = selection.rice ?? NO_RICE;
  const parts = RICE_OPTIONS.filter((r) => rice[r.id] > 0).map(
    (r) => `${rice[r.id]} ${r.label}`,
  );
  return {
    ...base,
    lineId: `${base.lineId}|rice:${rice.plain}p${rice.fried}f`,
    riceLabel: parts.length ? parts.join(", ") : null,
    unitPrice: base.unitPrice + ricePrice(rice),
    options: { ...(base.options ?? {}), rice: { plain: rice.plain, fried: rice.fried } },
  };
}

function buildBaseLine(item: MenuItem, selection: Selection): CartLine {
  if (item.options?.type === "variant" && selection.type === "variant") {
    const choice =
      item.options.choices.find((c) => c.id === selection.variantId) ??
      item.options.choices[0]!;
    return {
      lineId: `${item.item_code}|${choice.id}`,
      item_code: item.item_code,
      name: item.name,
      optionLabel: choice.label,
      riceLabel: null,
      unitPrice: choice.price,
      qty: 1,
      options: { egg: choice.id === "with_egg" },
    };
  }

  if (item.options?.type === "toppings" && selection.type === "toppings") {
    const choices = item.options.choices.filter((c) =>
      selection.toppingIds.includes(c.id),
    );
    const ids = choices.map((c) => c.id);
    const extra = choices.reduce((sum, c) => sum + c.price, 0);
    return {
      lineId: `${item.item_code}|${ids.join("+") || "plain"}`,
      item_code: item.item_code,
      name: item.name,
      optionLabel: choices.length ? choices.map((c) => c.label).join(", ") : null,
      riceLabel: null,
      unitPrice: item.price + extra,
      qty: 1,
      options: { toppings: ids },
    };
  }

  return {
    lineId: item.item_code,
    item_code: item.item_code,
    name: item.name,
    optionLabel: null,
    riceLabel: null,
    unitPrice: item.price,
    qty: 1,
    options: null,
  };
}

export function addLine(cart: CartLine[], line: CartLine): CartLine[] {
  const existing = cart.find((l) => l.lineId === line.lineId);
  if (existing) {
    return cart.map((l) =>
      l.lineId === line.lineId ? { ...l, qty: l.qty + line.qty } : l,
    );
  }
  return [...cart, line];
}

export function changeQty(cart: CartLine[], lineId: string, delta: number): CartLine[] {
  return cart.map((l) =>
    l.lineId === lineId ? { ...l, qty: Math.max(1, l.qty + delta) } : l,
  );
}

export function removeLine(cart: CartLine[], lineId: string): CartLine[] {
  return cart.filter((l) => l.lineId !== lineId);
}

export function cartTotal(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.qty, 0);
}

export function formatPeso(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}
