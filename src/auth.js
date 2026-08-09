// auth.js — simple localStorage-based identity, no real backend

const USER_KEY = 'findit_user';

export function getCurrentUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function login({ name, contact }) {
    const user = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        contact: contact.trim(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

export function logout() {
    localStorage.removeItem(USER_KEY);
}