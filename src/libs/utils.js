export function errorResponse(err, res, status = 500) {
  res.status(status).send(err.message);
}
