import type { OrderResponse } from "@/lib/api";
import { formatPeso } from "@/lib/cart";

export function ConfirmationScreen({
  order,
  onNewOrder,
}: {
  order: OrderResponse;
  onNewOrder: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
          Order Received
        </p>
        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Your order number
        </p>
        <p className="font-display text-7xl font-extrabold tracking-tight text-primary">
          {order.order_no}
        </p>

        <p className="mt-6 text-lg font-bold text-foreground">
          Please proceed to the cashier to complete payment.
        </p>

        <div className="mt-8 grid gap-3 text-left">
          <Row label="Payment" value={order.payment_status === "PENDING" ? "Pending" : "Paid"} />
          <Row label="Cashier" value={titleCase(order.fulfillment_status)} />
          <Row label="Total" value={formatPeso(order.total)} strong />
        </div>

        <button
          type="button"
          onClick={onNewOrder}
          className="mt-9 min-h-16 w-full rounded-full bg-primary text-lg font-extrabold uppercase tracking-wide text-primary-foreground active:scale-95"
        >
          Start New Order
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4">
      <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={
          strong
            ? "font-display text-xl font-extrabold text-foreground"
            : "rounded-full bg-secondary px-3 py-1 text-sm font-extrabold text-secondary-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

function titleCase(v: string) {
  return v.charAt(0) + v.slice(1).toLowerCase();
}
