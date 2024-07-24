import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { product } from './product'
import { user } from './users'
import { relations } from 'drizzle-orm'

export const movementTypeEnum = pgEnum('movement_type', ['entry', 'exit'])

export const inventoryMovement = pgTable('inventory_movement', {
	id: serial('id').primaryKey(),
	idProduct: integer('id_product')
		.references(() => product.id, { onDelete: 'cascade' })
		.notNull(),
	idUser: integer('id_user')
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull(),
	quantity: integer('quantity').notNull(),
	type: movementTypeEnum('type').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const inventoryMovementRelations = relations(inventoryMovement, ({ one }) => ({
	user: one(user, {
		fields: [inventoryMovement.idUser],
		references: [user.id]
	}),
	product: one(product, {
		fields: [inventoryMovement.idProduct],
		references: [product.id]
	})
}))
