<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Kiosk architecture
- Menu data lives in `src/data/menu.ts` and all mock backend calls in `src/lib/api.ts` (`getMenu`, `submitOrder`) so they can be swapped for the Kong/ERPNext gateway without touching UI.
- Cart math and line identity (item_code + option combination) live in `src/lib/cart.ts`, keeping pricing logic testable outside components.
- Dish photos are bundled in `src/assets/menu/<item_code>.jpg` and resolved by code via `src/lib/menu-images.ts`, with a neutral fallback image.
