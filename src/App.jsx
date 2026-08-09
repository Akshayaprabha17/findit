import { useState, useEffect, useCallback } from 'react';
import { subscribeToItems, initStorage, addItem, updateItem, CATEGORIES } from './storage';
import { getCurrentUser, login, logout } from './auth';
import LoginPage from './components/LoginPage';
import { findMatches } from './matching';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import ReportForm from './components/ReportForm';
import ItemDetail from './components/ItemDetail';
import Toast from './components/Toast';

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => getCurrentUser());
  const [view, setView] = useState('feed'); // 'feed' | 'report' | 'detail'
  const [reportType, setReportType] = useState('lost'); // 'lost' | 'found'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [toast, setToast] = useState(null);
  const [postMatches, setPostMatches] = useState([]); // matches from last posted item

  // Seed once, then subscribe live to Firestore
  useEffect(() => {
    let unsubscribe;
    (async () => {
      await initStorage(); // seeds only if empty, safe to call every load
      unsubscribe = subscribeToItems((liveItems) => {
        setItems(liveItems);
        setLoading(false);
      });
    })();
    return () => unsubscribe && unsubscribe();
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleOpenReport = (type) => {
    setReportType(type);
    setPostMatches([]);
    setView('report');
  };

  const handleSubmitReport = async (formData) => {
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...formData,
      status: 'open',
      claimedBy: null,
      createdAt: new Date().toISOString(),
      ownerId: user?.id || null,
    };

    // Find matches against current items (before this one is added)
    const matches = findMatches(newItem, items);
    setPostMatches(matches);

    await addItem(newItem);
    // items state updates automatically via the live subscription

    showToast(
      formData.type === 'lost'
        ? "Posted to the Lost list."
        : "Saved. You'll see it in the Found list.",
      'success'
    );
    setView('feed');
  };

  const handleViewItem = (id) => {
    setSelectedItemId(id);
    setView('detail');
  };

  const handleMarkResolved = async (id) => {
    await updateItem(id, { status: 'resolved' });
    showToast('Marked as resolved.', 'success');
    setView('feed');
  };

  const handleClaim = async (itemId, claimData) => {
    await updateItem(itemId, {
      status: 'claimed',
      claimedBy: claimData,
    });
    showToast('Done. Reach out and confirm before meeting up.', 'info');
  };

  const handleBack = () => {
    setPostMatches([]);
    setView('feed');
  };

  const handleLogin = (data) => {
    const loggedInUser = login(data);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setView('feed');
  };

  const selectedItem = selectedItemId ? items.find((i) => i.id === selectedItemId) : null;

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onReportLost={() => handleOpenReport('lost')}
        onReportFound={() => handleOpenReport('found')}
      />

      <main className="max-w-4xl mx-auto px-4 pb-16 pt-4">
        {view === 'feed' && (
          <Feed
            items={items}
            onViewItem={handleViewItem}
            onReportLost={() => handleOpenReport('lost')}
            onReportFound={() => handleOpenReport('found')}
            postMatches={postMatches}
            onDismissMatches={() => setPostMatches([])}
            onViewMatchedItem={handleViewItem}
          />
        )}

        {view === 'report' && (
          <ReportForm
            type={reportType}
            onSubmit={handleSubmitReport}
            onCancel={handleBack}
          />
        )}

        {view === 'detail' && selectedItem && (
          <ItemDetail
            item={selectedItem}
            allItems={items}
            user={user}
            onBack={handleBack}
            onMarkResolved={handleMarkResolved}
            onClaim={handleClaim}
            onViewItem={handleViewItem}
          />
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}