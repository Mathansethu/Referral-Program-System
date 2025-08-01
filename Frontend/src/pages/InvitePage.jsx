import { useState } from 'react';
import axios from 'axios';

export default function InvitePage() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const referredBy = localStorage.getItem('userId');

    try {
      const res = await axios.post('http://localhost:5000/api/invite', {
        ...form,
        referredBy
      });

      if (res.status === 200) {
        alert('Invitation sent successfully!');
        setForm({
          username: '',
          name: '',
          email: '',
          phone: ''
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send invitation.');
    }
  };

  return (
    <div className="container">
      <h2>Invite a Friend</h2>
      <form onSubmit={handleInvite}>
        <label>Username</label>
        <input type="text" name="username" value={form.username} onChange={handleChange} required />

        <label>Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Phone</label>
        <input type="text" name="phone" value={form.phone} onChange={handleChange} required />

        <button type="submit">Send Invite</button>
      </form>
    </div>
  );
}
