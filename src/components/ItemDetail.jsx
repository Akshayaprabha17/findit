import { useState } from 'react';
import { findMatches } from '../matching';
import ItemCard from './ItemCard';

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
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

// Claim flow — ask questions, then reveal contact
function ClaimFlow({ item, onClaim, onClose }) {
  const [answers, setAnswers] = useState(
    item.claimQuestions.map(() => '')
  );
  const [step, setStep] = useState('questions'); // 'questions' | 'revealed'
  const [claimerName, setClaimerName] = useState('');
  const [claimerContact, setClaimerContact] = useState('');
  const [errs, setErrs] = useState({});

  const handleReveal = () => {
    const newErrs = {};
    if (!claimerName.trim()) newErrs.claimerName = 'Your name?';
    if (!claimerContact.trim()) newErrs.claimerContact = 'Your phone or email?';
    if (item.claimQuestions.some((_, i) => !answers[i].trim())) {
      newErrs.answers = 'Answer all questions first.';
    }
    if (Object.keys(newErrs).length > 0) {
      setErrs(newErrs);
      return;
    }
    onClaim({ claimerName, claimerContact, answers });
    setStep('revealed');
  };

  if (step === 'revealed') {
    return (
      <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm font-semibold text-emerald-800 mb-2">Here's how to reach them</p>
        <p className="text-sm text-slate-700 font-medium">{item.contactName}</p>
        <p className="text-sm text-slate-600 mb-3">{item.contactInfo}</p>

        <div className="border-t border-emerald-100 pt-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1.5">Their answers, for reference</p>
          {item.claimQuestions.map((q, i) => (
            <p key={i} className="text-xs text-slate-600 mb-1">
              <span className="text-slate-400">{q}</span> — {answers[i]}
            </p>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-3">
          Check their answers make sense before meeting up.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <p className="text-sm font-semibold text-slate-700 mb-1">Before we show you the contact</p>
      <p className="text-xs text-slate-400 mb-4">
        Answer {item.claimQuestions.length > 1 ? 'these questions' : 'this question'} from the finder. If it's a match, they'll confirm with you.
      </p>

      {/* Claimer info */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Your name</label>
          <input
            type="text"
            placeholder="Your name"
            value={claimerName}
            onChange={(e) => { setClaimerName(e.target.value); setErrs(v => ({ ...v, claimerName: '' })); }}
            className={`w-full text-sm border rounded-lg px-3 py-2 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:border-blue-400 transition ${errs.claimerName ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-300'}`}
          />
          {errs.claimerName && <p className="text-xs text-rose-500 mt-1">{errs.claimerName}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Your phone or email</label>
          <input
            type="text"
            placeholder="So they can contact you"
            value={claimerContact}
            onChange={(e) => { setClaimerContact(e.target.value); setErrs(v => ({ ...v, claimerContact: '' })); }}
            className={`w-full text-sm border rounded-lg px-3 py-2 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:border-blue-400 transition ${errs.claimerContact ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-300'}`}
          />
          {errs.claimerContact && <p className="text-xs text-rose-500 mt-1">{errs.claimerContact}</p>}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {item.claimQuestions.map((q, i) => (
          <div key={i}>
            <label className="block text-xs font-medium text-slate-600 mb-1">{q}</label>
            <input
              type="text"
              placeholder="Your answer…"
              value={answers[i]}
              onChange={(e) => {
                const next = [...answers];
                next[i] = e.target.value;
                setAnswers(next);
                setErrs((v) => ({ ...v, answers: '' }));
              }}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
          </div>
        ))}
      </div>
      {errs.answers && <p className="text-xs text-rose-500 mt-2">{errs.answers}</p>}

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleReveal}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          This is mine — show contact
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ItemDetail({ item, allItems, user, onBack, onMarkResolved, onClaim, onViewItem }) {
  const [showClaimFlow, setShowClaimFlow] = useState(false);
  const isLost = item.type === 'lost';
  const isOwner = user && item.ownerId === user.id;

  // Find related items for this item
  const relatedMatches = findMatches(item, allItems);

  const handleClaim = (claimData) => {
    onClaim(item.id, claimData);
  };

  const canClaim = item.type === 'found' && item.status === 'open';

  return (
    <div className="slide-up max-w-xl mx-auto">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to list
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Color band */}
        <div className={`h-1.5 ${isLost ? 'bg-rose-400' : 'bg-emerald-400'}`} />

        <div className="p-5">
          {/* Type + status badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isLost ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isLost ? 'Lost' : 'Found'}
            </span>
            {item.status === 'open' && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block pulse-dot" />
                Open
              </span>
            )}
            {item.status === 'claimed' && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">Claimed</span>
            )}
            {item.status === 'resolved' && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">Resolved</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-slate-800 mb-1 leading-tight">{item.title}</h1>

          {/* Category icon + name */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span className="text-lg">{CATEGORY_ICONS[item.category] || '📦'}</span>
            <span>{item.category}</span>
            {item.nameOnIt && (
              <>
                <span className="text-slate-300">·</span>
                <span>Name: <strong className="text-slate-700">{item.nameOnIt}</strong></span>
              </>
            )}
          </div>

          {/* Image */}
          {item.image && (
            <div className="mb-4 rounded-xl overflow-hidden max-h-64 bg-slate-100">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Description</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5">Location</p>
              <p className="text-sm font-medium text-slate-700">{item.location}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5">Date</p>
              <p className="text-sm font-medium text-slate-700">{formatDate(item.date)}</p>
            </div>
          </div>

          {/* Contact info — shown for lost items; hidden for found until claimed */}
          {isLost && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
              <p className="text-xs text-slate-400 mb-0.5">Posted by</p>
              <p className="text-sm font-semibold text-slate-700">{item.contactName}</p>
              <p className="text-sm text-slate-600">{item.contactInfo}</p>
            </div>
          )}

          {/* "This is mine" claim flow for found items */}
          {canClaim && !showClaimFlow && (
            <button
              onClick={() => setShowClaimFlow(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition mb-3"
            >
              This is mine
            </button>
          )}

          {showClaimFlow && (
            <ClaimFlow
              item={item}
              onClaim={handleClaim}
              onClose={() => setShowClaimFlow(false)}
            />
          )}

          {/* Mark resolved */}
          {item.status === 'open' && isOwner && (
            <button
              onClick={() => onMarkResolved(item.id)}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition border border-slate-200"
            >
              Mark as resolved
            </button>
          )}

          {/* Already claimed / resolved message */}
          {item.status === 'claimed' && item.claimedBy && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
              Claimed by {item.claimedBy.claimerName}. Pending confirmation.
            </div>
          )}
          {item.status === 'resolved' && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500">
              This item has been resolved.
            </div>
          )}
        </div>
      </div>

      {/* Related matches */}
      {relatedMatches.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 px-1">
            {isLost ? 'Found items that might match' : 'Lost items this might be'}
          </p>
          <div className="flex flex-col gap-3">
            {relatedMatches.map(({ item: relItem, reasons }) => (
              <div key={relItem.id}>
                <div className="mb-1 px-1">
                  <p className="text-xs text-blue-500">{reasons.slice(0, 2).join(' · ')}</p>
                </div>
                <ItemCard item={relItem} onClick={() => onViewItem(relItem.id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
