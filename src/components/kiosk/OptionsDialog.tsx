import { useEffect, useMemo, useState } from "react";
import { RICE_OPTIONS, NO_RICE, type MenuItem, type RiceSelection } from "@/data/menu";
import { formatPeso, ricePrice, type Selection } from "@/lib/cart";

export function OptionsDialog({
  item,
  onClose,
  onConfirm,
}: {
  item: MenuItem;
  onClose: () => void;
  onConfirm: (selection: Selection) => void;
}) {
  const variantChoices = item.options?.type === "variant" ? item.options.choices : [];
  const toppingChoices = item.options?.type === "toppings" ? item.options.choices : [];

  const [variantId, setVariantId] = useState<"with_egg" | "without_egg">(
    variantChoices.find((c) => c.default)?.id ?? variantChoices[0]?.id ?? "without_egg",
  );
  const [toppingIds, setToppingIds] = useState<string[]>([]);
  const [rice, setRice] = useState<RiceSelection>(NO_RICE);
  const changeRice = (id: keyof RiceSelection, delta: number, max: number) =>
    setRice((r) => ({ ...r, [id]: Math.min(max, Math.max(0, r[id] + delta)) }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const total = useMemo(() => {
    const riceExtra = item.allow_rice_option ? ricePrice(rice) : 0;
    if (item.options?.type === "variant") {
      return (variantChoices.find((c) => c.id === variantId)?.price ?? item.price) + riceExtra;
    }
    const extra = toppingChoices
      .filter((c) => toppingIds.includes(c.id))
      .reduce((sum, c) => sum + c.price, 0);
    return item.price + extra + riceExtra;
  }, [item, variantId, toppingIds, variantChoices, toppingChoices, rice]);

  const toggleTopping = (id: string) =>
    setToppingIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.options?.title ?? item.name}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl font-extrabold text-foreground">{item.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {item.options?.title ?? "Add rice (not included)"}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {item.options?.type === "variant" &&
            variantChoices.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setVariantId(c.id)}
                aria-pressed={variantId === c.id}
                className={`flex min-h-16 items-center justify-between rounded-2xl border-2 px-5 text-left text-lg font-bold transition-colors ${
                  variantId === c.id
                    ? "border-primary bg-secondary/30 text-foreground"
                    : "border-border bg-background text-foreground"
                }`}
              >
                <span>{c.label}</span>
                <span>{formatPeso(c.price)}</span>
              </button>
            ))}

          {item.options?.type === "toppings" &&
            toppingChoices.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleTopping(c.id)}
                aria-pressed={toppingIds.includes(c.id)}
                className={`flex min-h-16 items-center justify-between rounded-2xl border-2 px-5 text-left text-lg font-bold transition-colors ${
                  toppingIds.includes(c.id)
                    ? "border-primary bg-secondary/30 text-foreground"
                    : "border-border bg-background text-foreground"
                }`}
              >
                <span>{c.label}</span>
                <span>+{formatPeso(c.price)}</span>
              </button>
            ))}

          {item.allow_rice_option && (
            <div className="mt-2 flex flex-col gap-3">
              {item.options && (
                <p className="text-sm font-semibold text-muted-foreground">Add rice (not included)</p>
              )}
              {RICE_OPTIONS.map((r) => (
                <div
                  key={r.id}
                  className="flex min-h-16 items-center justify-between rounded-2xl border-2 border-border bg-background px-5"
                >
                  <div>
                    <p className="text-lg font-bold text-foreground">{r.label}</p>
                    <p className="text-sm text-muted-foreground">+{formatPeso(r.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease ${r.label}`}
                      onClick={() => changeRice(r.id, -1, r.max)}
                      disabled={rice[r.id] <= 0}
                      className="h-12 w-12 rounded-full border-2 border-border text-xl font-extrabold text-foreground disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-lg font-extrabold">{rice[r.id]}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${r.label}`}
                      onClick={() => changeRice(r.id, 1, r.max)}
                      disabled={rice[r.id] >= r.max}
                      className="h-12 w-12 rounded-full bg-primary text-xl font-extrabold text-primary-foreground disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-14 rounded-full border-2 border-border px-6 text-base font-extrabold uppercase text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onConfirm(
                item.options?.type === "variant"
                  ? { type: "variant", variantId, rice }
                  : item.options?.type === "toppings"
                    ? { type: "toppings", toppingIds, rice }
                    : { type: "none", rice },
              )
            }
            className="min-h-14 flex-1 rounded-full bg-primary px-6 text-base font-extrabold uppercase text-primary-foreground active:scale-95"
          >
            Add — {formatPeso(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
