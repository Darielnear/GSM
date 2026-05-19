// ══════════════════════════════════════════════════════
// CATALOGUE PRODUITS — modifiable facilement
// Tous les prix sont à 0 par défaut (l'utilisateur les saisit)
// Pour changer un prix, modifie defaultPrice
// Pour ajouter un article, duplique une ligne et change id/name
// ══════════════════════════════════════════════════════

export type CatalogItem = {
  id: string;
  name: string;
  category: "Mobile" | "PC";
  brand: string;
  defaultPrice: number;
};

export const CATALOG: CatalogItem[] = [

  // ── SAMSUNG ────────────────────────────────────────
  { id: "m-s01", category: "Mobile", brand: "Samsung", name: "Samsung A06 - Ram4 64Go",       defaultPrice: 0 },
  { id: "m-s02", category: "Mobile", brand: "Samsung", name: "Samsung A06 - Ram4 128Go",      defaultPrice: 0 },
  { id: "m-s03", category: "Mobile", brand: "Samsung", name: "Samsung A07 - Ram4 64Go",       defaultPrice: 0 },
  { id: "m-s04", category: "Mobile", brand: "Samsung", name: "Samsung A07 - Ram4 128Go",      defaultPrice: 0 },
  { id: "m-s05", category: "Mobile", brand: "Samsung", name: "Samsung A16 - Ram4 128Go",      defaultPrice: 0 },
  { id: "m-s06", category: "Mobile", brand: "Samsung", name: "Samsung A16 - Ram6 128Go",      defaultPrice: 0 },
  { id: "m-s07", category: "Mobile", brand: "Samsung", name: "Samsung A16 - Ram8 256Go",      defaultPrice: 0 },
  { id: "m-s08", category: "Mobile", brand: "Samsung", name: "Samsung A17 - Ram4 128Go",      defaultPrice: 0 },
  { id: "m-s09", category: "Mobile", brand: "Samsung", name: "Samsung A17 - Ram6 128Go",      defaultPrice: 0 },
  { id: "m-s10", category: "Mobile", brand: "Samsung", name: "Samsung A17 - Ram8 256Go",      defaultPrice: 0 },
  { id: "m-s11", category: "Mobile", brand: "Samsung", name: "Samsung A26 5G - Ram6 128Go",   defaultPrice: 0 },
  { id: "m-s12", category: "Mobile", brand: "Samsung", name: "Samsung A26 5G - Ram8 256Go",   defaultPrice: 0 },
  { id: "m-s13", category: "Mobile", brand: "Samsung", name: "Samsung A36 5G - Ram6 128Go",   defaultPrice: 0 },
  { id: "m-s14", category: "Mobile", brand: "Samsung", name: "Samsung A36 5G - Ram8 256Go",   defaultPrice: 0 },
  { id: "m-s15", category: "Mobile", brand: "Samsung", name: "Samsung A56 5G - Ram8 128Go",   defaultPrice: 0 },
  { id: "m-s16", category: "Mobile", brand: "Samsung", name: "Samsung A56 5G - Ram8 256Go",   defaultPrice: 0 },
  { id: "m-s17", category: "Mobile", brand: "Samsung", name: "Samsung A57 5G - Ram8 256Go",   defaultPrice: 0 },
  { id: "m-s18", category: "Mobile", brand: "Samsung", name: "Samsung S26 Ultra - Ram12 512Go", defaultPrice: 0 },
  { id: "m-s19", category: "Mobile", brand: "Samsung", name: "Tablette Tab 11 - Ram4 64Go",   defaultPrice: 0 },
  { id: "m-s20", category: "Mobile", brand: "Samsung", name: "Tablette Tab 11 - Ram8 128Go",  defaultPrice: 0 },
  { id: "m-s21", category: "Mobile", brand: "Samsung", name: "Chargeur Samsung Type-C",       defaultPrice: 0 },

  // ── IPHONE ─────────────────────────────────────────
  { id: "m-i01", category: "Mobile", brand: "iPhone", name: "iPhone 13 - 128Go",              defaultPrice: 0 },
  { id: "m-i02", category: "Mobile", brand: "iPhone", name: "iPhone 13 - 256Go",              defaultPrice: 0 },
  { id: "m-i03", category: "Mobile", brand: "iPhone", name: "iPhone 14 - 128Go",              defaultPrice: 0 },
  { id: "m-i04", category: "Mobile", brand: "iPhone", name: "iPhone 14 - 256Go",              defaultPrice: 0 },
  { id: "m-i05", category: "Mobile", brand: "iPhone", name: "iPhone 14 Plus - 128Go",         defaultPrice: 0 },
  { id: "m-i06", category: "Mobile", brand: "iPhone", name: "iPhone 15 - 128Go",              defaultPrice: 0 },
  { id: "m-i07", category: "Mobile", brand: "iPhone", name: "iPhone 15 - 256Go",              defaultPrice: 0 },
  { id: "m-i08", category: "Mobile", brand: "iPhone", name: "iPhone 15 Plus - 128Go",         defaultPrice: 0 },
  { id: "m-i09", category: "Mobile", brand: "iPhone", name: "iPhone 16 - 128Go",              defaultPrice: 0 },
  { id: "m-i10", category: "Mobile", brand: "iPhone", name: "iPhone 16 - 256Go",              defaultPrice: 0 },
  { id: "m-i11", category: "Mobile", brand: "iPhone", name: "iPhone 16 Plus - 128Go",         defaultPrice: 0 },
  { id: "m-i12", category: "Mobile", brand: "iPhone", name: "iPhone 16 Pro - 256Go",          defaultPrice: 0 },
  { id: "m-i13", category: "Mobile", brand: "iPhone", name: "iPhone 16 Pro Max - 256Go",      defaultPrice: 0 },
  { id: "m-i14", category: "Mobile", brand: "iPhone", name: "iPhone 16 Pro Max - 512Go",      defaultPrice: 0 },

  // ── TECNO ──────────────────────────────────────────
  { id: "m-t01", category: "Mobile", brand: "Tecno", name: "Tecno Spark 20",                  defaultPrice: 0 },
  { id: "m-t02", category: "Mobile", brand: "Tecno", name: "Tecno Spark 20 Pro",              defaultPrice: 0 },
  { id: "m-t03", category: "Mobile", brand: "Tecno", name: "Tecno Spark 30",                  defaultPrice: 0 },
  { id: "m-t04", category: "Mobile", brand: "Tecno", name: "Tecno Spark 30 Pro",              defaultPrice: 0 },
  { id: "m-t05", category: "Mobile", brand: "Tecno", name: "Tecno Camon 30",                  defaultPrice: 0 },
  { id: "m-t06", category: "Mobile", brand: "Tecno", name: "Tecno Camon 30 Pro",              defaultPrice: 0 },
  { id: "m-t07", category: "Mobile", brand: "Tecno", name: "Tecno Phantom V Fold",            defaultPrice: 0 },
  { id: "m-t08", category: "Mobile", brand: "Tecno", name: "Tecno Pova 6 Pro",                defaultPrice: 0 },

  // ── INFINIX ────────────────────────────────────────
  { id: "m-x01", category: "Mobile", brand: "Infinix", name: "Infinix Hot 40",                defaultPrice: 0 },
  { id: "m-x02", category: "Mobile", brand: "Infinix", name: "Infinix Hot 40 Pro",            defaultPrice: 0 },
  { id: "m-x03", category: "Mobile", brand: "Infinix", name: "Infinix Hot 50",                defaultPrice: 0 },
  { id: "m-x04", category: "Mobile", brand: "Infinix", name: "Infinix Hot 50 Pro",            defaultPrice: 0 },
  { id: "m-x05", category: "Mobile", brand: "Infinix", name: "Infinix Note 40",               defaultPrice: 0 },
  { id: "m-x06", category: "Mobile", brand: "Infinix", name: "Infinix Note 40 Pro",           defaultPrice: 0 },
  { id: "m-x07", category: "Mobile", brand: "Infinix", name: "Infinix Zero 40",               defaultPrice: 0 },
  { id: "m-x08", category: "Mobile", brand: "Infinix", name: "Infinix Smart 8",               defaultPrice: 0 },

  // ── XIAOMI ─────────────────────────────────────────
  { id: "m-mi01", category: "Mobile", brand: "Xiaomi", name: "Xiaomi Redmi 13",               defaultPrice: 0 },
  { id: "m-mi02", category: "Mobile", brand: "Xiaomi", name: "Xiaomi Redmi 13C",              defaultPrice: 0 },
  { id: "m-mi03", category: "Mobile", brand: "Xiaomi", name: "Xiaomi Redmi Note 13",          defaultPrice: 0 },
  { id: "m-mi04", category: "Mobile", brand: "Xiaomi", name: "Xiaomi Redmi Note 13 Pro",      defaultPrice: 0 },
  { id: "m-mi05", category: "Mobile", brand: "Xiaomi", name: "Xiaomi 14T",                    defaultPrice: 0 },
  { id: "m-mi06", category: "Mobile", brand: "Xiaomi", name: "Xiaomi 14T Pro",                defaultPrice: 0 },
  { id: "m-mi07", category: "Mobile", brand: "Xiaomi", name: "Xiaomi Poco X6",                defaultPrice: 0 },
  { id: "m-mi08", category: "Mobile", brand: "Xiaomi", name: "Xiaomi Poco X6 Pro",            defaultPrice: 0 },

  // ── HP ─────────────────────────────────────────────
  { id: "p-hp01", category: "PC", brand: "HP", name: "HP Pavilion 15",                        defaultPrice: 0 },
  { id: "p-hp02", category: "PC", brand: "HP", name: "HP EliteBook 840",                      defaultPrice: 0 },
  { id: "p-hp03", category: "PC", brand: "HP", name: "HP ProBook 450",                        defaultPrice: 0 },
  { id: "p-hp04", category: "PC", brand: "HP", name: "HP Victus 15",                          defaultPrice: 0 },
  { id: "p-hp05", category: "PC", brand: "HP", name: "HP Envy 15",                            defaultPrice: 0 },

  // ── DELL ───────────────────────────────────────────
  { id: "p-dl01", category: "PC", brand: "Dell", name: "Dell Inspiron 15",                    defaultPrice: 0 },
  { id: "p-dl02", category: "PC", brand: "Dell", name: "Dell Inspiron 14",                    defaultPrice: 0 },
  { id: "p-dl03", category: "PC", brand: "Dell", name: "Dell Latitude 5540",                  defaultPrice: 0 },
  { id: "p-dl04", category: "PC", brand: "Dell", name: "Dell XPS 15",                         defaultPrice: 0 },
  { id: "p-dl05", category: "PC", brand: "Dell", name: "Dell Vostro 15",                      defaultPrice: 0 },

  // ── LENOVO ─────────────────────────────────────────
  { id: "p-lv01", category: "PC", brand: "Lenovo", name: "Lenovo IdeaPad 3",                  defaultPrice: 0 },
  { id: "p-lv02", category: "PC", brand: "Lenovo", name: "Lenovo IdeaPad 5",                  defaultPrice: 0 },
  { id: "p-lv03", category: "PC", brand: "Lenovo", name: "Lenovo ThinkPad E14",               defaultPrice: 0 },
  { id: "p-lv04", category: "PC", brand: "Lenovo", name: "Lenovo ThinkPad X1 Carbon",         defaultPrice: 0 },
  { id: "p-lv05", category: "PC", brand: "Lenovo", name: "Lenovo Legion 5",                   defaultPrice: 0 },

  // ── ACER ───────────────────────────────────────────
  { id: "p-ac01", category: "PC", brand: "Acer", name: "Acer Aspire 3",                       defaultPrice: 0 },
  { id: "p-ac02", category: "PC", brand: "Acer", name: "Acer Aspire 5",                       defaultPrice: 0 },
  { id: "p-ac03", category: "PC", brand: "Acer", name: "Acer Nitro 5",                        defaultPrice: 0 },
  { id: "p-ac04", category: "PC", brand: "Acer", name: "Acer Swift 3",                        defaultPrice: 0 },
  { id: "p-ac05", category: "PC", brand: "Acer", name: "Acer Predator Helios",                defaultPrice: 0 },

  // ── ASUS ───────────────────────────────────────────
  { id: "p-as01", category: "PC", brand: "Asus", name: "Asus VivoBook 15",                    defaultPrice: 0 },
  { id: "p-as02", category: "PC", brand: "Asus", name: "Asus ZenBook 14",                     defaultPrice: 0 },
  { id: "p-as03", category: "PC", brand: "Asus", name: "Asus ROG Strix G15",                  defaultPrice: 0 },
  { id: "p-as04", category: "PC", brand: "Asus", name: "Asus TUF Gaming A15",                 defaultPrice: 0 },
  { id: "p-as05", category: "PC", brand: "Asus", name: "Asus ExpertBook B1",                  defaultPrice: 0 },
];
