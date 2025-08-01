const express = require('express');
const router = express.Router();
const db = require('../db');
const generateReferralCode = require('../utils/generateReferralCode');

//  REGISTERATION PAGE------------------------------------------------------------------------------------------------------------------------
router.post('/register', (req, res) => {
  const { username, name, email, phone, referralCode } = req.body;
  const userReferralCode = generateReferralCode();

  const insertUser = `INSERT INTO users (username, name, email, phone, referral_code) VALUES (?, ?, ?, ?, ?)`;

  db.query(insertUser, [username, name, email, phone, userReferralCode], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const userId = result.insertId;

    if (referralCode) {
      const findReferrer = `SELECT id FROM users WHERE referral_code = ?`;
      db.query(findReferrer, [referralCode], (err, referrerResult) => {
        if (!err && referrerResult.length > 0) {
          const referrerId = referrerResult[0].id;
          const addReferral = `INSERT INTO referrals (referred_by, referred_user_id) VALUES (?, ?)`;
          db.query(addReferral, [referrerId, userId]);
        }
      });
    }

    res.status(200).json({ message: 'User registered successfully', userId });
  });
});

// LOGIN PAGE---------------------------------------------------------------------------------------------------------------------------------
router.post('/login', (req, res) => {
  const { username } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length > 0) {
      const user = result[0];
      return res.status(200).json({ exists: true, user });
    } else {
      return res.status(200).json({ exists: false });
    }
  });
});


//INIVTATION PAGE-----------------------------------------------------------------------------------------------------------------------
router.post('/invite', (req, res) => {
  const { username, name, email, phone, referredBy } = req.body;
  const referralCode = Math.random().toString(36).substr(2, 6).toUpperCase();

  if (!username || !name || !email || !phone || !referredBy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO users (username, name, email, phone, referred_by, referral_code)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [username, name, email, phone, referredBy, referralCode];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('DB ERROR in /invite:', err); 
      return res.status(500).json({ error: 'Database error', detail: err.message });
    }

    return res.status(200).json({ message: 'Invite successful' });
  });
});

//DASHBOARD PAGE---------------------------------------------------------------------------------------------------

router.get('/dashboard/:id', (req, res) => {
  const userId = req.params.id;
  const db = require('../db');

  const userQuery = 'SELECT * FROM users WHERE id = ?';
  const referralsQuery = `
    SELECT id, username, name, email, created_at 
    FROM users 
    WHERE referred_by = ?
  `;

  db.query(userQuery, [userId], (err, userResults) => {
    if (err) return res.status(500).json({ error: 'User fetch failed' });

    const user = userResults[0];

    db.query(referralsQuery, [userId], (err, referralResults) => {
      if (err) return res.status(500).json({ error: 'Referral fetch failed' });

      // Add static reward and return
      const referralsWithReward = referralResults.map(r => ({
        ...r,
        reward: 50 
      }));

      res.status(200).json({
        user,
        referrals: referralsWithReward
      });
    });
  });
});





module.exports = router;
