import { Link } from 'react-router-dom';
import { Logo } from '../ui/Primitives';

export default function Footer() {
  return (
    <footer className="bg-admin-blue-light/40 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-2">
          <Logo />
          <p className="text-sm text-ink-soft mt-3">Plan. Connect. Celebrate.</p>
          <p className="text-xs text-ink-mute mt-4">© 2024 EventMS. All rights reserved.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link to="#" className="hover:text-admin-blue">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-admin-blue">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-admin-blue">Cookie Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link to="/contact" className="hover:text-admin-blue">Support</Link></li>
            <li><Link to="#" className="hover:text-admin-blue">Careers</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
