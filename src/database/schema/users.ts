import { relations } from 'drizzle-orm'
import { pgTable, serial, varchar, text, pgEnum, timestamp } from 'drizzle-orm/pg-core'
import { inventoryMovement } from './inventory-movement'

export const userRoleEnum = pgEnum('user_role', ['employee', 'admin'])

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	password: text('password').notNull(),
	email: text('email').notNull().unique(),
	role: userRoleEnum('role').default('employee').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})

export const userRelations = relations(user, ({ many }) => ({
	inventoryMovement: many(inventoryMovement)
}))
