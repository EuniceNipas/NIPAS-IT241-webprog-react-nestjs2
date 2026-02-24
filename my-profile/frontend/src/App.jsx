import { useEffect, useState } from 'react';

// Environment-aware API URL fallback:
// - local dev Nest: http://localhost:3000/guestbook
// - Vercel deployment (rewrite to serverless Nest): /api/guestbook
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3000/guestbook'
    : '/api/guestbook');

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });

  const load = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.error('Failed to load guestbook entries', await res.text());
      return;
    }
    setEntries(await res.json());
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      console.error('Failed to save guestbook entry', await res.text());
      return;
    }
    setForm({ name: '', message: '' });
    load();
  };

  const remove = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      console.error('Failed to delete guestbook entry', await res.text());
      return;
    }
    load();
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>(NIPAS) My Profile & Guestbook</h1>
      <form onSubmit={save}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
        <button type="submit">Sign Guestbook</button>
      </form>
      <hr />
      {entries.map(e => (
        <div key={e.id}>
          <p><strong>{e.name}</strong>: {e.message}</p>
          <button onClick={() => remove(e.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
