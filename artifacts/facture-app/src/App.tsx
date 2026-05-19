import { useState, useRef } from "react";
import { toBlob } from "html-to-image";
import { CATALOG, type CatalogItem } from "@/lib/catalog";
import { cn, formatPrice, generateInvoiceNumber } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Trash2, 
  Download, 
  FileText, 
  RefreshCw, 
  ChevronDown,
  User,
  Phone,
  MapPin
} from "lucide-react";

type SelectedItem = {
  id: string;
  articleId?: string;
  name: string;
  qty: number;
  price: number;
  isCustom: boolean;
};

type TemplateType =
  | "classic"
  | "dark"
  | "gold"
  | "livraison-classic"
  | "livraison-dark"
  | "livraison-gold";

const isLivraisonTemplate = (t: TemplateType) => t.startsWith("livraison");

function App() {
  // ── Persistent state ──────────────────────────────
  const [shopName, setShopName] = useState(() => localStorage.getItem("shopName") || "");
  const [resellerName, setResellerName] = useState(() => localStorage.getItem("resellerName") || "");

  const saveShopName = (v: string) => { setShopName(v); localStorage.setItem("shopName", v); };
  const saveResellerName = (v: string) => { setResellerName(v); localStorage.setItem("resellerName", v); };

  // ── Invoice state ─────────────────────────────────
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber);

  const getInitialDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const [invoiceDate, setInvoiceDate] = useState(getInitialDate);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("classic");

  // ── Delivery fields ───────────────────────────────
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [deliveryError, setDeliveryError] = useState(false);

  // ── Accordion ─────────────────────────────────────
  const [openBrands, setOpenBrands] = useState<Set<string>>(() => new Set(["Samsung", "HP"]));
  const toggleBrand = (brand: string) => {
    setOpenBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  };

  const getBrandGroups = (category: "Mobile" | "PC") => {
    const items = CATALOG.filter((i) => i.category === category);
    const brands = Array.from(new Set(items.map((i) => i.brand)));
    return brands.map((brand) => ({ brand, items: items.filter((i) => i.brand === brand) }));
  };

  // ── Article handlers ──────────────────────────────
  const handleToggleItem = (item: CatalogItem, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [
        ...prev,
        { id: item.id, articleId: item.id, name: item.name, qty: 1, price: item.defaultPrice, isCustom: false },
      ]);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i.articleId !== item.id));
    }
  };

  const handleUpdateItem = (id: string, field: "qty" | "price" | "name", value: string | number) => {
    setSelectedItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddCustomItem = () => {
    setSelectedItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, name: "", qty: 1, price: 0, isCustom: true },
    ]);
  };

  const handleNewInvoice = () => {
    setInvoiceNumber(generateInvoiceNumber());
    setInvoiceDate(getInitialDate());
    setSelectedItems([]);
    setDeliveryError(false);
  };

  // ── Custom Template Selector Handler ──────────────
  const handleTemplateChange = (id: TemplateType) => {
    setSelectedTemplate(id);
    setDeliveryError(false);
    
    // Si on passe sur un template livraison ET qu'on est sur mobile (< 1024px pour la grille lg)
    if (id.startsWith("livraison") && window.innerWidth < 1024) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  // ── Download ──────────────────────────────────────
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (isLivraisonTemplate(selectedTemplate)) {
      if (!clientName.trim() || !clientPhone.trim() || !clientAddress.trim()) {
        setDeliveryError(true);
        // Remonte pour afficher l'erreur si besoin sur mobile
        if (window.innerWidth < 1024) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
    }
    setDeliveryError(false);
    if (!previewRef.current) return;
    const bgColor =
      selectedTemplate === "dark" ? "#1a1a2e"
      : selectedTemplate === "livraison-dark" ? "#0f172a"
      : "#ffffff";
    const blob = await toBlob(previewRef.current, { pixelRatio: 2, backgroundColor: bgColor });
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `facture-${invoiceNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const total = selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // ── Template colours ──────────────────────────────
  const livraison = {
    classic: { banner: "linear-gradient(135deg, #059669, #047857)", accent: "#059669", border: "#059669" },
    dark:    { banner: "linear-gradient(135deg, #0891b2, #0e7490)", accent: "#0891b2", border: "#0891b2" },
    gold:    { banner: "linear-gradient(135deg, #7c3aed, #6d28d9)", accent: "#7c3aed", border: "#7c3aed" },
  };

  const getLiv = () => {
    if (selectedTemplate === "livraison-dark")  return livraison.dark;
    if (selectedTemplate === "livraison-gold")  return livraison.gold;
    return livraison.classic;
  };

  // ── Render item row (shared) ──────────────────────
  const renderArticleList = (category: "Mobile" | "PC") =>
    getBrandGroups(category).map(({ brand, items }) => {
      const isOpen = openBrands.has(brand);
      const selectedCount = items.filter((item) => selectedItems.find((s) => s.articleId === item.id)).length;
      return (
        <div key={brand} className="border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleBrand(brand)}
            className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors"
          >
            <span className="font-semibold text-sm">{brand}</span>
            <div className="flex items-center gap-2">
              {selectedCount > 0 && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selectedCount}</span>
              )}
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
            </div>
          </button>
          {isOpen && (
            <div className="divide-y">
              {items.map((item) => {
                const selected = selectedItems.find((s) => s.articleId === item.id);
                return (
                  <div key={item.id} className={cn("px-4 py-2.5 flex flex-col gap-2 transition-colors", selected ? "bg-accent/20" : "hover:bg-muted/30")}>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`check-${item.id}`}
                        checked={!!selected}
                        onCheckedChange={(checked) => handleToggleItem(item, checked as boolean)}
                      />
                      <Label htmlFor={`check-${item.id}`} className="font-medium cursor-pointer flex-1 text-sm">{item.name}</Label>
                    </div>
                    {selected && (
                      <div className="flex items-center gap-2 pl-7">
                        <div className="w-20">
                          <Input
                            type="number" min="1" placeholder="Qté"
                            value={selected.qty === 0 ? "" : selected.qty}
                            onChange={(e) => handleUpdateItem(item.id, "qty", e.target.value === "" ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                            onBlur={(e) => { if (!e.target.value || parseInt(e.target.value) < 1) handleUpdateItem(item.id, "qty", 1); }}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            type="number" placeholder="Prix en FCFA"
                            value={selected.price === 0 ? "" : selected.price}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => handleUpdateItem(item.id, "price", parseInt(e.target.value) || 0)}
                            className="h-8 font-mono text-sm"
                          />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveItem(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });

  // ── Invoice preview content (shared table) ────────
  const renderTable = () => (
    <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: "48%" }} />
        <col style={{ width: "12%" }} />
        <col style={{ width: "90px" }} />
        <col style={{ width: "100px" }} />
      </colgroup>
      <thead>
        <tr className={cn(
          "text-left",
          selectedTemplate === "classic" && "text-gray-500",
          selectedTemplate === "dark" && "text-[#e53e3e]",
          selectedTemplate === "gold" && "text-[#c9a84c]",
          selectedTemplate === "livraison-classic" && "text-[#059669]",
          selectedTemplate === "livraison-dark" && "text-[#0891b2]",
          selectedTemplate === "livraison-gold" && "text-[#7c3aed]",
        )}>
          <th className="pb-2 font-semibold">Article</th>
          <th className="pb-2 font-semibold text-center">Qté</th>
          <th className="pb-2 font-semibold text-right pr-2">P.U</th>
          <th className="pb-2 font-semibold text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {selectedItems.length === 0 ? (
          <tr><td colSpan={4} className="py-8 text-center opacity-50 italic">Aucun article sélectionné</td></tr>
        ) : (
          selectedItems.map((item) => (
            <tr key={item.id} className={cn(
              "border-b last:border-0",
              selectedTemplate === "classic" && "border-gray-100",
              selectedTemplate === "dark" && "border-white/5",
              selectedTemplate === "gold" && "border-[#c9a84c]/10",
              selectedTemplate === "livraison-classic" && "border-gray-100",
              selectedTemplate === "livraison-dark" && "border-white/5",
              selectedTemplate === "livraison-gold" && "border-[#7c3aed]/10",
            )}>
              <td className="py-2.5 pr-3 font-medium" style={{ wordBreak: "break-word" }}>{item.name || "Article"}</td>
              <td className="py-2.5 text-center">{item.qty}</td>
              <td className="py-2.5 text-right font-mono text-xs pr-2" style={{ whiteSpace: "nowrap" }}>{formatPrice(item.price).replace(" F", "")}</td>
              <td className="py-2.5 text-right font-mono font-bold text-xs" style={{ whiteSpace: "nowrap" }}>{formatPrice(item.price * item.qty)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  // ── Classic invoice preview ───────────────────────
  const renderClassicInvoice = () => (
    <div
      ref={previewRef}
      className={cn(
        "w-[380px] min-w-[380px] min-h-[500px] flex flex-col p-6 shadow-xl transition-all duration-300",
        selectedTemplate === "classic" && "bg-white text-black border border-[#e0e0e0]",
        selectedTemplate === "dark" && "bg-[#1a1a2e] text-white border-none",
        selectedTemplate === "gold" && "bg-white text-[#222] border-2 border-[#c9a84c]/20 relative overflow-hidden",
      )}
      style={{ boxShadow: selectedTemplate === "gold" ? "0 10px 40px -10px rgba(201,168,76,0.2)" : "0 10px 40px -10px rgba(0,0,0,0.1)" }}
    >
      {selectedTemplate === "gold" && (
        <>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#c9a84c]/40 via-[#c9a84c] to-[#c9a84c]/40" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#c9a84c]/40 via-[#c9a84c] to-[#c9a84c]/40" />
        </>
      )}
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className={cn("text-2xl font-black tracking-tight uppercase mb-2",
          selectedTemplate === "gold" && "text-[#c9a84c]",
          selectedTemplate === "dark" && "text-white",
        )}>{shopName || "NOM DE LA BOUTIQUE"}</h1>
        <p className={cn("text-xs font-bold mb-1",
          selectedTemplate === "classic" && "text-gray-500",
          selectedTemplate === "dark" && "text-gray-400",
          selectedTemplate === "gold" && "text-gray-500",
        )}>📞 01 96 95 96 04</p>
        <div className={cn("text-sm",
          selectedTemplate === "classic" && "text-gray-600",
          selectedTemplate === "dark" && "text-gray-400",
          selectedTemplate === "gold" && "text-gray-500",
        )}>
          <p>{invoiceNumber}</p>
          <p>{new Date(invoiceDate).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(",", " à")}</p>
        </div>
      </div>
      {/* Revendeur */}
      <div className="mb-4">
        <p className="font-medium text-sm">
          Revendeur : <span className={cn("font-bold",
            selectedTemplate === "dark" && "text-[#e53e3e]",
            selectedTemplate === "gold" && "text-[#c9a84c]",
          )}>{resellerName || "-"}</span>
        </p>
      </div>
      <div className={cn("w-full h-px mb-4",
        selectedTemplate === "classic" && "bg-[#e0e0e0]",
        selectedTemplate === "dark" && "bg-white/15",
        selectedTemplate === "gold" && "bg-[#c9a84c]/30",
      )} />
      {/* Table */}
      <div className="flex-1">{renderTable()}</div>
      <div className={cn("w-full h-px mt-4 mb-4",
        selectedTemplate === "classic" && "bg-black",
        selectedTemplate === "dark" && "bg-white/30",
        selectedTemplate === "gold" && "bg-[#c9a84c]",
      )} />
      {/* Total */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-bold">TOTAL</span>
        <span className={cn("text-2xl font-black font-mono tracking-tight",
          selectedTemplate === "dark" && "text-[#e53e3e]",
          selectedTemplate === "gold" && "text-[#c9a84c]",
        )}>{formatPrice(total)}</span>
      </div>
      {/* Footer */}
      <div className="mt-auto">
        <p className={cn("italic text-base font-semibold mb-4",
          selectedTemplate === "classic" && "text-gray-700",
          selectedTemplate === "dark" && "text-gray-300",
          selectedTemplate === "gold" && "text-[#8a7340]",
        )}>Vendeur : Justino</p>
        <p className="font-semibold italic text-sm text-center">Merci pour votre confiance !</p>
        <p className={cn("text-center text-[10px] mt-3 leading-tight",
          selectedTemplate === "classic" && "text-gray-400",
          selectedTemplate === "dark" && "text-gray-600",
          selectedTemplate === "gold" && "text-gray-400",
        )}>Bon de retrait — Ce document vaut uniquement comme justificatif de retrait des articles mentionnés ci-dessus.</p>
      </div>
    </div>
  );

  // ── Livraison invoice preview ─────────────────────
  const renderLivraisonInvoice = () => {
    const lv = getLiv();
    const isDark = selectedTemplate === "livraison-dark";
    return (
      <div
        ref={previewRef}
        className={cn(
          "w-[380px] min-w-[380px] min-h-[500px] flex flex-col shadow-xl transition-all duration-300 overflow-hidden",
          isDark ? "text-white" : "text-[#222]",
        )}
        style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
      >
        {/* Banner with enhanced padding */}
        <div className="px-6 py-6 text-white text-center" style={{ background: lv.banner }}>
          <h1 className="text-2xl font-black tracking-tight uppercase mb-1">{shopName || "NOM DE LA BOUTIQUE"}</h1>
          <p className="text-xs font-bold mb-2 opacity-90">📞 01 96 95 96 04</p>
          <p className="text-lg font-black tracking-widest mb-2">🚚 BON DE LIVRAISON</p>
          <p className="text-xs opacity-80">{invoiceNumber}</p>
          <p className="text-xs opacity-80">{new Date(invoiceDate).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(",", " à")}</p>
        </div>

        <div className="px-6 pt-5 pb-6 flex flex-col flex-1">
          {/* Destinataire styled with theme-matching uniform Lucide Icons */}
          <div className="mb-5 rounded-lg overflow-hidden" style={{
            background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
            borderLeft: `4px solid ${lv.border}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <p className="font-bold text-xs px-4 pt-3 pb-2 tracking-wider flex items-center gap-1.5" style={{ color: lv.accent }}>
              <span className="text-xs">BOX</span> DESTINATAIRE
            </p>
            <div className="px-4 pb-4 space-y-2.5">
              <p className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 shrink-0" style={{ color: lv.accent }} /> 
                {clientName || <span className="opacity-40 font-normal italic">Nom du client</span>}
              </p>
              <p className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" style={{ color: lv.accent }} /> 
                {clientPhone || <span className="opacity-40 font-normal italic">Téléphone</span>}
              </p>
              <p className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: lv.accent }} /> 
                {clientAddress || <span className="opacity-40 font-normal italic">Adresse de livraison</span>}
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full h-px mb-4" style={{ background: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb" }} />

          {/* Table */}
          <div className="flex-1">{renderTable()}</div>

          {/* Separator */}
          <div className="w-full h-px mt-4 mb-4" style={{ background: lv.accent }} />

          {/* Total */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold">TOTAL</span>
            <span className="text-2xl font-black font-mono tracking-tight" style={{ color: lv.accent }}>{formatPrice(total)}</span>
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <p className="italic text-base font-semibold mb-4" style={{ color: isDark ? "#cbd5e1" : "#555" }}>Vendeur : Justino</p>
            <p className="font-semibold italic text-sm text-center">Merci pour votre confiance !</p>
            <p className="text-center text-[10px] mt-3 leading-tight" style={{ color: isDark ? "#475569" : "#9ca3af" }}>
              Bon de livraison — Ce document confirme la commande et les informations de livraison.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ── Template selector button (Fixed Centered Previews) ──────────────────────
  const TemplateBtn = ({ id, label, preview }: { id: TemplateType; label: string; preview: React.ReactNode }) => (
    <button
      onClick={() => handleTemplateChange(id)}
      className={cn("flex flex-col items-center gap-2 p-2 border rounded-lg transition-all w-full",
        selectedTemplate === id ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "hover:bg-muted",
      )}
    >
      <div className="w-full h-12 rounded shadow-sm overflow-hidden flex items-center justify-center bg-muted/40 p-1">
        {preview}
      </div>
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );

  // ── Main render ───────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT COLUMN ───────────────────────── */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Générateur de Facture</h1>
              <p className="text-sm text-muted-foreground">Créez et partagez rapidement</p>
            </div>
          </div>

          {/* Delivery fields — SHOWN FIRST when a delivery template is selected */}
          {isLivraisonTemplate(selectedTemplate) && (
            <div className="bg-card border rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-4 ring-2 ring-primary/10">
              <h2 className="text-lg font-semibold flex items-center gap-2">🚚 Informations de livraison</h2>
              {deliveryError && (
                <p className="text-sm text-red-500 font-medium">⚠️ Veuillez remplir toutes les informations de livraison avant de générer la facture.</p>
              )}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>👤 Nom et prénom du client</Label>
                  <Input placeholder="Ex: Jean Dupont" value={clientName} onChange={(e) => { setClientName(e.target.value); setDeliveryError(false); }} />
                </div>
                <div className="space-y-2">
                  <Label>📞 Numéro de téléphone</Label>
                  <Input placeholder="Ex: 01 96 00 00 00" value={clientPhone} onChange={(e) => { setClientPhone(e.target.value); setDeliveryError(false); }} />
                </div>
                <div className="space-y-2">
                  <Label>📍 Adresse / emplacement de livraison</Label>
                  <Input placeholder="Ex: Cotonou, Cadjehoun" value={clientAddress} onChange={(e) => { setClientAddress(e.target.value); setDeliveryError(false); }} />
                </div>
              </div>
            </div>
          )}

          {/* Shop & Reseller */}
          <div className="bg-card border rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Nom de la boutique</Label>
                <Input id="shopName" placeholder="Ex: Electro Store" value={shopName} onChange={(e) => saveShopName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resellerName">Nom du revendeur</Label>
                <Input id="resellerName" placeholder="Ex: Ali" value={resellerName} onChange={(e) => saveResellerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Numéro de facture</Label>
                <Input value={invoiceNumber} readOnly className="bg-muted text-muted-foreground font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Date et heure</Label>
                <Input id="invoiceDate" type="datetime-local" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="bg-card border rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Articles</h2>
              <Button variant="outline" size="sm" onClick={handleAddCustomItem} className="gap-2">
                <Plus className="h-4 w-4" /><span>Ajouter</span>
              </Button>
            </div>
            <Tabs defaultValue="mobile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="mobile">Téléphones & Accessoires</TabsTrigger>
                <TabsTrigger value="pc">Ordinateurs</TabsTrigger>
              </TabsList>
              <TabsContent value="mobile" className="space-y-2">{renderArticleList("Mobile")}</TabsContent>
              <TabsContent value="pc" className="space-y-2">{renderArticleList("PC")}</TabsContent>
            </Tabs>
            {/* Custom items */}
            {selectedItems.filter((i) => i.isCustom).length > 0 && (
              <div className="space-y-2 mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Articles personnalisés</h3>
                {selectedItems.filter((i) => i.isCustom).map((item) => (
                  <div key={item.id} className="p-3 rounded-lg border bg-accent/10 border-primary/20 flex flex-col gap-3">
                    <Input placeholder="Nom de l'article" value={item.name} onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)} className="h-8 font-medium" />
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <Input type="number" min="1" value={item.qty === 0 ? "" : item.qty}
                          onChange={(e) => handleUpdateItem(item.id, "qty", e.target.value === "" ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                          onBlur={(e) => { if (!e.target.value || parseInt(e.target.value) < 1) handleUpdateItem(item.id, "qty", 1); }}
                          className="h-8"
                        />
                      </div>
                      <div className="flex-1">
                        <Input type="number" placeholder="Prix..." value={item.price || ""} onFocus={(e) => e.target.select()}
                          onChange={(e) => handleUpdateItem(item.id, "price", parseInt(e.target.value) || 0)}
                          className="h-8 font-mono"
                        />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-muted/50 p-4 rounded-lg mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{selectedItems.length} article(s) sélectionné(s)</span>
              <span className="text-xl font-bold text-primary font-mono tracking-tight">Total : {formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ──────────────────────── */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">

          {/* Template selector */}
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            {/* Classic section */}
            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">🧾 Factures classiques</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <TemplateBtn id="classic" label="Classic" preview={
                <div className="w-full h-full bg-white border border-gray-200 rounded flex flex-col items-center justify-center gap-1 p-1">
                  <div className="w-8 h-1 bg-black/80 rounded-full" />
                  <div className="w-full h-px bg-gray-200" />
                  <div className="w-6 h-0.5 bg-black/40 rounded-full" />
                </div>
              } />
              <TemplateBtn id="dark" label="Dark" preview={
                <div className="w-full h-full bg-[#1a1a2e] border border-gray-800 rounded flex flex-col items-center justify-center gap-1 p-1">
                  <div className="w-8 h-1 bg-white rounded-full" />
                  <div className="w-full h-px bg-white/10" />
                  <div className="w-6 h-0.5 bg-[#e53e3e] rounded-full" />
                </div>
              } />
              <TemplateBtn id="gold" label="Gold" preview={
                <div className="w-full h-full bg-white border border-[#c9a84c]/30 rounded flex flex-col items-center justify-center gap-1 p-1">
                  <div className="w-8 h-1 bg-[#c9a84c] rounded-full" />
                  <div className="w-full h-px bg-[#c9a84c]/30" />
                  <div className="w-6 h-0.5 bg-[#c9a84c] rounded-full" />
                </div>
              } />
            </div>

            {/* Livraison section */}
            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">🚚 Factures de livraison</p>
            <div className="grid grid-cols-3 gap-2">
              <TemplateBtn id="livraison-classic" label="Liv. Classic" preview={
                <div className="w-full h-full rounded overflow-hidden flex flex-col" style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
                  <div className="h-1/2 flex items-center justify-center">
                    <div className="w-8 h-1 bg-white/90 rounded-full" />
                  </div>
                  <div className="h-1/2 bg-white flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-[#059669] rounded-full" />
                  </div>
                </div>
              } />
              <TemplateBtn id="livraison-dark" label="Liv. Dark" preview={
                <div className="w-full h-full rounded overflow-hidden flex flex-col bg-[#0f172a]">
                  <div className="h-1/2 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0891b2,#0e7490)" }}>
                    <div className="w-8 h-1 bg-white/90 rounded-full" />
                  </div>
                  <div className="h-1/2 flex items-center justify-center">
                    <div className="w-6 h-0.5 rounded-full" style={{ background: "#0891b2" }} />
                  </div>
                </div>
              } />
              <TemplateBtn id="livraison-gold" label="Liv. Gold" preview={
                <div className="w-full h-full rounded overflow-hidden flex flex-col bg-white">
                  <div className="h-1/2 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
                    <div className="w-8 h-1 bg-white/90 rounded-full" />
                  </div>
                  <div className="h-1/2 flex items-center justify-center">
                    <div className="w-6 h-0.5 rounded-full" style={{ background: "#7c3aed" }} />
                  </div>
                </div>
              } />
            </div>
          </div>

          {/* Preview */}
          <div className="flex justify-center bg-muted/30 border rounded-xl p-2 sm:p-4 overflow-x-auto">
            {isLivraisonTemplate(selectedTemplate) ? renderLivraisonInvoice() : renderClassicInvoice()}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full gap-2 text-base font-semibold" onClick={handleDownload}>
              <Download className="h-5 w-5" /> <span>Télécharger l'image</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full gap-2 text-muted-foreground" onClick={handleNewInvoice}>
              <RefreshCw className="h-4 w-4" /> <span>Nouvelle facture</span>
            </Button>
          </div>

        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;