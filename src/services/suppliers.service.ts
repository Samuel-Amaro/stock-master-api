import { asc, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from '../database/connection'
import { supplier } from '../database/schema'
import { ORDER, PAGE, PAGE_SIZE } from '../Utils'
import { Order } from '../types'
import { ServiceUtils } from './utils.service'

export abstract class SupplierService {
	static async create(values: {
		address?: string
		city?: string
		state?: string
		cep?: string
		email: string
		name: string
		cnpj: string
		phone: string
	}) {
		const rows = await db.insert(supplier).values(values).returning({ insertedId: supplier.id })
		return rows[0]
	}

	static async findByUniqueFields(email: string, cnpj: string, phone: string) {
		return await db.query.supplier.findFirst({
			where: or(
				ilike(supplier.email, email),
				eq(supplier.cnpj, cnpj),
				eq(supplier.phone, phone)
			)
		})
	}

	static async findById(id: number) {
		return await db.query.supplier.findFirst({
			where: eq(supplier.id, id)
		})
	}

	static async getAll(page: number = PAGE, pageSize: number = PAGE_SIZE, order: Order = ORDER) {
		const dataWithoutLimit = await db.select().from(supplier)

		const data = await db.query.supplier.findMany({
			limit: pageSize,
			offset: (page - 1) * pageSize,
			orderBy: [
				order === 'asc' ? asc(supplier.name) : desc(supplier.name),
				order === 'asc' ? asc(supplier.name) : desc(supplier.name)
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

	static async update(
		values: {
			email?: string
			name?: string
			cnpj?: string
			phone?: string
			address?: string
			city?: string
			state?: string
			cep?: string
		},
		id: number
	) {
		const rows = await db
			.update(supplier)
			.set({ ...values, updatedAt: new Date() })
			.where(eq(supplier.id, id))
			.returning({ updatedId: supplier.id })
		return rows[0]
	}

	static async delete(id: number) {
		const rows = await db
			.delete(supplier)
			.where(eq(supplier.id, id))
			.returning({ deletedId: supplier.id })

		return rows[0]
	}
}
