/**
 * Mock menu data, shaped to match a future `GET /api/v1/menu` response.
 * Keep `item_code`, `name` and `price` in sync with the ERPNext item records.
 */

export type CategoryName =
  | "Main Meals"
  | "Lugaw"
  | "Desserts"
  | "Drinks";

export type VariantOption = {
  /** Stored on the order payload as `options.egg` */
  id: "with_egg" | "without_egg";
  label: string;
  /** Absolute price for this variant (replaces base price) */
  price: number;
  default?: boolean;
};

export type ToppingOption = {
  /** Stored on the order payload inside `options.toppings` */
  id: string;
  label: string;
  price: number;
};

export type MenuItemOptions =
  | { type: "variant"; title: string; choices: VariantOption[] }
  | { type: "toppings"; title: string; choices: ToppingOption[] };

export type MenuItem = {
  item_code: string;
  name: string;
  category: CategoryName;
  price: number;
  description: string;
  image_url: string | null;
  options: MenuItemOptions | null;
  /** Main Meals don't include rice; when true the customer can add rice servings. */
  allow_rice_option: boolean;
};

/** Single source of truth for rice add-ons (price per serving, max per dish). */
export const RICE_OPTIONS = [
  { id: "plain", label: "Plain Rice", price: 25, max: 5 },
  { id: "fried", label: "Fried Rice", price: 30, max: 5 },
] as const;

export type RiceId = (typeof RICE_OPTIONS)[number]["id"];
export type RiceSelection = Record<RiceId, number>;
export const NO_RICE: RiceSelection = { plain: 0, fried: 0 };

const NO_RICE_ITEMS = ["MM-011", "MM-012"];

export const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All Menu" },
  { id: "Main Meals", label: "Main Meals" },
  { id: "Lugaw", label: "Lugaw" },
  { id: "Desserts", label: "Desserts" },
  { id: "Drinks", label: "Drinks" },
];

const RAW_MENU_ITEMS: Omit<MenuItem, "allow_rice_option">[] = [
  {
    item_code: "MM-001",
    name: "Pinakbet",
    category: "Main Meals",
    price: 145,
    description: "Squash, okra, eggplant and string beans simmered in shrimp paste.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-002",
    name: "Pork Sisig",
    category: "Main Meals",
    price: 135,
    description: "Sizzling chopped pork with onions, chili and calamansi.",
    image_url: null,
    options: {
      type: "variant",
      title: "Choose your Sisig",
      choices: [
        { id: "without_egg", label: "Without Egg", price: 135, default: true },
        { id: "with_egg", label: "With Egg", price: 150 },
      ],
    },
  },
  {
    item_code: "MM-003",
    name: "Lechon Kawali",
    category: "Main Meals",
    price: 169,
    description: "Deep-fried pork belly with crackling skin and liver sauce.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-004",
    name: "Chicken Adobo",
    category: "Main Meals",
    price: 120,
    description: "Chicken braised in soy sauce, vinegar, garlic and bay leaf.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-005",
    name: "Pork Adobo",
    category: "Main Meals",
    price: 130,
    description: "Tender pork slow-cooked in soy, vinegar, garlic and peppercorns.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-006",
    name: "Kare-Kare",
    category: "Main Meals",
    price: 180,
    description: "Oxtail and vegetables in rich peanut sauce with bagoong.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-007",
    name: "Chicken Inasal",
    category: "Main Meals",
    price: 149,
    description: "Grilled chicken marinated in lemongrass, calamansi and annatto.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-008",
    name: "Beef Caldereta",
    category: "Main Meals",
    price: 199,
    description: "Beef stewed in tomato sauce with potatoes, carrots and bell peppers.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-009",
    name: "Laing",
    category: "Main Meals",
    price: 99,
    description: "Dried taro leaves simmered in coconut milk with chili and pork.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-010",
    name: "Shanghai",
    category: "Main Meals",
    price: 70,
    description: "Crispy spring rolls of ground pork, carrots and onions.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-011",
    name: "Pancit",
    category: "Main Meals",
    price: 120,
    description: "Stir-fried noodles with vegetables, pork and calamansi.",
    image_url: null,
    options: null,
  },
  {
    item_code: "MM-012",
    name: "Pancit Palabok",
    category: "Main Meals",
    price: 130,
    description: "Rice noodles in shrimp gravy with chicharron, egg and shrimp.",
    image_url: null,
    options: null,
  },
  {
    item_code: "LG-001",
    name: "Regular Lugaw",
    category: "Lugaw",
    price: 40,
    description: "Warm rice porridge with ginger, garlic and spring onions.",
    image_url: null,
    options: {
      type: "toppings",
      title: "Add toppings",
      choices: [
        { id: "bagnet", label: "Bagnet", price: 40 },
        { id: "egg", label: "Egg", price: 20 },
        { id: "vegetables", label: "Vegetables", price: 25 },
        { id: "tuwalya", label: "Tuwalya", price: 30 },
      ],
    },
  },
  {
    item_code: "DS-001",
    name: "Mais con Yelo",
    category: "Desserts",
    price: 40,
    description: "Sweet corn kernels over shaved ice with milk.",
    image_url: null,
    options: null,
  },
  {
    item_code: "DS-002",
    name: "Saging con Yelo",
    category: "Desserts",
    price: 40,
    description: "Sweetened saba bananas over shaved ice with milk.",
    image_url: null,
    options: null,
  },
  {
    item_code: "DS-003",
    name: "Halo-Halo",
    category: "Desserts",
    price: 79,
    description: "Shaved ice with beans, jellies, leche flan and ube ice cream.",
    image_url: null,
    options: null,
  },
  {
    item_code: "DS-004",
    name: "Leche Flan",
    category: "Desserts",
    price: 70,
    description: "Silky egg custard topped with caramel syrup.",
    image_url: null,
    options: null,
  },
  {
    item_code: "DR-001",
    name: "Cola",
    category: "Drinks",
    price: 30,
    description: "Chilled classic cola served over ice.",
    image_url: null,
    options: null,
  },
  {
    item_code: "DR-002",
    name: "Root Beer",
    category: "Drinks",
    price: 30,
    description: "Sweet, frosty root beer served over ice.",
    image_url: null,
    options: null,
  },
  {
    item_code: "DR-003",
    name: "Sprite",
    category: "Drinks",
    price: 30,
    description: "Crisp lemon-lime soda served over ice.",
    image_url: null,
    options: null,
  },
  {
    item_code: "DR-004",
    name: "Nestea",
    category: "Drinks",
    price: 30,
    description: "Iced tea with a bright lemon finish.",
    image_url: null,
    options: null,
  },
  {
    item_code: "DR-005",
    name: "Pineapple Juice",
    category: "Drinks",
    price: 30,
    description: "Freshly chilled pineapple juice over ice.",
    image_url: null,
    options: null,
  },
];

export const MENU_ITEMS: MenuItem[] = RAW_MENU_ITEMS.map((i) => ({
  ...i,
  allow_rice_option: i.category === "Main Meals" && !NO_RICE_ITEMS.includes(i.item_code),
}));
