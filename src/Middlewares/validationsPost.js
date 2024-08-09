const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  next();
};

const validateTalkerWatchedAt = (req, res, next) => {
  const { talk } = req.body;

  if (!talk || !talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  const dateRegex = /^([0-2][0-9]|(3)[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

const isValidRate = (rate) => Number.isInteger(rate) && rate >= 1 && rate <= 5;

const validateTalkerRate = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  if (talk.rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  if (!isValidRate(talk.rate)) {
    return res.status(400).json(
      { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
    );
  }

  next();
};

const validateTalkerName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const validateTalkerAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (!Number.isInteger(age) || age < 18) {
    return res.status(400).json(
      { message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' },
    );
  }

  next();
};

module.exports = {
  auth,
  validateTalk,
  validateTalkerWatchedAt,
  validateTalkerRate,
  validateTalkerName,
  validateTalkerAge,
};
