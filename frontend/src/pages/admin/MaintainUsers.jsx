import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api/services';
import { Icon, StatusBadge } from '../../components/ui/Primitives';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import { getMembershipDisplayLabel } from '../../utils/membership';
import { COMPLIMENTARY_MEMBERSHIP_PLANS, isDbMembershipPlan } from '../../constants/membershipPlans';

export default function MaintainUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = () => ({
    name: '',
    email: '',
    password: '',
    role: 'user',
    membershipPlan: '6 month',
  });
  const [form, setForm] = useState(emptyForm);

  const load = () => adminAPI.users({ role: 'user' }).then(setUsers).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = users
    .filter((u) => filter === 'all' || u.status === filter)
    .filter((u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminAPI.updateUser(editing._id, {
          name: form.name,
          email: form.email,
          // JSON.stringify drops `undefined`; backend needs this key to persist membership.
          membershipPlan: form.membershipPlan ?? '6 month',
        });
        toast.success('User updated');
      } else {
        await adminAPI.createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'user',
          membershipPlan: form.membershipPlan ?? '6 month',
        });
        toast.success('User created');
      }
      setShowModal(false);
      setEditing(null);
      setForm(emptyForm());
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const onToggle = async (u) => {
    const newStatus = u.status === 'active' ? 'suspended' : 'active';
    await adminAPI.toggleStatus(u._id, newStatus);
    toast.success(`User ${newStatus}`);
    load();
  };

  const onDelete = async (u) => {
    if (!confirm(`Delete ${u.name}?`)) return;
    await adminAPI.deleteUser(u._id);
    toast.success('User deleted');
    load();
  };

  const onEdit = (u) => {
    setEditing(u);
    let plan = '6 month';
    if (isDbMembershipPlan(u.membership?.plan)) plan = u.membership.plan;
    else if (u.membership?.plan === 'promo' && u.membership?.durationMonths === 12) plan = '1 year';
    else if (u.membership?.plan === 'promo' && u.membership?.durationMonths === 24) plan = '2 years';
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      membershipPlan: plan,
    });
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-admin-blue-light/60 rounded-xl p-6 mb-6 flex flex-wrap justify-between items-start gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Home', to: '/admin/dashboard' }, { label: 'Maintain User' }]} />
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Manage Users</h1>
        </div>
        <button onClick={() => { setEditing(null); setForm(emptyForm()); setShowModal(true); }}
          className="btn-primary-admin">
          <Icon name="add" className="text-[20px]" /> Add New User
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-line mb-6">
        <button className="pb-3 font-medium text-sm text-admin-blue border-b-2 border-admin-blue">User Management</button>
        <button className="pb-3 font-medium text-sm text-ink-soft">Memberships</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="input-icon-wrap flex-1 min-w-[200px] max-w-sm">
          <Icon name="search" className="input-icon" />
          <input className="input" placeholder="Search by name..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="text-sm text-ink-soft">Filter:</div>
        <div className="flex gap-2">
          {[
            { k: 'all', l: 'All' },
            { k: 'active', l: 'Active' },
            { k: 'inactive', l: 'Inactive' },
            { k: 'suspended', l: 'Suspended' },
          ].map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                filter === f.k ? 'bg-admin-blue text-white' : 'bg-gray-100 text-ink-soft'
              }`}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card border-admin-blue p-0 overflow-hidden">
        <table className="hidden md:table w-full">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-ink-soft border-b border-line">
              <th className="text-left py-3 px-5">User ID</th>
              <th className="text-left py-3 px-3">Name</th>
              <th className="text-left py-3 px-3">Email</th>
              <th className="text-left py-3 px-3">Membership plan</th>
              <th className="text-left py-3 px-3">Status</th>
              <th className="text-left py-3 px-3">Joined</th>
              <th className="text-left py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id} className="border-b border-line table-row-hover">
                <td className="py-4 px-5 text-admin-blue font-medium text-sm">{u.userId}</td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-admin-blue text-white flex items-center justify-center text-xs font-semibold">
                      {u.name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <span className="text-sm text-ink">{u.name}</span>
                  </div>
                </td>
                <td className="py-4 px-3 text-sm text-ink-soft">{u.email}</td>
                <td className="py-4 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    isDbMembershipPlan(u.membership?.plan) ? 'bg-user-green-light text-user-green-dark' : 'bg-gray-100 text-ink-soft'
                  }`}>
                    {getMembershipDisplayLabel(u)}
                  </span>
                  {u.membership?.expiresAt && (
                    <div className="text-[10px] text-ink-soft mt-0.5">
                      Until {new Date(u.membership.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="py-4 px-3"><StatusBadge status={u.status} /></td>
                <td className="py-4 px-3 text-sm text-ink-soft">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                <td className="py-4 px-3">
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(u)} title="Edit"
                      className="text-admin-blue p-2 hover:bg-admin-blue-light rounded">
                      <Icon name="edit" className="text-[18px]" />
                    </button>
                    <button onClick={() => onToggle(u)} title="Toggle status"
                      className="text-vendor-yellow-dark p-2 hover:bg-vendor-yellow-light rounded">
                      <Icon name="shield" className="text-[18px]" />
                    </button>
                    <button onClick={() => onDelete(u)} title="Delete"
                      className="text-cat-catering p-2 hover:bg-cat-catering-light rounded">
                      <Icon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="md:hidden divide-y divide-line">
          {filtered.map((u) => (
            <div key={u._id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-admin-blue text-sm font-medium">{u.userId}</div>
                  <div className="font-semibold text-ink">{u.name}</div>
                  <div className="text-xs text-ink-soft">{u.email}</div>
                  <div className="text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      isDbMembershipPlan(u.membership?.plan) ? 'bg-user-green-light text-user-green-dark' : 'bg-gray-100 text-ink-soft'
                    }`}>
                      {getMembershipDisplayLabel(u)}
                    </span>
                  </div>
                </div>
                <StatusBadge status={u.status} />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => onEdit(u)} className="btn-outline text-xs">Edit</button>
                <button onClick={() => onToggle(u)} className="btn-outline text-xs">Toggle</button>
                <button onClick={() => onDelete(u)} className="text-cat-catering text-xs px-3 py-2">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 text-sm text-ink-soft border-t border-line flex items-center justify-between">
          <span>Showing {filtered.length} of {users.length} users</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
          onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-card-hover card border-admin-blue animate-fade-slide-up">
            <form onSubmit={onSave} className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-ink">{editing ? 'Edit User' : 'Add New User'}</h2>
              <div>
                <label className="label">Name</label>
                <input className="input" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
                <p className="label mb-2">Membership plan</p>
                <p className="text-xs text-ink-soft mb-3">
                  {editing
                    ? 'Change the tier and save. Expiry is recalculated from today for the length you pick.'
                    : 'Sets how long complimentary access stays active for this user.'}
                </p>
                <div className="space-y-2">
                  {COMPLIMENTARY_MEMBERSHIP_PLANS.map((p) => (
                    <label
                      key={p.dbPlan}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        form.membershipPlan === p.dbPlan
                          ? 'border-admin-blue bg-admin-blue-light/40'
                          : 'border-line hover:border-ink-mute'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        className="mt-1 accent-admin-blue"
                        checked={form.membershipPlan === p.dbPlan}
                        onChange={() => setForm({ ...form, membershipPlan: p.dbPlan })}
                      />
                      <div>
                        <div className="text-sm font-semibold text-ink">{p.label}</div>
                        <div className="text-xs text-ink-soft">{p.headline}</div>
                      </div>
                    </label>
                  ))}
                </div>
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
