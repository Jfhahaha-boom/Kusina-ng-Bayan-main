export function KioskHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-[var(--gradient-warm)] bg-primary px-6 py-5 shadow-[var(--shadow-card)]">
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-foreground/80">
        Self-Order Kiosk
      </p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-primary-foreground sm:text-4xl">
        Kusina ng Bayan
      </h1>
    </header>
  );
}
