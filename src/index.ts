import express from 'express';
import bodyParser from 'body-parser';

import { AppDataSource } from './database/index';

import mainRoutes from './routes/index';
import customerRoutes from './routes/customer';

const app = express();
const port = 3000;

/**
 * main function connects to customer database and starts server
 */
async function main() {
	try {
		await AppDataSource.initialize();
		console.log('Connected to PostgreSQL database');

		app.use(bodyParser.json());

		app.use('/', mainRoutes);
		app.use('/', customerRoutes);

		app.listen(port, () => {
			console.log(`Customer service listening on port ${port}`);
		});
	} catch (error) {
		throw error;
	}
}

main();