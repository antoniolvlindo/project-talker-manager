const fs = require('fs').promises;
const path = require('path');

const talkerPath = path.resolve(__dirname, './talker.json');

const readTalkerData = async () => {
  try {
    const data = await fs.readFile(talkerPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler o arquivo: ${error.message}`);
    return [];
  }
};

const writeTalkerData = async (data) => {
  try {
    await fs.writeFile(talkerPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Erro ao escrever no arquivo: ${error.message}`);
  }
};

module.exports = {
  readTalkerData,
  writeTalkerData,
};
