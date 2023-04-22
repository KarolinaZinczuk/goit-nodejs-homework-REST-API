const app = require('./app');

const { connectDatabase } = require("./startup/database.js");
connectDatabase();

const port = 3000;

app.listen(port, () => {
  console.log(`Server running. Use our API on port: ${port}`);
});
