const app = require('./app')
const fs = require("fs").promises;

const isExist = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIfNotExist = async (path) => {
  // jeeli nasz folder nie istnieje to go utworzymy
  if (!(await isExist(path))) {
    await fs.mkdir(path);
  }
};

const port = 3000;

app.listen(port, () => {
  console.log(`Server running. Use our API on port: ${port}`);
});