import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@shared/shopCatalog";
import { Lock, Download, Search, Loader2, Plus, Pencil, Trash2, Upload, X, Package, ShoppingCart } from "lucide-react";
import type { ShopOrder, ShopProduct } from "@shared/schema";
import type { OrderStatus } from "@shared/shopValidation";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  ready: "Ready for Pickup",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber/20 text-amber",
  confirmed: "bg-iceblue/20 text-iceblue",
  ready: "bg-risegreen/20 text-risegreen",
  picked_up: "bg-warmwhite/20 text-warmwhite/70",
  cancelled: "bg-crimson/20 text-crimson",
};

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        onLogin(data.token);
      }
    } catch {
      setError("Failed to connect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <div className="max-w-sm w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-slate/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-warmwhite/60" />
          </div>
          <h1 className="font-integral text-warmwhite text-2xl uppercase tracking-wide">
            Admin Access
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/40"
          />
          {error && <p className="text-crimson text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-crimson hover:bg-crimson-dark text-warmwhite"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Product Form ───

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  imageData: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  active: boolean;
  sortOrder: string;
  printerNotes: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  image: "",
  imageData: "",
  sizes: [],
  colors: [],
  active: true,
  sortOrder: "0",
  printerNotes: "",
};

function ProductForm({
  token,
  product,
  onSave,
  onCancel,
}: {
  token: string;
  product?: ShopProduct;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductFormData>(() =>
    product
      ? {
          name: product.name,
          description: product.description || "",
          price: (product.price / 100).toFixed(2),
          image: product.image || "",
          imageData: "",
          sizes: (product.sizes as string[]) || [],
          colors: (product.colors as { name: string; hex: string }[]) || [],
          active: product.active,
          sortOrder: String(product.sortOrder),
          printerNotes: product.printerNotes || "",
        }
      : EMPTY_FORM
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sizeInput, setSizeInput] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const fileRef = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((f) => ({ ...f, image: data.path, imageData: data.imageData || "" }));
      }
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  }

  function addSize() {
    const s = sizeInput.trim().toUpperCase();
    if (s && !form.sizes.includes(s)) {
      setForm((f) => ({ ...f, sizes: [...f.sizes, s] }));
    }
    setSizeInput("");
  }

  function removeSize(s: string) {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) }));
  }

  function addColor() {
    const n = colorName.trim();
    if (n && !form.colors.find((c) => c.name === n)) {
      setForm((f) => ({ ...f, colors: [...f.colors, { name: n, hex: colorHex }] }));
    }
    setColorName("");
    setColorHex("#000000");
  }

  function removeColor(name: string) {
    setForm((f) => ({ ...f, colors: f.colors.filter((c) => c.name !== name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, any> = {
        name: form.name,
        description: form.description || null,
        price: Math.round(parseFloat(form.price) * 100),
        image: form.image || null,
        sizes: form.sizes.length > 0 ? form.sizes : null,
        colors: form.colors.length > 0 ? form.colors : null,
        active: form.active,
        sortOrder: parseInt(form.sortOrder) || 0,
        printerNotes: form.printerNotes || null,
      };
      if (form.imageData) {
        body.imageData = form.imageData;
      }

      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (res.ok) {
        onSave();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate/10 border border-slate/20 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading font-bold text-warmwhite text-lg">
          {product ? "Edit Product" : "Add Product"}
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="text-warmwhite/60">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-warmwhite/60 text-sm block mb-1">Name *</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="bg-slate/20 border-slate/30 text-warmwhite"
          />
        </div>
        <div>
          <label className="text-warmwhite/60 text-sm block mb-1">Price (USD) *</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
            className="bg-slate/20 border-slate/30 text-warmwhite"
          />
        </div>
      </div>

      <div>
        <label className="text-warmwhite/60 text-sm block mb-1">Description</label>
        <Input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="bg-slate/20 border-slate/30 text-warmwhite"
        />
      </div>

      {/* Image */}
      <div>
        <label className="text-warmwhite/60 text-sm block mb-1">Image</label>
        <div className="flex items-center gap-3">
          {form.image && (
            <img src={form.image} alt="" className="w-16 h-16 object-cover rounded border border-slate/30" />
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="border-slate/30 text-warmwhite hover:bg-slate/20"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
            {form.image ? "Change" : "Upload"}
          </Button>
          {form.image && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setForm((f) => ({ ...f, image: "" }))}
              className="text-warmwhite/40"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="text-warmwhite/60 text-sm block mb-1">Sizes</label>
        <div className="flex flex-wrap gap-1 mb-2">
          {form.sizes.map((s) => (
            <span
              key={s}
              className="bg-slate/20 text-warmwhite text-xs px-2 py-1 rounded flex items-center gap-1"
            >
              {s}
              <button type="button" onClick={() => removeSize(s)} className="text-warmwhite/40 hover:text-crimson">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder="e.g. S, M, L"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSize(); } }}
            className="bg-slate/20 border-slate/30 text-warmwhite flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={addSize} className="border-slate/30 text-warmwhite">
            Add
          </Button>
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="text-warmwhite/60 text-sm block mb-1">Colors</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.colors.map((c) => (
            <span
              key={c.name}
              className="bg-slate/20 text-warmwhite text-xs px-2 py-1 rounded flex items-center gap-2"
            >
              <span className="w-4 h-4 rounded-full border border-slate/40" style={{ backgroundColor: c.hex }} />
              {c.name}
              <button type="button" onClick={() => removeColor(c.name)} className="text-warmwhite/40 hover:text-crimson">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="Color name"
            className="bg-slate/20 border-slate/30 text-warmwhite flex-1"
          />
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-slate/30 bg-transparent"
          />
          <Button type="button" variant="outline" size="sm" onClick={addColor} className="border-slate/30 text-warmwhite">
            Add
          </Button>
        </div>
      </div>

      {/* Printer Notes */}
      <div>
        <label className="text-warmwhite/60 text-sm block mb-1">Printer Notes</label>
        <textarea
          value={form.printerNotes}
          onChange={(e) => setForm((f) => ({ ...f, printerNotes: e.target.value }))}
          placeholder="e.g. Gildan 18500 Heavy Blend Hoodie — print white ink on dark colors"
          rows={3}
          className="w-full rounded-md bg-slate/20 border border-slate/30 text-warmwhite placeholder:text-warmwhite/40 px-3 py-2 text-sm"
        />
        <p className="text-warmwhite/30 text-xs mt-1">Shirt spec/type, color notes for the printer, etc.</p>
      </div>

      {/* Sort order + active */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-warmwhite/60 text-sm block mb-1">Sort Order</label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            className="bg-slate/20 border-slate/30 text-warmwhite"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-warmwhite text-sm">Active (visible in shop)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="border-slate/30 text-warmwhite">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving || !form.name || !form.price}
          className="bg-crimson hover:bg-crimson-dark text-warmwhite"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

// ─── Product Manager ───

function ProductManager({ token }: { token: string }) {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ShopProduct | null>(null);
  const [adding, setAdding] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products", { headers });
      const data = await res.json();
      if (res.ok) setProducts(data.products);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE", headers });
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch {
      console.error("Failed to delete");
    }
  }

  async function toggleActive(product: ShopProduct) {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ active: !product.active }),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((p) => p.map((x) => (x.id === data.product.id ? data.product : x)));
      }
    } catch {
      console.error("Failed to toggle");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-warmwhite/40 animate-spin" />
      </div>
    );
  }

  if (adding) {
    return (
      <ProductForm
        token={token}
        onSave={() => { setAdding(false); fetchProducts(); }}
        onCancel={() => setAdding(false)}
      />
    );
  }

  if (editing) {
    return (
      <ProductForm
        token={token}
        product={editing}
        onSave={() => { setEditing(null); fetchProducts(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-warmwhite/50 text-sm">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        <Button onClick={() => setAdding(true)} className="bg-crimson hover:bg-crimson-dark text-warmwhite">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className={`bg-slate/10 border rounded-lg p-4 flex items-center gap-4 ${
              p.active ? "border-slate/20" : "border-slate/10 opacity-60"
            }`}
          >
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded border border-slate/30" />
            ) : (
              <div className="w-14 h-14 bg-slate/20 rounded flex items-center justify-center">
                <Package className="h-6 w-6 text-warmwhite/30" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-warmwhite font-heading font-semibold truncate">{p.name}</h4>
                {!p.active && (
                  <span className="text-xs bg-warmwhite/10 text-warmwhite/40 px-2 py-0.5 rounded">Hidden</span>
                )}
              </div>
              <p className="text-crimson font-bold">{formatPrice(p.price)}</p>
              <div className="flex gap-2 text-warmwhite/40 text-xs mt-1">
                {(p.sizes as string[] | null)?.length ? (
                  <span>{(p.sizes as string[]).length} sizes</span>
                ) : null}
                {(p.colors as any[] | null)?.length ? (
                  <span>{(p.colors as any[]).length} colors</span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleActive(p)}
                className="text-warmwhite/50 hover:text-warmwhite"
                title={p.active ? "Hide from shop" : "Show in shop"}
              >
                {p.active ? "Hide" : "Show"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(p)}
                className="text-warmwhite/50 hover:text-warmwhite"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(p.id)}
                className="text-warmwhite/50 hover:text-crimson"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Order Dashboard (existing) ───

function OrderDashboard({ token }: { token: string }) {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [recoverSessionId, setRecoverSessionId] = useState("");
  const [recovering, setRecovering] = useState(false);
  const [recoverMsg, setRecoverMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders", { headers });
      const data = await res.json();
      if (res.ok) setOrders(data.orders);
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
      }
    } catch {
      console.error("Failed to update status");
    }
  }

  async function handleRecoverOrder() {
    const sid = recoverSessionId.trim();
    if (!sid) return;
    setRecovering(true);
    setRecoverMsg(null);
    try {
      const res = await fetch(`/api/shop/order-from-session?session_id=${encodeURIComponent(sid)}`);
      if (res.ok) {
        setRecoverMsg({ type: "success", text: "Order recovered successfully." });
        setRecoverSessionId("");
        fetchOrders();
      } else {
        const data = await res.json();
        setRecoverMsg({ type: "error", text: data.error || "Could not recover order." });
      }
    } catch {
      setRecoverMsg({ type: "error", text: "Network error." });
    } finally {
      setRecovering(false);
    }
  }

  async function handleSyncFromStripe() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/admin/sync-orders-from-stripe", { method: "POST", headers });
      const data = await res.json();
      if (res.ok) {
        setSyncMsg({ type: "success", text: `Imported ${data.imported} new order${data.imported !== 1 ? "s" : ""} from Stripe. (${data.skipped} already recorded)` });
        fetchOrders();
      } else {
        setSyncMsg({ type: "error", text: data.error || "Sync failed." });
      }
    } catch {
      setSyncMsg({ type: "error", text: "Network error." });
    } finally {
      setSyncing(false);
    }
  }

  function handleExport() {
    window.open(`/api/admin/orders/export?_t=${token}`, "_blank");
    fetch("/api/admin/orders/export", { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders.csv";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(console.error);
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  function parseItems(items: any): Array<{ name: string; quantity: number; size?: string; color?: string }> {
    try {
      const parsed = typeof items === "string" ? JSON.parse(items) : items;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-warmwhite/40 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Sync from Stripe */}
      <div className="bg-slate/10 border border-slate/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-warmwhite text-sm font-semibold">Sync orders from Stripe</p>
            <p className="text-warmwhite/50 text-xs mt-0.5">Imports all completed payments that aren't recorded yet</p>
          </div>
          <Button
            onClick={handleSyncFromStripe}
            disabled={syncing}
            className="bg-risegreen hover:bg-risegreen/90 text-warmwhite text-sm"
            data-testid="button-sync-stripe"
          >
            {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            {syncing ? "Syncing…" : "Sync from Stripe"}
          </Button>
        </div>
        {syncMsg && (
          <p className={`text-sm mt-2 ${syncMsg.type === "success" ? "text-risegreen" : "text-red-400"}`} data-testid="text-sync-msg">
            {syncMsg.text}
          </p>
        )}
      </div>

      {/* Recover missing order by session ID */}
      <div className="bg-slate/10 border border-slate/20 rounded-lg p-4 mb-6">
        <p className="text-warmwhite/70 text-sm font-medium mb-3">Recover a specific order by Stripe Session ID</p>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            value={recoverSessionId}
            onChange={(e) => setRecoverSessionId(e.target.value)}
            placeholder="cs_live_..."
            className="flex-1 min-w-0 bg-night border border-slate/30 rounded-md px-3 py-2 text-warmwhite text-sm placeholder:text-warmwhite/30 focus:outline-none focus:border-crimson"
            data-testid="input-recover-session"
          />
          <Button
            onClick={handleRecoverOrder}
            disabled={recovering || !recoverSessionId.trim()}
            className="bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson text-sm"
            data-testid="button-recover-order"
          >
            {recovering ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Recover
          </Button>
        </div>
        {recoverMsg && (
          <p className={`text-sm mt-2 ${recoverMsg.type === "success" ? "text-risegreen" : "text-red-400"}`} data-testid="text-recover-msg">
            {recoverMsg.text}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end mb-6">
        <Button
          onClick={handleExport}
          variant="outline"
          className="border-slate/30 text-warmwhite hover:bg-slate/20"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate/10 border border-slate/20 rounded-lg p-4">
          <p className="text-warmwhite/50 text-sm">Total Orders</p>
          <p className="text-warmwhite font-bold text-2xl">{orders.length}</p>
        </div>
        <div className="bg-slate/10 border border-slate/20 rounded-lg p-4">
          <p className="text-warmwhite/50 text-sm">Revenue</p>
          <p className="text-warmwhite font-bold text-2xl">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-slate/10 border border-slate/20 rounded-lg p-4">
          <p className="text-warmwhite/50 text-sm">Pending</p>
          <p className="text-warmwhite font-bold text-2xl">
            {orders.filter((o) => o.status === "pending" || o.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-slate/10 border border-slate/20 rounded-lg p-4">
          <p className="text-warmwhite/50 text-sm">Ready for Pickup</p>
          <p className="text-warmwhite font-bold text-2xl">
            {orders.filter((o) => o.status === "ready").length}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warmwhite/40" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/40"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-slate/20 border-slate/30 text-warmwhite">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-night border-slate/30">
            <SelectItem value="all" className="text-warmwhite">All Statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <SelectItem key={val} value={val} className="text-warmwhite">{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-warmwhite/40 text-center py-12">No orders found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const items = parseItems(order.items);
            return (
              <div
                key={order.id}
                className="bg-slate/10 border border-slate/20 rounded-lg p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-warmwhite font-heading font-semibold">
                      {order.customerName}
                    </p>
                    <p className="text-warmwhite/50 text-sm">{order.customerEmail}</p>
                    {order.customerPhone && (
                      <p className="text-warmwhite/50 text-sm">{order.customerPhone}</p>
                    )}
                    <p className="text-warmwhite/30 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {" "}&middot;{" "}
                      {order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-warmwhite font-bold">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <Select
                      value={order.status}
                      onValueChange={(val) => updateStatus(order.id, val as OrderStatus)}
                    >
                      <SelectTrigger
                        className={`w-40 border-0 text-sm font-medium ${STATUS_COLORS[order.status] || "bg-slate/20 text-warmwhite"}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-night border-slate/30">
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <SelectItem key={val} value={val} className="text-warmwhite">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {items.length > 0 && (
                  <div className="text-warmwhite/60 text-sm">
                    {items.map((item, i) => (
                      <span key={i}>
                        {i > 0 && " \u00b7 "}
                        {item.name} x{item.quantity}
                        {item.size ? ` (${item.size})` : ""}
                        {item.color ? ` [${item.color}]` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page with Tabs ───

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => {
    const stored = sessionStorage.getItem("admin-token");
    return stored || null;
  });
  const [tab, setTab] = useState<"products" | "orders">("products");

  function handleLogin(t: string) {
    sessionStorage.setItem("admin-token", t);
    setToken(t);
  }

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-night">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-integral text-warmwhite text-2xl uppercase tracking-wide">
            Admin Dashboard
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem("admin-token");
              setToken(null);
            }}
            className="text-warmwhite/50 hover:text-warmwhite"
          >
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-slate/10 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "products"
                ? "bg-crimson text-warmwhite"
                : "text-warmwhite/50 hover:text-warmwhite hover:bg-slate/20"
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "orders"
                ? "bg-crimson text-warmwhite"
                : "text-warmwhite/50 hover:text-warmwhite hover:bg-slate/20"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </button>
        </div>

        {tab === "products" ? (
          <ProductManager token={token} />
        ) : (
          <OrderDashboard token={token} />
        )}
      </div>
    </div>
  );
}
