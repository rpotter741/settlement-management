// import jwt from 'jsonwebtoken';

// app.post('/settlement/:settlementId/invite', (req, res) => {
//   const { role } = req.body; // e.g., 'player', 'citizen'
//   const { settlementId } = req.params;

//   const token = jwt.sign({ settlementId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

//   const inviteLink = `${process.env.FRONTEND_URL}/join?token=${token}`;
//   res.json({ inviteLink });
// });
