const handleException = (fn) => (req, res, next) => {
  fn(req, res).catch((error) => next(error));
};

export default handleException;
