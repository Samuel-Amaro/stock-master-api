import { asc, desc, eq, ilike } from 'drizzle-orm'
import { db } from '../database/connection'
import { category, product, supplier } from '../database/schema'
import { ORDER, PAGE, PAGE_SIZE } from '../Utils'
import { Order } from '../types'
import { ServiceUtils } from './utils.service'

export abstract class ProductService {
	static async create(values: {
		description?: string
		name: string
		price: string
		quantity: number
		idCategory: number
		idSuppliers: number
	}) {
		const rows = await db.insert(product).values(values).returning({ insertedId: product.id })
		return rows[0]
	}

	static async findByName(name: string) {
		return await db.query.product.findFirst({
			where: ilike(product.name, name)
		})
	}

	static async getAll(page: number = PAGE, pageSize: number = PAGE_SIZE, order: Order = ORDER) {
		const dataWithoutLimit = await db
			.select()
			.from(product)
			.innerJoin(category, eq(product.idCategory, category.id))
			.innerJoin(supplier, eq(product.idSuppliers, supplier.id))

		const data = await db
			.select()
			.from(product)
			.innerJoin(category, eq(product.idCategory, category.id))
			.innerJoin(supplier, eq(product.idSuppliers, supplier.id))
			.limit(pageSize)
			.offset((page - 1) * pageSize)
			.orderBy(
				order === 'asc' ? asc(product.name) : desc(product.name),
				order === 'asc' ? asc(product.name) : desc(product.name)
			)

		const newData = data.map((d) => {
			return {
				...d.product,
				nameCategory: d.category.name,
				nameSupplier: d.supplier.name
			}
		})

		return {
			page,
			pageSize,
			totalPages: ServiceUtils.calculateTotalPages(dataWithoutLimit.length, pageSize),
			totalItems: dataWithoutLimit.length,
			order,
			data: newData
		}
	}

	static async findById(id: number) {
		return await db.query.product.findFirst({
			where: eq(product.id, id),
			with: {
				category: {
					columns: {
						name: true
					}
				},
				supplier: {
					columns: {
						name: true
					}
				}
			}
		})
	}

	static async findByIdAll(
		column: 'idCategory' | 'idSupplier',
		id: number,
		page: number = PAGE,
		pageSize: number = PAGE_SIZE,
		order: Order = ORDER
	) {
		const dataWithoutLimit = await db
			.select()
			.from(product)
			.innerJoin(category, eq(product.idCategory, category.id))
			.innerJoin(supplier, eq(product.idSuppliers, supplier.id))
			.where(
				eq(
					column === 'idCategory'
						? product.idCategory
						: column === 'idSupplier'
							? product.idSuppliers
							: product.id,
					id
				)
			)
		const data = await db.query.product.findMany({
			where: eq(
				column === 'idCategory'
					? product.idCategory
					: column === 'idSupplier'
						? product.idSuppliers
						: product.id,
				id
			),
			limit: pageSize,
			offset: (page - 1) * pageSize,
			orderBy: [
				order === 'asc' ? asc(product.name) : desc(product.name),
				order === 'asc' ? asc(product.name) : desc(product.name)
			],
			with: {
				category: {
					columns: {
						name: true
					}
				},
				supplier: {
					columns: {
						name: true
					}
				}
			}
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
			name?: string
			description?: string
			price?: string
			quantity?: number
			idCategory?: number
			idSuppliers?: number
		},
		id: number
	) {
		const rows = await db
			.update(product)
			.set({ ...values, updatedAt: new Date() })
			.where(eq(product.id, id))
			.returning({ updatedId: product.id })
		return rows[0]
	}

	static async delete(id: number) {
		const rows = await db
			.delete(product)
			.where(eq(product.id, id))
			.returning({ deletedId: product.id })
		return rows[0]
	}
}
