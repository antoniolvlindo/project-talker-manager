const fs = require('fs').promises;
const path = require('path');

async function readTalkerData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, 'talker.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
    return [];
  }
}

module.exports = {
  readTalkerData,
};
