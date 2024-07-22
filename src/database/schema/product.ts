import { integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { category } from './category'
import { supplier } from './suppliers'
import { relations } from 'drizzle-orm'
import { inventoryMovement } from './inventory-movement'

export const product = pgTable('product', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	price: numeric('price', { precision: 7, scale: 2 }).notNull(),
	quantity: integer('quantity').notNull(),
	idCategory: integer('idCategory').references(() => category.id, {
		onDelete: 'cascade'
	}).notNull(),
	idSuppliers: integer('idSuppliers').references(() => supplier.id, {
		onDelete: 'cascade'
	}).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const productRelations = relations(product, ({ one, many }) => ({
	category: one(category, {
		fields: [product.idCategory],
		references: [category.id]
	}),
	supplier: one(supplier, {
		fields: [product.idSuppliers],
		references: [supplier.id]
	}),
	inventoryMovement: many(inventoryMovement)
}))
