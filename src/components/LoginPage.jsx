import { useState } from 'react';

export default function LoginPage({ onLogin }) {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = {};
        if (!name.trim()) errs.name = 'Enter your name.';
        if (!contact.trim()) errs.contact = 'Enter your phone or email.';
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        onLogin({ name, contact });
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-1.5 bg-blue-500" />
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                            🔍
                        </span>
                        <span className="text-lg font-semibold text-slate-800">FindIt</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                        Sign in with your name and contact to post or claim items.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your name</label>
                            <input
                                type="text"
                                placeholder="e.g. Rohit Sharma"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setErrors((v) => ({ ...v, name: '' })); }}
                                className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:ring-2 focus:border-blue-400 transition bg-white text-slate-700 placeholder-slate-400 ${errors.name ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-300'
                                    }`}
                            />
                            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone or email</label>
                            <input
                                type="text"
                                placeholder="9876543210 or name@email.com"
                                value={contact}
                                onChange={(e) => { setContact(e.target.value); setErrors((v) => ({ ...v, contact: '' })); }}
                                className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:ring-2 focus:border-blue-400 transition bg-white text-slate-700 placeholder-slate-400 ${errors.contact ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-300'
                                    }`}
                            />
                            {errors.contact && <p className="text-xs text-rose-500 mt-1">{errors.contact}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
                        >
                            Continue
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 mt-4 text-center">
                        No password needed — just used to tag your posts.
                    </p>
                </div>
            </div>
        </div>
    );
}