import User from '../models/user.js';

export const isAuthenticated = async (req, res, next) => {
  const sessionCookie = req.cookies.sessionToken;

  if (!sessionCookie) {
    res.status(401).json({ message: 'Not authenticated' });
  } else {
    next();
  }
};

export const isOwner = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      ' +authentication.sessionToken'
    );

    const isAuthenticated =
      user.authentication.sessionToken === req.cookies.sessionToken;

    if (isAuthenticated) {
      next();
    } else {
      res.status(401).json({ message: 'action not allowed' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
