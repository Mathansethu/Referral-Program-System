
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return navigate('/');

    axios.get(`http://localhost:5000/api/dashboard/${userId}`)
      .then(res => {
        setUser(res.data.user);
        setReferrals(res.data.referrals);
      })
      .catch(err => console.error(err));
  }, [navigate]);

  const getWeeklyCount = () => {
    const oneWeekAgo = dayjs().subtract(7, 'day');
    return referrals.filter(r => dayjs(r.created_at).isAfter(oneWeekAgo)).length;
  };

  const getMonthlyCount = () => {
    const oneMonthAgo = dayjs().subtract(30, 'day');
    return referrals.filter(r => dayjs(r.created_at).isAfter(oneMonthAgo)).length;
  };

  const totalRewards = referrals.reduce((acc, r) => acc + (r.reward || 0), 0);

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>User Dashboard</h2>

      {user && (
        <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <h3>Welcome, {user.name}</h3>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Referral Code:</strong> <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{user.referral_code}</span></p>
        </div>
      )}

      
      <div style={{ marginTop: '30px', padding: '15px', background: '#eef2ff', borderRadius: '8px' }}>
        <h3> REFERRAL STATATICS</h3>
        <p><strong>Total Referrals:</strong> {referrals.length}</p>
        <p><strong>This Week:</strong> {getWeeklyCount()}</p>
        <p><strong>This Month:</strong> {getMonthlyCount()}</p>
        <p><strong>Total Rewards Earned:</strong> ₹{totalRewards}</p>
      </div>

     
      <h3 style={{ marginTop: '30px' }}>REFERRED FRIENDS DETAILS</h3>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>ID</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Username</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Name</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Email</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Date</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Reward</th>
          </tr>
        </thead>
        <tbody>
          {referrals.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '12px' }}>No referrals yet.</td>
            </tr>
          ) : (
            referrals.map(ref => (
              <tr key={ref.id}>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{ref.id}</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{ref.username}</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{ref.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{ref.email}</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{dayjs(ref.created_at).format('DD MMM YYYY')}</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>₹{ref.reward}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

