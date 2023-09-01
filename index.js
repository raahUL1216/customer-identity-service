const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000

const mainRoutes = require('./routes/index');
const userRoutes = require('./routes/user');

// parse application/json
app.use(bodyParser.json())

app.use('/', mainRoutes);
app.use('/', userRoutes);

// do not start server when running tests
if (require.main === module) {
	app.listen(port, () => {
	  console.log(`Example app listening on port ${port}`);
	})
}

module.exports = app;