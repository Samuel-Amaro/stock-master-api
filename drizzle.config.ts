import { defineConfig } from 'drizzle-kit'

process.env.POSTGRES_HOST = 'localhost'
process.env.POSTGRES_USER = 'local_user'
process.env.POSTGRES_DB = 'local_db'
process.env.POSTGRES_PASSWORD = 'local_password'
process.env.POSTGRES_PORT = '5432'

export default defineConfig({
	schema: './src/database/schema/index.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		host: process.env.POSTGRES_HOST,
		user: process.env.POSTGRES_USER as string,
		database: process.env.POSTGRES_DB as string,
		password: process.env.POSTGRES_PASSWORD as string,
		port: parseInt(process.env.POSTGRES_PORT as string)
	},
	verbose: true,
	strict: true
})
