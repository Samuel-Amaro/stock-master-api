export type TokenPayload = {
	sub: string
	role: string
}

export enum Role {
	employee = 'employee',
	admin = 'admin'
}

export enum Order {
	asc = 'asc',
	desc = 'desc'
}

export type PartialUser = {
	name: string
	email: string
	password: string
}

export type PartialUserBatch = {
	name: string
	email: string
	password: string
	id: number
}
