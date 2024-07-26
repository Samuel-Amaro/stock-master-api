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

	static async findById(id: number): Promise<
		| {
				id: number
				name: string
				password: string
				email: string
				role: 'employee' | 'admin'
				nameAdmin: string | null
				createdAt: Date
				updatedAt: Date
		  }
		| undefined
	> {
		const userFound = await db.query.user.findFirst({
			where: eq(user.id, id)
		})

		if (userFound && userFound.idAdmin) {
			const admin = await db.query.user.findFirst({
				where: eq(user.id, userFound.id)
			})
			return {
				id: userFound.id,
				name: userFound.name,
				password: userFound.password,
				email: userFound.email,
				role: userFound.role,
				nameAdmin: admin?.name ? admin.name : null,
				createdAt: userFound.createdAt,
				updatedAt: userFound.updatedAt
			}
		}

		const result = userFound
			? {
					id: userFound.id,
					name: userFound.name,
					password: userFound.password,
					email: userFound.email,
					role: userFound.role,
					nameAdmin: null,
					createdAt: userFound.createdAt,
					updatedAt: userFound.updatedAt
				}
			: undefined

		return result
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

	static async updatePassword(value: { password: string }, id: number) {
		const rows = await db
			.update(user)
			.set({ ...value, updatedAt: new Date() })
			.where(eq(user.id, id))
			.returning({ updatedId: user.id })
		return rows[0]
	}

	static async delete(id: number) {
		const rows = await db.delete(user).where(eq(user.id, id)).returning({ deletedId: user.id })
		return rows[0]
	}
}
