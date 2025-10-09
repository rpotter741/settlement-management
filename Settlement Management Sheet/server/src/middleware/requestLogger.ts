const requestLogger = (req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.originalUrl}`);
  console.log(`Request Body:`, req.body);
  console.log('----------------------------------------');
  next(); // Pass control to the next middleware or route handler
};

export default requestLogger;
