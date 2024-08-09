const express = require('express');
const { readTalkerData, writeTalkerData } = require('./readJsonData');
const talkerRouter = require('./talker.routes');
const validateLogin = require('./Middlewares/validateLogin');
const generateToken = require('./Middlewares/generateToken');
const {
  auth,
  validateTalk,
  validateTalkerWatchedAt,
  validateTalkerRate,
  validateTalkerName,
  validateTalkerAge,
} = require('./Middlewares/validationsPost');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  try {
    const talkers = await readTalkerData();
    return res.status(HTTP_OK_STATUS).json(talkers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler os dados dos talkers' });
  }
});

app.use('/talker', talkerRouter);

app.post('/login', validateLogin, (req, res) => {
  try {
    const token = generateToken();
    return res.status(HTTP_OK_STATUS).json(token);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar a requisição' });
  }
});

app.post('/talker',
  auth,
  validateTalk,
  validateTalkerWatchedAt,
  validateTalkerRate,
  validateTalkerName,
  validateTalkerAge, 
  async (req, res) => {
    try {
      const newTalker = req.body;
      const talkers = await readTalkerData();
      newTalker.id = talkers.length + 1;
      talkers.push(newTalker);
      
      await writeTalkerData(talkers);

      res.status(201).json(newTalker);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar um novo palestrante' });
    }
  });

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
