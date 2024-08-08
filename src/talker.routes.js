const express = require('express');
const path = require('path');
const { readTalkerData } = require('./readJsonData');

const router = express.Router();

const PATH = path.resolve('src', 'talker.json');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const content = await readTalkerData(PATH);
    const talkerFound = content.find((talker) => talker.id === +id);

    if (!talkerFound) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }

    res.status(200).json(talkerFound);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao ler os dados dos talkers' });
  }
});

module.exports = router;