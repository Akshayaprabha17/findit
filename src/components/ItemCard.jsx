// ItemCard.jsx — card shown in the feed
const STATUS_STYLES = {
  open: 'bg-emerald-50 text-emerald-700',
  claimed: 'bg-amber-50 text-amber-700',
  resolved: 'bg-slate-100 text-slate-500',
};

const CATEGORY_ICONS = {
  'ID Card': '🪪',
  Electronics: '💻',
  Keys: '🔑',
  Bag: '🎒',
  Wallet: '👛',
  Documents: '📄',
  Other: '📦',
};

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return d;
  }
}

export default function ItemCard({ item, onClick }) {
  const isLost = item.type === 'lost';

  return (
    <div
      onClick={onClick}
      className="card-hover bg-white rounded-2xl shadow-sm border border-slate-100 cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Top color band */}
      <div className={`h-1.5 w-full ${isLost ? 'bg-rose-400' : 'bg-emerald-400'}`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl flex-shrink-0">{CATEGORY_ICONS[item.category] || '📦'}</span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-800 truncate leading-tight">{item.title}</h3>
              <span className="text-xs text-slate-400">{item.category}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isLost ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isLost ? 'Lost' : 'Found'}
            </span>
            {item.status !== 'open' && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[item.status]}`}>
                {item.status === 'claimed' ? 'Claimed' : 'Resolved'}
              </span>
            )}
          </div>
        </div>

        {/* Image if present */}
        {item.image && (
          <div className="mb-3 rounded-xl overflow-hidden h-36 bg-slate-100">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">{item.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate max-w-[140px]">{item.location}</span>
          </span>
          <span>{formatDate(item.date)}</span>
        </div>
      </div>
    </div>
  );
}
