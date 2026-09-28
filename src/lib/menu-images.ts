import fallback from "@/assets/menu-fallback.jpg";

/**
 * Bundled food photography, keyed by item_code (e.g. src/assets/menu/MM-001.jpg).
 * Any missing photo falls back to a neutral on-palette image so the grid never
 * shows a broken image icon.
 */
const images = import.meta.glob<string>("../assets/menu/*.jpg", {
  eager: true,
  import: "default",
});

const byCode: Record<string, string> = {};
for (const [path, url] of Object.entries(images)) {
  const code = path.split("/").pop()!.replace(/\.jpg$/, "");
  byCode[code] = url;
}

export const fallbackImage = fallback;

export function getItemImage(itemCode: string): string {
  return byCode[itemCode] ?? fallback;
}
