import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { requestAPI } from '../../api/services';
import { Icon, StatusBadge } from '../../components/ui/Primitives';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

export default function CustomerRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = () => requestAPI.list().then(setRequests).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await requestAPI.update(id, { status }); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  const filtered = requests
    .filter((r) => filter === 'all' || r.status === filter)
    .filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase()));

  const newCount = requests.filter((r) => r.status === 'new').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/vendor/dashboard' }, { label: 'Request Items' }]} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-3">
          Customer Requests
          {newCount > 0 && (
            <span className="bg-cat-catering text-white text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center">
              {newCount}
            </span>
          )}
        </h1>
        <p className="text-sm text-ink-soft mt-1">Items your customers want that aren't in your catalog yet</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="input-icon-wrap flex-1 min-w-[200px] max-w-md">
          <Icon name="search" className="input-icon" />
          <input className="input" placeholder="Search requests..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { k: 'all', l: 'All' },
            { k: 'new', l: 'New' },
            { k: 'in_progress', l: 'In Progress' },
            { k: 'fulfilled', l: 'Fulfilled' },
            { k: 'rejected', l: 'Rejected' },
          ].map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                filter === f.k ? 'bg-vendor-yellow-dark text-white' : 'bg-gray-100 text-ink-soft'
              }`}>{f.l}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card border-vendor-yellow-dark p-12 text-center">
          <Icon name="inbox" className="text-[56px] text-ink-mute mb-2" />
          <p className="text-ink-soft">No customer requests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <article key={r._id} className="card border-vendor-yellow-dark p-5">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-vendor-yellow-light text-vendor-yellow-dark font-semibold flex items-center justify-center">
                  {r.title?.[0]?.toUpperCase() || '?'}
                </div>
                <StatusBadge status={r.status} />
              </div>
              <h3 className="font-semibold text-ink mb-1">{r.title}</h3>
              <p className="text-xs text-ink-soft mb-2">Requested by {r.requester?.name || 'Customer'}</p>
              {r.requestedByCount > 1 && (
                <div className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-ink-soft mb-3">
                  <Icon name="group" className="text-[14px]" />
                  Requested by {r.requestedByCount} users
                </div>
              )}
              <p className="text-sm text-ink line-clamp-3 mb-4 border-t border-line pt-3">{r.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-mute">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
                {r.status !== 'fulfilled' && r.status !== 'rejected' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(r._id, 'rejected')} className="text-cat-catering font-medium text-sm">Reject</button>
                    <button onClick={() => updateStatus(r._id, r.status === 'new' ? 'in_progress' : 'fulfilled')}
                      className="btn-primary-vendor text-sm py-2 px-3">
                      {r.status === 'new' ? 'Add to Catalog' : 'Update'}
                    </button>
                  </div>
                )}
                {r.status === 'fulfilled' && (
                  <span className="text-sm text-user-green flex items-center gap-1">
                    <Icon name="check_circle" className="text-[18px]" /> Added to Catalog
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
