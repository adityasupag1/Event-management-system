import { Link } from 'react-router-dom';
import { Icon } from '../ui/Primitives';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-ink-soft mb-2" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <Icon name="chevron_right" className="text-[16px] text-ink-mute" />}
            {last || !item.to ? (
              <span className={last ? 'text-ink font-medium' : ''}>{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:text-ink transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
