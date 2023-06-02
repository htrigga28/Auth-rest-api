export const isAuthenticated = (req, res, next) => {
  res.cookie('isAuthenticated', true);
};
