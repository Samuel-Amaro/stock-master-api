import { relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { product } from './product'

export const supplier = pgTable('supplier', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').unique().notNull(),
	cnpj: text('cnpj').unique().notNull(),
	phone: text('phone').unique().notNull(),
	address: text('address'),
	city: text('city'),
	state: text('state'),
	cep: text('cep').unique(),
	country: text('contry'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})

export const supplierRelations = relations(supplier, ({ many }) => ({
	product: many(product)
}))
