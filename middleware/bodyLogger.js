module.exports = async function bodyLogger(req, res, next) {
  console.log(req.body)
  next()
};