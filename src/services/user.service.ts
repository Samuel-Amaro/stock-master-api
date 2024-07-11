import { asc, desc, eq, ilike } from 'drizzle-orm'
import { db } from '../database/connection'
import { user } from '../database/schema'
import { Order, Role } from '../types'
import { ORDER, PAGE, PAGE_SIZE } from '../Utils'
import { ServiceUtils } from './utils.service'

export abstract class UserService {
	static async findByEmail(email: string) {
		return await db.query.user.findFirst({
			where: ilike(user.email, email)
		})
	}

	static async findByName(name: string) {
		return await db.query.user.findFirst({
			where: ilike(user.name, name)
		})
	}

	static async findById(id: number) {
		return await db.query.user.findFirst({
			where: eq(user.id, id)
		})
	}

	static async create(values: {
		name: string
		email: string
		password: string
		role: Role
		idAdmin: number | null
	}) {
		return await db.insert(user).values(values).returning({ insertedId: user.id })
	}

	static async findAllByIdAdmin(
		page: number = PAGE,
		pageSize: number = PAGE_SIZE,
		order: Order = ORDER,
		id: number
	) {
		const dataWithoutLimit = await db.select().from(user).where(eq(user.idAdmin, id))

		const data = await db.query.user.findMany({
			where: eq(user.idAdmin, id),
			limit: pageSize,
			offset: (page - 1) * pageSize,
			orderBy: [
				order === 'asc' ? asc(user.name) : desc(user.name),
				order === 'asc' ? asc(user.name) : desc(user.name)
			]
		})

		return {
			page,
			pageSize,
			totalPages: ServiceUtils.calculateTotalPages(dataWithoutLimit.length, pageSize),
			totalItems: dataWithoutLimit.length,
			order,
			data: data.map((d) => {
				return {
					id: d.id,
					name: d.name,
					email: d.email,
					role: d.role,
					createdAt: d.createdAt,
					updatedAt: d.updatedAt
				}
			})
		}
	}

	static async update(values: { name?: string; password?: string; email?: string }, id: number) {
		const rows = await db
			.update(user)
			.set({ ...values, updatedAt: new Date() })
			.where(eq(user.id, id))
			.returning({ updatedId: user.id })
		return rows[0]
	}

	static async delete(id: number) {
		const rows = await db.delete(user).where(eq(user.id, id)).returning({ deletedId: user.id })
		return rows[0]
	}
}
