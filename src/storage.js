// storage.js — Firestore-backed storage for FindIt

import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const ITEMS_COLLECTION = 'items';

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
    ownerId: null,
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
    ownerId: null,
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
    ownerId: null,
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
    ownerId: null,
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
    ownerId: null,
  },
];

// One-time: seed Firestore if the collection is empty
export async function initStorage() {
  const snap = await getDocs(collection(db, ITEMS_COLLECTION));
  if (snap.empty) {
    for (const item of SEED_ITEMS) {
      await setDoc(doc(db, ITEMS_COLLECTION, item.id), item);
    }
    return SEED_ITEMS;
  }
  return snap.docs.map((d) => d.data());
}

// Get all items once (not live)
export async function getAllItems() {
  const snap = await getDocs(collection(db, ITEMS_COLLECTION));
  return snap.docs.map((d) => d.data());
}

// Real-time listener — calls callback(items) whenever data changes
export function subscribeToItems(callback) {
  const q = query(collection(db, ITEMS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => d.data());
    callback(items);
  });
}

export async function addItem(item) {
  await setDoc(doc(db, ITEMS_COLLECTION, item.id), item);
}

export async function updateItem(id, updates) {
  await updateDoc(doc(db, ITEMS_COLLECTION, id), updates);
}

export async function getItemById(id) {
  const items = await getAllItems();
  return items.find((i) => i.id === id) || null;
}