import { CATEGORIES } from "@/data/menu";

export function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === active;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            aria-pressed={isActive}
            className={`min-h-14 shrink-0 rounded-full px-6 text-base font-extrabold uppercase tracking-wide transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-lift)]"
                : "border-2 border-border bg-card text-foreground hover:bg-secondary/40"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
