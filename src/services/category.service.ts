import { asc, desc, eq, ilike } from 'drizzle-orm'
import { db } from '../database/connection'
import { category } from '../database/schema'
import { ORDER, PAGE, PAGE_SIZE } from '../Utils'
import { Order } from '../types'
import { ServiceUtils } from './utils.service'

export abstract class CategoryService {
	static async create(values: { name: string; description?: string }) {
		const rows = await db.insert(category).values(values).returning({ insertedId: category.id })
		return rows[0]
	}

	static async findByName(name: string) {
		return await db.query.category.findFirst({
			where: ilike(category.name, name)
		})
	}

	static async findById(idCategory: number) {
		return await db.query.category.findFirst({
			where: eq(category.id, idCategory)
		})
	}

	static async getAll(page: number = PAGE, pageSize: number = PAGE_SIZE, order: Order = ORDER) {
		const dataWithoutLimit = await db.select().from(category)

		const data = await db.query.category.findMany({
			limit: pageSize,
			offset: (page - 1) * pageSize,
			orderBy: [
				order === 'asc' ? asc(category.name) : desc(category.name),
				order === 'asc' ? asc(category.name) : desc(category.name)
			]
		})

		return {
			page,
			pageSize,
			totalPages: ServiceUtils.calculateTotalPages(dataWithoutLimit.length, pageSize),
			totalItems: dataWithoutLimit.length,
			order,
			data
		}
	}

	static async update(values: { name?: string; description?: string }, id: number) {
		const rows = await db
			.update(category)
			.set({ ...values, updatedAt: new Date() })
			.where(eq(category.id, id))
			.returning({ updatedId: category.id })
		return rows[0]
	}

	static async delete(id: number) {
		const rows = await db
			.delete(category)
			.where(eq(category.id, id))
			.returning({ deletedId: category.id })
		return rows[0]
	}
}
