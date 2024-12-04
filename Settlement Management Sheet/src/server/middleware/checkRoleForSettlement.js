import User from '../models/User.js';

function checkRoleForSettlement(settlementId, requiredRole) {
  return async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const settlementRole = user.settlements.find(
      (s) => s.settlementId.toString() === settlementId
    )?.role;

    if (!settlementRole || settlementRole !== requiredRole) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

export default checkRoleForSettlement;
