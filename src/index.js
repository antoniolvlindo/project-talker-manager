const express = require('express');
const { readTalkerData } = require('./readJsonData');
const talkerRouter = require('./talker.routes');
const validateLogin = require('./Middlewares/validateLogin');
const generateToken = require('./Middlewares/generateToken')

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, é para o avaliador funcionar
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

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
