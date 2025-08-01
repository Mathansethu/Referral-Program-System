import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return navigate('/');

    axios.get(`http://localhost:5000/api/user/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

  return (
    <div className="container">
      <h2>Referral Ripple</h2>
      {user && <p>Welcome, <strong>{user.name}</strong>!</p>}

      <div style={{ marginTop: '30px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '10px', display: 'block' }}>User Dashboard</button>
        <button onClick={() => navigate('/invite')} style={{ marginBottom: '10px', display: 'block' }}>Invite Friends</button>
        
      </div>
    </div>
  );
}