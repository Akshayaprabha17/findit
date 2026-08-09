// MatchBanner.jsx — shown after posting, if possible matches exist

export default function MatchBanner({ matches, onViewItem, onDismiss }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="fade-in mb-4 mt-2 rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <p className="text-sm font-semibold text-blue-800">
            {matches.length === 1
              ? 'This might match something already posted.'
              : `${matches.length} items look like they could be related.`}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-blue-400 hover:text-blue-600 transition text-lg leading-none mt-0.5"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {matches.map(({ item, score, reasons }) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-blue-100 p-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{item.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{reasons.slice(0, 2).join(' · ')}</p>
            </div>
            <button
              onClick={() => onViewItem(item.id)}
              className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
