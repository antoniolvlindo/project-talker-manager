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

app.get('/talker/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const talkers = await readTalkerData();

    if (!q || q === undefined) {
      return res.status(200).json(talkers);
    }

    const filteredTalkers = talkers.filter((talker) =>
      talker.name.toLowerCase().includes(q.toLowerCase())
    );

    return res.status(200).json(filteredTalkers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar palestrantes' });
  }
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

const updateTalker = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTalker = req.body;
    const talkers = await readTalkerData();
    const talkerIndex = talkers.findIndex((talker) => talker.id === parseInt(id, 10));

    if (talkerIndex === -1) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }

    updatedTalker.id = parseInt(id, 10);
    talkers[talkerIndex] = updatedTalker;
    await writeTalkerData(talkers);

    res.status(200).json(updatedTalker);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao editar a pessoa palestrante' });
  }
};

app.put('/talker/:id',
  auth,
  validateTalk,
  validateTalkerWatchedAt,
  validateTalkerRate,
  validateTalkerName,
  validateTalkerAge,
  updateTalker);

app.delete('/talker/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await readTalkerData();
    const talkerIndex = talkers.findIndex((talker) => talker.id === parseInt(id, 10));

    if (talkerIndex === -1) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }

    talkers.splice(talkerIndex, 1);
    await writeTalkerData(talkers);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar a pessoa palestrante' });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
