import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from './schema'

export const client = new Client({
	host: import.meta.env.POSTGRES_HOST,
	port: parseInt(import.meta.env.POSTGRES_PORT as string),
	user: import.meta.env.POSTGRES_USER,
	database: import.meta.env.POSTGRES_DB,
	password: import.meta.env.POSTGRES_PASSWORD as string,
	ssl: getSSLValues()
})

function getSSLValues() {
	if (process.env.POSTGRES_CA) {
		return {
			ca: process.env.POSTGRES_CA
		}
	}

	return process.env.NODE_ENV === 'production' ? true : false
}

await client.connect()

export const db = drizzle(client, { schema, logger: true })
