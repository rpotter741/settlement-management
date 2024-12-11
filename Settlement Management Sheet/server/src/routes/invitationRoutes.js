import crypto from 'crypto';
import User from '../db/models/User.js';
import Invitation from '../db/models/Invitation.js';

const createInvitation = async (req, res) => {
  const { settlementId, role, duration } = req.body;

  const token = crypto.randomBytes(16).toString('hex'); // Random unique token
  const expiresAt = new Date(Date.now() + duration * 60 * 1000); // e.g., 60 minutes

  const invitation = new Invitation({ token, settlementId, role, expiresAt });
  await invitation.save();

  const inviteLink = `${req.protocol}://${req.get('host')}/invite/${token}`;
  res.status(201).json({ inviteLink });
};

const validateInvitation = async (req, res) => {
  const { token } = req.params;

  const invitation = await Invitation.findOne({ token });
  if (!invitation) {
    return res.status(404).json({ message: 'Invalid or expired invitation.' });
  }

  if (new Date() > invitation.expiresAt) {
    return res.status(410).json({ message: 'Invitation expired.' });
  }

  res.status(200).json({ message: 'Invitation is valid', invitation });
};

const useInvitation = async (req, res) => {
  const { token } = req.params;
  const { userId } = req.body;

  const invitation = await Invitation.findOne({ token });
  if (!invitation) {
    return res.status(404).json({ message: 'Invalid invitation.' });
  }

  if (new Date() > invitation.expiresAt) {
    return res.status(410).json({ message: 'Invitation expired.' });
  }

  if (invitation.uses >= invitation.maxUses) {
    return res
      .status(403)
      .json({ message: 'Invitation has reached its usage limit.' });
  }

  if (invitation.usedBy.includes(userId)) {
    return res
      .status(403)
      .json({ message: 'You have already used this invitation.' });
  }

  // Add the user to the settlement
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.settlements.push({
    settlementId: invitation.settlementId,
    role: invitation.role,
  });
  await user.save();

  // Increment the uses count
  invitation.uses += 1;
  invitation.usedBy.push(userId);

  // Check if maxUses is reached and delete if necessary
  if (invitation.uses >= invitation.maxUses) {
    await Invitation.findByIdAndDelete(invitation._id);
  } else {
    await invitation.save(); // Save updated invitation
  }

  res.status(200).json({ message: 'User successfully joined the settlement.' });
};
