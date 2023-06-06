const notFound = (req, res) => res.status(404).send('Custom Error Handler: Route does not exist');

module.exports = notFound;
