import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username });
      if (res.data.exists) {
        localStorage.setItem('userId', res.data.user.id);
        navigate('/home');
      } else {
        alert('User not found. Please register.');
        navigate('/register');
      }
    } catch (err) {
      console.error(err);
      alert('Login error');
    }
  };

  return (
    <div className="container">
        <h1>Referral Ripple Program</h1>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: '10px' }}>New user? <Link to="/register">Sign up</Link></p>
    </div>
  );
}