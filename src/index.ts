import express from 'express';
const app = express()
import bodyParser from 'body-parser';
const port = 3000

import mainRoutes from './routes/index';
import customerRoutes from './routes/customer';

app.use(bodyParser.json())

app.use('/', mainRoutes);
app.use('/', customerRoutes);

app.listen(port, () => {
	console.log(`Customer service listening on port ${port}`);
})