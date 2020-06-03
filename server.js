const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('API running');
});

const PORT = 4000;

app.listen(PORT, () => console.log('Server started on port ' + PORT));
