import { useState, useMemo } from 'react';
import { CATEGORIES } from '../storage';
import ItemCard from './ItemCard';
import MatchBanner from './MatchBanner';

const CATEGORY_ICONS = {
  'ID Card': '🪪',
  Electronics: '💻',
  Keys: '🔑',
  Bag: '🎒',
  Wallet: '👛',
  Documents: '📄',
  Other: '📦',
};

export default function Feed({
  items,
  onViewItem,
  onReportLost,
  onReportFound,
  postMatches,
  onDismissMatches,
  onViewMatchedItem,
}) {
  const [activeTab, setActiveTab] = useState('lost');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (item.type !== activeTab) return false;
      if (filterCategory && item.category !== filterCategory) return false;
      if (
        filterLocation &&
        !item.location.toLowerCase().includes(filterLocation.toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, activeTab, filterCategory, filterLocation]);

  const lostCount = items.filter((i) => i.type === 'lost' && i.status === 'open').length;
  const foundCount = items.filter((i) => i.type === 'found' && i.status === 'open').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;

  return (
    <div>

      {/* Post-submit match banner */}
      {postMatches.length > 0 && (
        <MatchBanner
          matches={postMatches}
          onViewItem={onViewMatchedItem}
          onDismiss={onDismissMatches}
        />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-0 mt-2 mb-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('lost')}
          className={`relative px-5 py-3 text-sm font-medium transition-colors ${activeTab === 'lost'
            ? 'text-rose-600 tab-active'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          Lost
          {lostCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold bg-rose-100 text-rose-600">
              {lostCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('found')}
          className={`relative px-5 py-3 text-sm font-medium transition-colors ${activeTab === 'found'
            ? 'text-emerald-600 tab-active'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          Found
          {foundCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600">
              {foundCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_ICONS[c]} {c}
            </option>
          ))}
        </select>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <input
            type="text"
            placeholder="Filter by location…"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition w-48"
          />
        </div>
        {(filterCategory || filterLocation) && (
          <button
            onClick={() => { setFilterCategory(''); setFilterLocation(''); }}
            className="text-sm text-slate-400 hover:text-slate-600 px-2 transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <EmptyState tab={activeTab} onReport={activeTab === 'lost' ? onReportLost : onReportFound} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => onViewItem(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab, onReport }) {
  return (
    <div className="text-center py-16 text-slate-400">
      <div className="text-5xl mb-3">{tab === 'lost' ? '😕' : '📦'}</div>
      <p className="text-base font-medium text-slate-500 mb-1">
        {tab === 'lost' ? 'No lost items here yet.' : 'Nothing found so far.'}
      </p>
      <p className="text-sm mb-4">
        {tab === 'lost' ? 'Lost something? Post it here.' : 'Found something? Let others know.'}
      </p>
      <button
        onClick={onReport}
        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${tab === 'lost' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
      >
        {tab === 'lost' ? 'Report a lost item' : 'Report a found item'}
      </button>
    </div>
  );
}
