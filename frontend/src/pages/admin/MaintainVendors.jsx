import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api/services';
import { Icon, Chip, StatusBadge } from '../../components/ui/Primitives';
import { CATEGORY_THEME } from '../../utils/theme';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

const CATS = ['Catering', 'Florist', 'Decoration', 'Lighting'];

export default function MaintainVendors() {
  const [vendors, setVendors] = useState([]);
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', businessName: '', email: '', password: '', category: 'Catering' });

  const load = () => adminAPI.users({ role: 'vendor' }).then(setVendors).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = vendors
    .filter((v) => catFilter === 'all' || v.category === catFilter)
    .filter((v) => statusFilter === 'all' || v.status === statusFilter)
    .filter((v) =>
      !search ||
      (v.businessName || v.name || '').toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase())
    );

  const stats = {
    total: vendors.length,
    active: vendors.filter((v) => v.status === 'active').length,
    suspended: vendors.filter((v) => v.status === 'suspended').length,
    pending: vendors.filter((v) => v.status === 'pending').length,
  };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminAPI.updateUser(editing._id, { name: form.name, businessName: form.businessName, email: form.email, category: form.category });
        toast.success('Vendor updated');
      } else {
        await adminAPI.createUser({ ...form, role: 'vendor', name: form.businessName });
        toast.success('Vendor created');
      }
      setShowModal(false); setEditing(null);
      setForm({ name: '', businessName: '', email: '', password: '', category: 'Catering' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const onToggle = async (v) => {
    const newStatus = v.status === 'active' ? 'suspended' : 'active';
    await adminAPI.toggleStatus(v._id, newStatus);
    toast.success(`Vendor ${newStatus}`);
    load();
  };

  const onDelete = async (v) => {
    if (!confirm(`Delete ${v.businessName || v.name}?`)) return;
    await adminAPI.deleteUser(v._id);
    toast.success('Vendor deleted');
    load();
  };

  const onEdit = (v) => {
    setEditing(v);
    setForm({ name: v.name, businessName: v.businessName || v.name, email: v.email, password: '', category: v.category || 'Catering' });
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-admin-blue-light/60 rounded-xl p-6 mb-6 flex flex-wrap justify-between items-start gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Maintain Vendor' }]} />
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Manage Vendors</h1>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', businessName: '', email: '', password: '', category: 'Catering' }); setShowModal(true); }}
          className="btn-primary-admin">
          <Icon name="add" className="text-[20px]" /> Add New Vendor
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-line mb-6">
        <button className="pb-3 font-medium text-sm text-admin-blue border-b-2 border-admin-blue flex items-center gap-2">
          <Icon name="storefront" className="text-[18px]" />Vendor Management
        </button>
        <button className="pb-3 font-medium text-sm text-ink-soft flex items-center gap-2">
          <Icon name="workspaces" className="text-[18px]" />Memberships
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card border-admin-blue p-4">
          <div className="text-xs uppercase tracking-wider text-ink-soft">Total Vendors</div>
          <div className="text-2xl font-bold text-ink mt-1">{stats.total}</div>
        </div>
        <div className="card border-user-green p-4">
          <div className="text-xs uppercase tracking-wider text-ink-soft">Active</div>
          <div className="text-2xl font-bold text-user-green mt-1">{stats.active}</div>
        </div>
        <div className="card border-cat-catering p-4">
          <div className="text-xs uppercase tracking-wider text-ink-soft">Suspended</div>
          <div className="text-2xl font-bold text-cat-catering mt-1">{stats.suspended}</div>
        </div>
        <div className="card border-vendor-yellow-dark p-4">
          <div className="text-xs uppercase tracking-wider text-ink-soft">Pending</div>
          <div className="text-2xl font-bold text-vendor-yellow-dark mt-1">{stats.pending}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="input-icon-wrap flex-1 min-w-[200px] max-w-sm">
          <Icon name="search" className="input-icon" />
          <input className="input" placeholder="Search vendors..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setCatFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${catFilter === 'all' ? 'bg-admin-blue text-white' : 'bg-gray-100 text-ink-soft'}`}>
          All
        </button>
        {CATS.map((c) => {
          const t = CATEGORY_THEME[c];
          return (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                catFilter === c ? `bg-${t.light} text-${t.color}` : 'bg-gray-100 text-ink-soft'
              }`}>{c}</button>
          );
        })}
        <div className="w-px h-6 bg-line mx-1" />
        <button onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusFilter === 'active' ? 'bg-user-green text-white' : 'bg-gray-100 text-ink-soft'}`}>
          Active
        </button>
        <button onClick={() => setStatusFilter(statusFilter === 'suspended' ? 'all' : 'suspended')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusFilter === 'suspended' ? 'bg-cat-catering text-white' : 'bg-gray-100 text-ink-soft'}`}>
          Suspended
        </button>
      </div>

      {/* Table */}
      <div className="card border-admin-blue p-0 overflow-hidden">
        <table className="hidden md:table w-full">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-ink-soft border-b border-line">
              <th className="text-left py-3 px-5">Vendor ID</th>
              <th className="text-left py-3 px-3">Name</th>
              <th className="text-left py-3 px-3">Category</th>
              <th className="text-left py-3 px-3">Email</th>
              <th className="text-left py-3 px-3">Membership</th>
              <th className="text-left py-3 px-3">Status</th>
              <th className="text-left py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v._id} className="border-b border-line table-row-hover">
                <td className="py-4 px-5 text-admin-blue font-medium text-sm">{v.userId}</td>
                <td className="py-4 px-3 font-medium text-ink text-sm">{v.businessName || v.name}</td>
                <td className="py-4 px-3">{v.category && <Chip category={v.category} />}</td>
                <td className="py-4 px-3 text-sm text-ink-soft">{v.email}</td>
                <td className="py-4 px-3">
                  <span className="border border-line text-xs px-2 py-0.5 rounded">
                    {v.membership?.plan || '—'}
                  </span>
                </td>
                <td className="py-4 px-3"><StatusBadge status={v.status} /></td>
                <td className="py-4 px-3">
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(v)} className="text-admin-blue p-2 hover:bg-admin-blue-light rounded">
                      <Icon name="edit" className="text-[18px]" />
                    </button>
                    <button onClick={() => onToggle(v)} className="text-vendor-yellow-dark p-2 hover:bg-vendor-yellow-light rounded">
                      <Icon name="shield" className="text-[18px]" />
                    </button>
                    <button onClick={() => onDelete(v)} className="text-cat-catering p-2 hover:bg-cat-catering-light rounded">
                      <Icon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="md:hidden divide-y divide-line">
          {filtered.map((v) => (
            <div key={v._id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-admin-blue text-sm font-medium">{v.userId}</div>
                  <div className="font-semibold text-ink">{v.businessName || v.name}</div>
                  <div className="text-xs text-ink-soft">{v.email}</div>
                  {v.category && <div className="mt-2"><Chip category={v.category} /></div>}
                </div>
                <StatusBadge status={v.status} />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => onEdit(v)} className="btn-outline text-xs">Edit</button>
                <button onClick={() => onToggle(v)} className="btn-outline text-xs">Toggle</button>
                <button onClick={() => onDelete(v)} className="text-cat-catering text-xs px-3 py-2">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
          onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl w-full max-w-md shadow-card-hover card border-admin-blue animate-fade-slide-up">
            <form onSubmit={onSave} className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-ink">{editing ? 'Edit Vendor' : 'Add New Vendor'}</h2>
              <div>
                <label className="label">Business Name</label>
                <input className="input" required value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              {!editing && (
                <div>
                  <label className="label">Password</label>
                  <input type="password" className="input" required minLength={6} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
              )}
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary-admin">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
