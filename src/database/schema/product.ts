import { customType, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { category } from './category'
import { supplier } from './suppliers'
import { relations } from 'drizzle-orm'
import { inventoryMovement } from './inventory-movement'

const customPrice = customType<{data: number; notNull: true}>({
  dataType() {
    return 'number'
  }
});

export const product = pgTable('product', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	price: customPrice('price'), //numeric('price', { precision: 7, scale: 2 }).notNull(),
	quantity: integer('quantity').notNull(),
	idCategory: integer('idCategory').references(() => category.id, {
		onDelete: 'cascade'
	}),
	idSuppliers: integer('idSuppliers').references(() => supplier.id, {
		onDelete: 'cascade'
	}),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
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
