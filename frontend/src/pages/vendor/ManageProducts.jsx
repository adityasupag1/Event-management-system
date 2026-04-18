import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../api/services';
import { Icon, StatusBadge } from '../../components/ui/Primitives';
import { fmtINR } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function ManageProducts({ addMode = false }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const formRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', stock: 10, image: '' });

  const load = () => productAPI.mine().then(setProducts).catch(() => {});
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (addMode && formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [addMode]);

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', stock: 10, image: '' });
    setEditing(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) {
        await productAPI.update(editing, payload);
        toast.success('Product updated');
      } else {
        await productAPI.create(payload);
        toast.success('Product added');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, price: p.price, description: p.description, stock: p.stock, image: p.image || '' });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await productAPI.remove(id);
    toast.success('Deleted');
    load();
  };

  const filtered = products
    .filter((p) => filter === 'all' || p.status === filter)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-vendor-yellow-light/60 rounded-xl p-6 mb-6 border-l-4 border-vendor-yellow-dark">
        <Breadcrumbs items={[{ label: 'Home', to: '/vendor/dashboard' }, { label: 'Your Items' }]} />
        <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-3">
          Manage Your Products
          <span className="bg-vendor-yellow-light text-vendor-yellow-dark text-sm px-3 py-1 rounded-full border border-vendor-yellow">
            {products.length} Items
          </span>
        </h1>
      </div>

      {/* Add/Edit form */}
      <div ref={formRef} className="card border-vendor-yellow-dark p-6 mb-6">
        <h2 className="text-lg font-semibold text-ink mb-4">
          {editing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input className="input" required placeholder="e.g. Premium Banquet Chair"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Price</label>
              <div className="input-icon-wrap">
                <span className="input-icon text-ink-mute">₹</span>
                <input className="input" type="number" min="0" step="0.01" required placeholder="0.00"
                  value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Stock</label>
              <input className="input" type="number" min="0" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input min-h-[100px]" placeholder="Provide detailed specifications..."
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label">Product Image (optional URL)</label>
            <div className="border-2 border-dashed border-vendor-yellow rounded-lg bg-vendor-yellow-light/40 p-8 text-center hover:bg-vendor-yellow-light transition-colors">
              <Icon name="cloud_upload" className="text-[40px] text-vendor-yellow-dark mx-auto" />
              <div className="font-medium text-vendor-yellow-dark mt-2">Paste image URL below</div>
              <div className="text-xs text-ink-soft mt-1">PNG, JPG, GIF up to 10MB</div>
              <input className="input mt-4" placeholder="https://..."
                value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="mt-4">
              <label className="label">Category (Auto-assigned)</label>
              <div className="input flex items-center gap-2 bg-gray-100">
                <Icon name="lock" className="text-[18px] text-ink-mute" />
                {user?.category || 'Catering'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end gap-3 pt-4 border-t border-line">
            <button type="button" onClick={resetForm} className="btn-outline">Clear Form</button>
            <button type="submit" disabled={loading} className="btn-primary-vendor">
              {loading ? 'Saving…' : (editing ? 'Update Product' : 'Add the Product')}
            </button>
          </div>
        </form>
      </div>

      {/* Products table */}
      <div className="card border-vendor-yellow-dark p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-ink">Your Products</h2>
          <button className="text-admin-blue font-medium text-sm flex items-center gap-1">
            <Icon name="download" className="text-[18px]" /> Export
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="input-icon-wrap flex-1 min-w-[200px]">
            <Icon name="search" className="input-icon" />
            <input className="input" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {[{ k: 'all', l: 'All' }, { k: 'in_stock', l: 'In Stock' }, { k: 'out_of_stock', l: 'Out of Stock' }].map((f) => (
              <button key={f.k} onClick={() => setFilter(f.k)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === f.k ? 'bg-vendor-yellow-light text-vendor-yellow-dark' : 'bg-gray-100 text-ink-soft'
                }`}>{f.l}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-ink-soft">No products yet.</div>
        ) : (
          <>
            <table className="hidden md:table w-full">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-soft border-b border-line">
                  <th className="text-left py-3">Image</th>
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Price</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-line table-row-hover">
                    <td className="py-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {p.image ? <img src={p.image} alt="" className="w-full h-full rounded-lg object-cover" /> : <Icon name="image" className="text-[20px] text-ink-mute" />}
                      </div>
                    </td>
                    <td className="py-3 font-medium text-ink text-sm">{p.name}</td>
                    <td className="py-3 text-user-green font-semibold text-sm">₹{fmtINR(p.price)}</td>
                    <td className="py-3"><StatusBadge status={p.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(p)} className="text-admin-blue p-2 hover:bg-admin-blue-light rounded">
                          <Icon name="edit" className="text-[18px]" />
                        </button>
                        <button onClick={() => onDelete(p._id)} className="text-cat-catering p-2 hover:bg-cat-catering-light rounded">
                          <Icon name="delete" className="text-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="md:hidden space-y-3">
              {filtered.map((p) => (
                <div key={p._id} className="bg-gray-50 rounded-lg p-4 flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="image" className="text-[24px] text-ink-mute" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-ink text-sm">{p.name}</div>
                    <div className="text-user-green font-semibold text-sm">₹{fmtINR(p.price)}</div>
                    <div className="mt-1"><StatusBadge status={p.status} /></div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => onEdit(p)} className="text-admin-blue text-sm">Edit</button>
                      <button onClick={() => onDelete(p._id)} className="text-cat-catering text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
