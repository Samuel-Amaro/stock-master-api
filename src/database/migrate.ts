import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, client } from './connection'

// Isso executará migrações no banco de dados, ignorando as já aplicadas
await migrate(db, { migrationsFolder: './drizzle' })

// Não se esqueça de fechar a conexão, caso contrário o script irá travar
await client.end()
