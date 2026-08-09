import { useState, useRef } from 'react';
import { CATEGORIES } from '../storage';

const CATEGORY_ICONS = {
  'ID Card': '🪪',
  Electronics: '💻',
  Keys: '🔑',
  Bag: '🎒',
  Wallet: '👛',
  Documents: '📄',
  Other: '📦',
};

const SHOW_NAME_CATEGORIES = ['ID Card', 'Documents'];

const DEFAULT_CLAIM_QUESTIONS = {
  'ID Card': ['What is your student roll number?', 'What department are you in?'],
  Electronics: ['What model or brand is it?', 'Any stickers or marks on it?'],
  Keys: ['How many keys are on the ring?', 'What does the keychain look like?'],
  Bag: ['What colour is it?', 'Is there anything inside you can describe?'],
  Wallet: ['What colour is the wallet?', 'Any cards or notes inside?'],
  Documents: ['What name is on the document?', 'What type of document is it?'],
  Other: ["What's unique about it?"],
};

export default function ReportForm({ type, onSubmit, onCancel }) {
  const isLost = type === 'lost';
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [claimQuestions, setClaimQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    type,
    title: '',
    category: '',
    description: '',
    location: '',
    date: new Date().toISOString().slice(0, 10),
    contactName: '',
    contactInfo: '',
    nameOnIt: '',
    image: null,
  });

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
    // When category changes, reset claim questions to defaults
    if (key === 'category' && !isLost) {
      setClaimQuestions(DEFAULT_CLAIM_QUESTIONS[val] || []);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setErrors((e) => ({ ...e, image: 'Image must be under 3 MB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result;
      setImagePreview(b64);
      setForm((prev) => ({ ...prev, image: b64 }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Give it a short title.';
    if (!form.category) errs.category = 'Pick a category.';
    if (!form.description.trim()) errs.description = 'Add a brief description.';
    if (!form.location.trim()) errs.location = 'Where was it lost/found?';
    if (!form.date) errs.date = 'Pick a date.';
    if (!form.contactName.trim()) errs.contactName = 'Your name?';
    if (!form.contactInfo.trim()) errs.contactInfo = 'Add a phone or email.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ ...form, claimQuestions: isLost ? [] : claimQuestions });
    }, 500);
  };

  const addCustomQuestion = () => {
    const q = customQuestion.trim();
    if (!q) return;
    setClaimQuestions((prev) => [...prev, q]);
    setCustomQuestion('');
  };

  const removeQuestion = (idx) => {
    setClaimQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const showNameField = SHOW_NAME_CATEGORIES.includes(form.category);

  return (
    <div className="slide-up max-w-xl mx-auto">
      {/* Back button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header band */}
        <div className={`h-1.5 ${isLost ? 'bg-rose-400' : 'bg-emerald-400'}`} />
        <div className="p-6">
          <h1 className={`text-xl font-semibold mb-1 ${isLost ? 'text-rose-700' : 'text-emerald-700'}`}>
            {isLost ? 'Lost something?' : 'Found something?'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {isLost ? 'Post it here so someone can reach out.' : 'Post it so the owner can find it.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Title */}
            <Field label="Title" error={errors.title} required>
              <input
                type="text"
                placeholder={isLost ? 'e.g. Blue backpack' : 'e.g. Found keys near library'}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className={inputClass(errors.title)}
              />
            </Field>

            {/* Category */}
            <Field label="Category" error={errors.category} required>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputClass(errors.category)}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_ICONS[c]} {c}
                  </option>
                ))}
              </select>
            </Field>

            {/* Name on it */}
            {showNameField && (
              <Field label="Name on it" hint="As it appears on the item">
                <input
                  type="text"
                  placeholder="e.g. Priya Mehta"
                  value={form.nameOnIt}
                  onChange={(e) => set('nameOnIt', e.target.value)}
                  className={inputClass()}
                />
              </Field>
            )}

            {/* Description */}
            <Field label="Description" error={errors.description} required>
              <textarea
                placeholder="Colour, brand, markings, anything distinctive…"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
                className={inputClass(errors.description) + ' resize-none'}
              />
            </Field>

            {/* Location */}
            <Field label="Location" error={errors.location} required>
              <input
                type="text"
                placeholder={isLost ? 'Where did you last have it?' : 'Where did you find it?'}
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className={inputClass(errors.location)}
              />
            </Field>

            {/* Date */}
            <Field label="Date" error={errors.date} required>
              <input
                type="date"
                value={form.date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => set('date', e.target.value)}
                className={inputClass(errors.date)}
              />
            </Field>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your name" error={errors.contactName} required>
                <input
                  type="text"
                  placeholder="Rohit Sharma"
                  value={form.contactName}
                  onChange={(e) => set('contactName', e.target.value)}
                  className={inputClass(errors.contactName)}
                />
              </Field>
              <Field label="Phone or email" error={errors.contactInfo} required>
                <input
                  type="text"
                  placeholder="9876543210 or name@email.com"
                  value={form.contactInfo}
                  onChange={(e) => set('contactInfo', e.target.value)}
                  className={inputClass(errors.contactInfo)}
                />
              </Field>
            </div>

            {/* Image upload */}
            <Field label="Photo" hint="Optional, max 3 MB" error={errors.image}>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 transition flex items-center justify-center flex-col gap-2"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-36 rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <p className="text-sm text-slate-400">Click to add a photo</p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); set('image', null); }}
                  className="text-xs text-slate-400 hover:text-rose-500 transition mt-1"
                >
                  Remove photo
                </button>
              )}
            </Field>

            {/* Claim questions — only for Found items */}
            {!isLost && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-medium text-slate-700 mb-1">Claim questions</p>
                <p className="text-xs text-slate-400 mb-3">
                  Someone claiming this item will need to answer these before seeing your contact details.
                </p>
                {claimQuestions.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="flex-1 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{q}</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(i)}
                      className="text-slate-400 hover:text-rose-500 transition text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a question for the claimant…"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomQuestion())}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                  />
                  <button
                    type="button"
                    onClick={addCustomQuestion}
                    className="px-3 py-2 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold text-white transition shadow-sm ${
                  isLost
                    ? 'bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300'
                    : 'bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300'
                }`}
              >
                {submitting ? 'Posting…' : isLost ? 'Post to Lost list' : 'Post to Found list'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, error, hint, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
        {hint && <span className="text-xs font-normal text-slate-400 ml-2">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full text-sm border rounded-lg px-3 py-2.5 focus:ring-2 focus:border-blue-400 transition bg-white text-slate-700 placeholder-slate-400 ${
    error
      ? 'border-rose-300 focus:ring-rose-200'
      : 'border-slate-200 focus:ring-blue-300'
  }`;
}
