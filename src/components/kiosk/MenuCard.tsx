import type { MenuItem } from "@/data/menu";
import { formatPeso } from "@/lib/cart";
import { getItemImage, fallbackImage } from "@/lib/menu-images";

export function MenuCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={getItemImage(item.item_code)}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.src !== fallbackImage) el.src = fallbackImage;
          }}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-extrabold leading-tight text-foreground">
          {item.name}
        </h3>
        <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-display text-2xl font-extrabold text-foreground">
            {formatPeso(item.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(item)}
            className="min-h-13 rounded-full bg-primary px-7 py-3 text-base font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:bg-secondary hover:text-secondary-foreground active:scale-95"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
