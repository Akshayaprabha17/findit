// storage.js — localStorage helpers for FindIt

const ITEMS_KEY = 'findit_items';

export const CATEGORIES = [
  'ID Card',
  'Electronics',
  'Keys',
  'Bag',
  'Wallet',
  'Documents',
  'Other',
];

// Seed data — realistic campus items, at least one matching pair
const SEED_ITEMS = [
  {
    id: 'seed-1',
    type: 'lost',
    title: 'Blue backpack',
    category: 'Bag',
    description: 'Dark navy blue Wildcraft backpack with a broken zipper on the front pocket. Has a water bottle holder on the side.',
    location: 'Library, 2nd floor',
    date: '2026-08-05',
    contactName: 'Rohit Sharma',
    contactInfo: 'rohit.s@campus.edu',
    nameOnIt: '',
    image: null,
    status: 'open',
    claimedBy: null,
    createdAt: '2026-08-05T09:10:00Z',
    claimQuestions: [],
  },
  {
    id: 'seed-2',
    type: 'lost',
    title: 'Student ID card',
    category: 'ID Card',
    description: 'My campus ID. Need it urgently for exams.',
    location: 'Cafeteria, ground floor',
    date: '2026-08-06',
    contactName: 'Priya Mehta',
    contactInfo: '9876543210',
    nameOnIt: 'Priya Mehta',
    image: null,
    status: 'open',
    claimedBy: null,
    createdAt: '2026-08-06T11:30:00Z',
    claimQuestions: [],
  },
  {
    id: 'seed-3',
    type: 'found',
    title: 'Found a backpack near reading room',
    category: 'Bag',
    description: 'Dark blue backpack left on a table. Has some textbooks inside and a pencil case.',
    location: 'Library, reading room',
    date: '2026-08-06',
    contactName: 'Aditya Kumar',
    contactInfo: 'aditya.k@campus.edu',
    nameOnIt: '',
    image: null,
    status: 'open',
    claimedBy: null,
    createdAt: '2026-08-06T14:00:00Z',
    claimQuestions: [
      'What colour is the water bottle holder?',
      'Is there anything else inside you can describe?',
    ],
  },
  {
    id: 'seed-4',
    type: 'found',
    title: 'Found ID card — Priya',
    category: 'ID Card',
    description: 'Found a student ID card on the cafeteria table. The photo is of a girl.',
    location: 'Cafeteria',
    date: '2026-08-07',
    contactName: 'Neha Gupta',
    contactInfo: '9123456780',
    nameOnIt: 'Priya Mehta',
    image: null,
    status: 'open',
    claimedBy: null,
    createdAt: '2026-08-07T10:15:00Z',
    claimQuestions: [
      'What is your student roll number?',
    ],
  },
  {
    id: 'seed-5',
    type: 'found',
    title: 'Pair of keys with a red keychain',
    category: 'Keys',
    description: 'Found 3 keys on a red ring keychain. Looks like dorm room and cycle keys. Found near the sports ground.',
    location: 'Sports ground, near entrance',
    date: '2026-08-08',
    contactName: 'Suresh Patel',
    contactInfo: 'suresh.p@campus.edu',
    nameOnIt: '',
    image: null,
    status: 'open',
    claimedBy: null,
    createdAt: '2026-08-08T16:45:00Z',
    claimQuestions: [
      'How many keys are on the ring?',
      'What does the keychain look like?',
    ],
  },
];

export function getAllItems() {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function initStorage() {
  const existing = getAllItems();
  if (!existing) {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(SEED_ITEMS));
    return SEED_ITEMS;
  }
  return existing;
}

export function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function addItem(item) {
  const items = getAllItems() || [];
  items.unshift(item);
  saveItems(items);
  return items;
}

export function updateItem(id, updates) {
  const items = getAllItems() || [];
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return items;
  items[idx] = { ...items[idx], ...updates };
  saveItems(items);
  return items;
}

export function getItemById(id) {
  const items = getAllItems() || [];
  return items.find((i) => i.id === id) || null;
}
