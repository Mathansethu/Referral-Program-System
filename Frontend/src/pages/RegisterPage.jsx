import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    referralCode: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      if (res.status === 200) {
        localStorage.setItem('userId', res.data.userId);
        alert('Registration successful!');
        navigate('/home');
      }
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input name="username" onChange={handleChange} required />

        <label>Name</label>
        <input name="name" onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" onChange={handleChange} required />

        <label>Phone</label>
        <input name="phone" onChange={handleChange} required />

        <label>Referral Code (optional)</label>
        <input name="referralCode" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}