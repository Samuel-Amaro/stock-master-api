import { relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { product } from './product'

export const category = pgTable('category', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})

export const categoryRelations = relations(category, ({ many }) => ({
	product: many(product)
}))
