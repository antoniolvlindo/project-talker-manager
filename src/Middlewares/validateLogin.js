const validateField = (field, message) => {
  if (!field) {
    return message;
  }
  return null;
};

const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'O "email" deve ter o formato "email@email.com"';
  }
  return null;
};

module.exports = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [
    validateField(email, 'O campo "email" é obrigatório'),
    validateEmailFormat(email),
    validateField(password, 'O campo "password" é obrigatório'),
    password && password.length < 6 ? 'O "password" deve ter pelo menos 6 caracteres' : null,
  ].filter((error) => error);

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  }

  next();
};
