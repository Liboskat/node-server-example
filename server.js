const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('token_key', 'ultrashrek');
require('./routes')(app);
app.listen(port, () => {
    console.log('Server started at ' + port);
});