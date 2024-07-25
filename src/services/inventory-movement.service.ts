import { and, asc, desc, eq, sql, sum } from 'drizzle-orm'
import { db } from '../database/connection'
import { inventoryMovement, product, user } from '../database/schema'
import { MovementType, Order } from '../types'
import { ORDER, PAGE, PAGE_SIZE } from '../Utils'
import { ServiceUtils } from './utils.service'

export abstract class InventoryMovementService {
	static async create(values: {
		idProduct: number
		idUser: number
		quantity: number
		type: MovementType
		description?: string
	}) {
		const rowsInserted = await db
			.insert(inventoryMovement)
			.values(values)
			.returning({ insertedId: inventoryMovement.id })
		return rowsInserted[0]
	}

	static async findById(id: number) {
		return await db.query.inventoryMovement.findFirst({
			with: {
				product: {
					columns: {
						name: true
					}
				},
				user: {
					columns: {
						name: true
					}
				}
			},
			where: eq(inventoryMovement.id, id)
		})
	}

	static async getAll(page: number = PAGE, pageSize: number = PAGE_SIZE, order: Order = ORDER) {
		const dataWithoutLimit = await db
			.select()
			.from(inventoryMovement)
			.innerJoin(product, eq(inventoryMovement.idProduct, product.id))
			.innerJoin(user, eq(inventoryMovement.idUser, user.id))

		const data = await db.query.inventoryMovement.findMany({
			with: {
				product: {
					columns: {
						name: true
					}
				},
				user: {
					columns: {
						name: true
					}
				}
			},
			limit: pageSize,
			offset: (page - 1) * pageSize,
			orderBy: [
				order === 'asc'
					? asc(inventoryMovement.quantity)
					: desc(inventoryMovement.quantity),
				order === 'asc' ? asc(inventoryMovement.quantity) : desc(inventoryMovement.quantity)
			]
		})

		return {
			page,
			pageSize,
			totalPages: ServiceUtils.calculateTotalPages(dataWithoutLimit.length, pageSize),
			totalItems: dataWithoutLimit.length,
			order,
			data: data
		}
	}

	static async findByMovementFromProduct(idProduct: number, mov: MovementType) {
		const rowsResult = await db
			.select({
				qtdProductMov: sum(inventoryMovement.quantity)
			})
			.from(inventoryMovement)
			.where(and(eq(inventoryMovement.idProduct, idProduct), eq(inventoryMovement.type, mov)))
		return rowsResult[0]
	}

	static async findByMovementFromAllProduct(mov: MovementType) {
		return await db
			.select({
				qtdProductMov: sum(inventoryMovement.quantity),
				nameProduct: product.name,
				idProduct: product.id,
				typeMov: inventoryMovement.type
			})
			.from(inventoryMovement)
			.where(eq(inventoryMovement.type, mov))
			.groupBy(product.id, inventoryMovement.type)
			.innerJoin(product, eq(inventoryMovement.idProduct, product.id))
			.innerJoin(user, eq(inventoryMovement.idUser, user.id))
	}

	static async getInventory(searchFilter?: 'year' | 'day' | 'month' | 'full', value?: string) {
		let filter: string = 'YYYY'
		value ? value : new Date().getFullYear().toString()

		switch (searchFilter) {
			case 'year':
				filter = 'YYYY'
				break
			case 'day':
				filter = 'DD'
				break
			case 'month':
				filter = 'MM'
				break
			case 'full':
				filter = 'YYYY-MM-DD'
				break
			default:
				break
		}

		return await db.execute(sql`
      SELECT
          p.id AS idProduto,
          p.name AS nameProduto,
          SUM(CASE WHEN IM.type = 'entry' THEN IM.quantity ELSE 0 END) AS entry, 
          SUM(CASE WHEN IM.type = 'exit' THEN IM.quantity ELSE 0 END) AS exit,
          SUM(CASE WHEN IM.type = 'entry' THEN IM.quantity ELSE 0 END) - SUM(CASE WHEN IM.type = 'exit' THEN IM.quantity ELSE 0 END) AS currentQtd
      FROM
          inventory_movement AS IM
      INNER JOIN
          product P ON p.id = IM.id_product
      WHERE
          to_char(IM.updated_at, ${filter}) = CAST(${value} AS TEXT)
      GROUP BY
          p.id, p.name   
      `)
	}
}
