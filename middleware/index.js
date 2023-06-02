export const isAuthenticated = async (req, res, next) => {
  const sessionCookie = req.cookies.sessionToken;

  if (!sessionCookie) {
    res.status(401).json({ message: 'Not authenticated' });
  } else {
    next();
  }
};
