const MENU_STORAGE_KEY = "nubite_menu";
const MENU_VERSION_KEY = "nubite_menu_version";
const CURRENT_MENU_VERSION = 6;

// When extending the menu catalog, always ADD entries — never remove existing items.
// Migrations merge new catalog items into stored data without dropping anything.
// Retired items are removed only when explicitly replaced (see RETIRED_MENU_ITEMS).
const RETIRED_MENU_ITEMS = ["Soft Drinks"];

const STALLS = [
  { id: 1, name: "Stall 1" },
  { id: 2, name: "Stall 2" },
  { id: 3, name: "Stall 3" }
];

const STALL_ITEM_NAMES = {
  1: [
    "Pork Adobo", "Chicken Curry", "Pork Sinigang", "Beef Caldereta", "Menudo",
    "Fried Chicken", "Pork Chop", "Sisig", "Hotdog", "Egg", "Meatloaf", "Fried Bangus",
    "Monggo", "Tortang Talong", "Chopsuey", "Tocino", "Chicken Tinola", "Ginataang Gulay",
    "Bicol Express", "Adobong Sitaw", "Rice", "Water Bottle", "Iced Tea", "Sprite", "Coke", "Royal",
    "Spam", "Tapa", "Kare-Kare"
  ],
  2: [
    "Pork Adobo", "Pork Sinigang", "Menudo", "Fried Chicken", "Pork Chop",
    "Hotdog", "Egg", "Meatloaf", "Chopsuey", "Tocino", "Ginataang Gulay",
    "Bicol Express", "Adobong Sitaw", "Rice", "Water Bottle", "Iced Tea", "Sprite", "Coke", "Royal",
    "Spam", "Tapa", "Kare-Kare"
  ],
  3: [
    "Pork Adobo", "Pork Sinigang", "Beef Caldereta", "Menudo", "Fried Chicken",
    "Pork Chop", "Hotdog", "Egg", "Meatloaf", "Chopsuey", "Tocino",
    "Adobong Sitaw", "Rice", "Water Bottle", "Iced Tea", "Sprite", "Coke", "Royal"
  ]
};

const MENU_CATALOG = [
  { name: "Pork Adobo", category: "Lunch", price: 75, img: "../images/pork-adobo.png", popular: true },
  { name: "Chicken Curry", category: "Lunch", price: 80, img: "../images/chicken-curry.png" },
  { name: "Pork Sinigang", category: "Lunch", price: 85, img: "../images/pork-sinigang.png", popular: true },
  { name: "Beef Caldereta", category: "Lunch", price: 90, img: "../images/beef-caldereta.png" },
  { name: "Menudo", category: "Lunch", price: 75, img: "../images/menudo.png" },
  { name: "Fried Chicken", category: "Lunch", price: 85, img: "../images/fried-chicken.png", popular: true },
  { name: "Pork Chop", category: "Lunch", price: 80, img: "../images/pork-chop.png" },
  { name: "Sisig", category: "Lunch", price: 90, img: "../images/sisig.png", popular: true },
  { name: "Chicken Tinola", category: "Lunch", price: 80, img: "../images/tinola.png" },
  { name: "Bicol Express", category: "Lunch", price: 85, img: "../images/bicol-express.png" },
  { name: "Monggo", category: "Lunch", price: 50, img: "../images/monggo.png" },
  { name: "Tortang Talong", category: "Lunch", price: 45, img: "../images/tortang-talong.png" },
  { name: "Chopsuey", category: "Lunch", price: 60, img: "../images/chopsuey.png" },
  { name: "Ginataang Gulay", category: "Lunch", price: 55, img: "../images/ginataang-gulay.png" },
  { name: "Adobong Sitaw", category: "Lunch", price: 55, img: "../images/adobong-sitaw.png" },
  { name: "Rice", category: "Lunch", price: 15, img: "../images/rice.png" },
  { name: "Kare-Kare", category: "Lunch", price: 95, img: "../images/kare-kare.png" },
  { name: "Hotdog", category: "Breakfast", price: 40, img: "../images/hotdog.png" },
  { name: "Egg", category: "Breakfast", price: 15, img: "../images/egg.png" },
  { name: "Meatloaf", category: "Breakfast", price: 50, img: "../images/meatloaf.png" },
  { name: "Tocino", category: "Breakfast", price: 70, img: "../images/tocino.png", popular: true },
  { name: "Fried Bangus", category: "Breakfast", price: 85, img: "../images/fried-bangus.png" },
  { name: "Spam", category: "Breakfast", price: 50, img: "../images/spam.png" },
  { name: "Tapa", category: "Breakfast", price: 50, img: "../images/tapa.png" },
  { name: "Water Bottle", category: "Drinks", price: 20, img: "../images/water-bottle.png" },
  { name: "Iced Tea", category: "Drinks", price: 25, img: "../images/iced-tea.png" },
  { name: "Sprite", category: "Drinks", price: 30, img: "../images/sprite.png" },
  { name: "Coke", category: "Drinks", price: 30, img: "../images/coke.png" },
  { name: "Royal", category: "Drinks", price: 30, img: "../images/royal.png" }
];

const MENU_CATEGORIES = ["Breakfast", "Lunch", "Drinks"];

function stallsForItem(name) {
  const stalls = [];
  Object.entries(STALL_ITEM_NAMES).forEach(([stallId, names]) => {
    if (names.includes(name)) stalls.push(Number(stallId));
  });
  return stalls.sort();
}

function buildDefaultMenu() {
  return MENU_CATALOG.map(item => ({
    ...item,
    stalls: stallsForItem(item.name)
  }));
}

function slugifyName(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ensureMenuIds(items) {
  const used = new Set();
  return items.map((item, index) => {
    let id = item.id || `item-${slugifyName(item.name)}`;
    if (used.has(id)) id = `${id}-${index}`;
    used.add(id);
    const stalls = Array.isArray(item.stalls) && item.stalls.length
      ? [...new Set(item.stalls.map(Number))].sort()
      : stallsForItem(item.name);
    return {
      id,
      name: item.name,
      category: item.category,
      price: Number(item.price),
      img: item.img || "../images/placeholder.png",
      popular: !!item.popular,
      stalls
    };
  });
}

function mergeStallLists(existingStalls, catalogStalls) {
  const merged = [
    ...(Array.isArray(existingStalls) ? existingStalls.map(Number) : []),
    ...(Array.isArray(catalogStalls) ? catalogStalls.map(Number) : [])
  ];
  return [...new Set(merged.filter(Number.isFinite))].sort((a, b) => a - b);
}

function mergeMenuWithCatalog(existingMenu, catalogMenu) {
  const existingByName = new Map(existingMenu.map(item => [item.name, item]));
  const merged = [];

  catalogMenu.forEach(catalogItem => {
    const existing = existingByName.get(catalogItem.name);
    if (existing) {
      merged.push({
        ...existing,
        category: catalogItem.category,
        price: catalogItem.price,
        img: catalogItem.img,
        popular: catalogItem.popular,
        stalls: mergeStallLists(existing.stalls, catalogItem.stalls)
      });
      existingByName.delete(catalogItem.name);
    } else {
      merged.push(catalogItem);
    }
  });

  existingByName.forEach(item => {
    if (RETIRED_MENU_ITEMS.includes(item.name)) return;
    merged.push(item);
  });

  return merged.filter(item => !RETIRED_MENU_ITEMS.includes(item.name));
}

function migrateMenuIfNeeded() {
  const version = Number(localStorage.getItem(MENU_VERSION_KEY) || 0);
  if (version < CURRENT_MENU_VERSION) {
    const catalogMenu = ensureMenuIds(buildDefaultMenu());
    const stored = localStorage.getItem(MENU_STORAGE_KEY);
    let menu = catalogMenu;

    if (stored) {
      try {
        const existing = ensureMenuIds(JSON.parse(stored));
        menu = ensureMenuIds(mergeMenuWithCatalog(existing, catalogMenu));
      } catch {
        menu = catalogMenu;
      }
    }

    saveMenu(menu);
    localStorage.setItem(MENU_VERSION_KEY, String(CURRENT_MENU_VERSION));
  }
}

function getMenu() {
  migrateMenuIfNeeded();
  const stored = localStorage.getItem(MENU_STORAGE_KEY);
  if (!stored) {
    const menu = ensureMenuIds(buildDefaultMenu());
    saveMenu(menu);
    return menu.slice();
  }
  try {
    return ensureMenuIds(JSON.parse(stored));
  } catch {
    const menu = ensureMenuIds(buildDefaultMenu());
    saveMenu(menu);
    return menu.slice();
  }
}

function getMenuByStall(stallId) {
  const id = Number(stallId);
  return getMenu().filter(item => item.stalls && item.stalls.includes(id));
}

function getStallName(stallId) {
  const stall = STALLS.find(s => s.id === Number(stallId));
  return stall ? stall.name : `Stall ${stallId}`;
}

function saveMenu(menu) {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(ensureMenuIds(menu)));
}

function generateMenuId(name) {
  const base = `item-${slugifyName(name) || "new"}`;
  const menu = getMenu();
  if (!menu.some(item => item.id === base)) return base;
  return `${base}-${Date.now()}`;
}

function getMenuItem(id) {
  return getMenu().find(item => item.id === id);
}

function upsertMenuItem(item) {
  const menu = getMenu();
  const stalls = Array.isArray(item.stalls) && item.stalls.length
    ? [...new Set(item.stalls.map(Number))].sort()
    : stallsForItem(item.name);

  const normalized = {
    id: item.id || generateMenuId(item.name),
    name: String(item.name).trim(),
    category: item.category,
    price: Number(item.price),
    img: String(item.img || "").trim() || "../images/placeholder.png",
    popular: !!item.popular,
    stalls
  };

  const index = menu.findIndex(m => m.id === normalized.id);
  if (index >= 0) menu[index] = normalized;
  else menu.push(normalized);

  saveMenu(menu);
  return normalized;
}

function deleteMenuItem(id) {
  const menu = getMenu().filter(item => item.id !== id);
  saveMenu(menu);
}

function resetMenuToDefault() {
  const catalogMenu = ensureMenuIds(buildDefaultMenu());
  const stored = localStorage.getItem(MENU_STORAGE_KEY);
  let menu = catalogMenu;

  if (stored) {
    try {
      const existing = ensureMenuIds(JSON.parse(stored));
      menu = ensureMenuIds(mergeMenuWithCatalog(existing, catalogMenu));
    } catch {
      menu = catalogMenu;
    }
  }

  saveMenu(menu);
  localStorage.setItem(MENU_VERSION_KEY, String(CURRENT_MENU_VERSION));
}
