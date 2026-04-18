import { useState } from 'react';
import toast from 'react-hot-toast';
import { Icon } from '../../components/ui/Primitives';
import PublicPageShell from './PublicPageShell';
import { getColor } from '../../utils/theme';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    toast.success('Thanks — we will get back to you shortly.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <PublicPageShell heroClassName="flex-1">
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-cat-catering-light/50 via-white to-admin-blue-light/40" />
        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-sm font-semibold text-cat-catering uppercase tracking-wide mb-2">Contact</p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink font-display mb-4">
            We are here to help
          </h1>
          <p className="text-lg text-ink-soft">
            Questions about accounts, vendors, or partnerships? Send a note and our team will respond by email.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="card border-line p-5">
            <div className="flex items-center gap-3 text-ink mb-2">
              <Icon name="mail" className="text-[22px]" style={{ color: getColor('admin-blue') }} />
              <span className="font-semibold text-sm">Email</span>
            </div>
            <a href="mailto:support@eventms.com" className="text-sm text-admin-blue hover:underline">
              support@eventms.com
            </a>
          </div>
          <div className="card border-line p-5">
            <div className="flex items-center gap-3 text-ink mb-2">
              <Icon name="schedule" className="text-[22px]" style={{ color: getColor('user-green') }} />
              <span className="font-semibold text-sm">Hours</span>
            </div>
            <p className="text-sm text-ink-soft">Monday–Friday, 9:00–18:00 IST</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 card border-admin-blue p-6 space-y-4">
          <h2 className="text-lg font-semibold text-ink mb-2">Send a message</h2>
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Subject</label>
            <input
              className="input"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              className="input min-h-[140px]"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us more…"
            />
          </div>
          <button type="submit" disabled={sending} className="btn-primary-admin w-full sm:w-auto">
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </section>
    </PublicPageShell>
  );
}
