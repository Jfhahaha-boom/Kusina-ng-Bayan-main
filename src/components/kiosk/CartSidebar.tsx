import { cartCount, cartTotal, formatPeso, type CartLine } from "@/lib/cart";

export function CartSidebar({
  cart,
  submitting,
  onQty,
  onRemove,
  onPlaceOrder,
}: {
  cart: CartLine[];
  submitting: boolean;
  onQty: (lineId: string, delta: number) => void;
  onRemove: (lineId: string) => void;
  onPlaceOrder: () => void;
}) {
  const total = cartTotal(cart);
  const count = cartCount(cart);
  const empty = cart.length === 0;

  return (
    <aside className="flex h-full flex-col rounded-3xl border border-border bg-sidebar shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-5">
        <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-foreground">
          Your Order
        </h2>
        <span className="rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {empty ? (
          <p className="px-2 py-10 text-center text-sm text-muted-foreground">
            Your cart is empty. Tap ADD on any dish to start your order.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {cart.map((line) => (
              <li
                key={line.lineId}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-extrabold text-foreground">
                      {line.name}
                      {line.optionLabel && line.name === "Pork Sisig"
                        ? ` (${line.optionLabel})`
                        : ""}
                    </p>
                    {line.optionLabel && line.name !== "Pork Sisig" && (
                      <p className="text-sm text-accent">+ {line.optionLabel}</p>
                    )}
                    {line.riceLabel && (
                      <p className="text-sm text-accent">+ {line.riceLabel}</p>
                    )}
                  </div>
                  <p className="whitespace-nowrap font-display text-base font-extrabold text-foreground">
                    {formatPeso(line.unitPrice * line.qty)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease ${line.name}`}
                      onClick={() => onQty(line.lineId, -1)}
                      disabled={line.qty <= 1}
                      className="h-11 w-11 rounded-full border-2 border-border text-xl font-extrabold text-foreground disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-lg font-extrabold">{line.qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${line.name}`}
                      onClick={() => onQty(line.lineId, 1)}
                      className="h-11 w-11 rounded-full bg-primary text-xl font-extrabold text-primary-foreground"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(line.lineId)}
                    className="min-h-11 rounded-full px-4 text-sm font-extrabold uppercase text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border px-6 py-5">
        <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPeso(total)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between font-display text-2xl font-extrabold text-foreground">
          <span>TOTAL</span>
          <span>{formatPeso(total)}</span>
        </div>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={empty || submitting}
          className="mt-5 min-h-16 w-full rounded-full bg-primary text-lg font-extrabold uppercase tracking-wide text-primary-foreground transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Placing Order…" : "Place Order"}
        </button>
        {empty && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Add at least one item before placing your order.
          </p>
        )}
      </div>
    </aside>
  );
}
