import { Role } from '../types'
import { db } from './connection'
import { category, inventoryMovement, product, supplier, user } from './schema'

const users: {
	name: string
	email: string
	hash: string
	password: string
	role: Role
	idUser: number | null
}[] = [
	{
		name: 'Amber Howard',
		email: 'scottmichael@hotmail.com',
		hash: '$argon2id$v=19$m=65536,t=2,p=1$6TC4P2/5NpWqsqAKXJ9Y2+8llNU4vwyZ0Keo0blCkzU$7rlevGjvBg7hNwHfTv+rGX84sIVN80nJ40B+ipeqX3Y',
		password: 'A1b@2c3d',
		role: Role.admin,
		idUser: null
	},
	{
		name: 'Matthew Miller',
		email: 'urhodes@gmail.com',
		hash: '$argon2id$v=19$m=65536,t=2,p=1$aXfyuB91R4TmPScR5DauuHgKODq+CwTk5YkPCxt6lnk$DLPTpKX0yog5p+JOfvadluD86a3jF/2BXgopN/5RRQc',
		password: 'X9y!8w7v',
		role: Role.employee,
		idUser: 1
	},
	{
		name: 'Christopher Dunn',
		email: 'williamsamy@gmail.com',
		hash: '$argon2id$v=19$m=65536,t=2,p=1$z0fvmY7wDJKZmf0Gv6YPrEnqQQ2X1uy6HifRj7WLI2s$O5lIhuyxUkYJSKEDhmj1YTilnuktybQsZM/y/NdfuCk',
		password: 'P0q$4t6u',
		role: Role.employee,
		idUser: 1
	},
	{
		name: 'Tammy Carroll',
		email: 'frankmary@yahoo.com',
		hash: '$argon2id$v=19$m=65536,t=2,p=1$B+u7V4Jj7gGSTeTtKVKknR4JIZcUBg3PlMhFBwVzr3s$bNsHI70N0MmXUGXTH6ov86hyx1PvU0ajemsL5fv8KUc',
		password: 'M3n*5o1l',
		role: Role.employee,
		idUser: 1
	},
	{
		name: 'Scott Benjamin',
		email: 'ruthford@munoz-bowen.biz',
		hash: '$argon2id$v=19$m=65536,t=2,p=1$uVEd2oU5OW4Q7wtpq0namJTBAqGZVKTvUKb3UouXYXo$Xau4FvB+xNyBq4qAlA8mA8hgTlgm1qth5R3beielfC0',
		password: 'B8r%7s2j',
		role: Role.employee,
		idUser: 1
	}
]

const categorys = [
	{
		name: 'Eletrônicos',
		description: 'Aparelhos e dispositivos eletrônicos diversos.'
	},
	{
		name: 'Roupas',
		description: 'Vestimentas e acessórios de moda.'
	},
	{
		name: 'Alimentos',
		description: 'Produtos alimentícios e bebidas.'
	},
	{
		name: 'Móveis',
		description: 'Móveis e artigos para casa.'
	},
	{
		name: 'Brinquedos',
		description: 'Jogos e brinquedos para todas as idades.'
	},
	{
		name: 'Livros',
		description: 'Literatura, didáticos e outros gêneros.'
	},
	{
		name: 'Ferramentas',
		description: 'Ferramentas e equipamentos para construção.'
	},
	{
		name: 'Beleza',
		description: 'Produtos de beleza e cuidados pessoais.'
	},
	{
		name: 'Esportes',
		description: 'Artigos esportivos e de fitness.'
	},
	{
		name: 'Automotivo',
		description: 'Acessórios e peças para veículos.'
	}
]

const suppliers = [
	{
		name: 'EletroComercial LTDA',
		email: 'contato@eletrocomercial.com.br',
		address: 'Rua das Flores, 123',
		city: 'São Paulo',
		state: 'SP',
		cep: '01001-000',
		cnpj: '12.345.678/0001-90',
		country: 'Brasil',
		phone: '(11) 98765-4321'
	},
	{
		name: 'ModaFashion SA',
		email: 'vendas@modafashion.com.br',
		address: 'Av. Paulista, 2000',
		city: 'São Paulo',
		state: 'SP',
		cep: '01310-100',
		cnpj: '98.765.432/0001-00',
		country: 'Brasil',
		phone: '(11) 91234-5678'
	},
	{
		name: 'Alimentos Gourmet LTDA',
		email: 'contato@gourmetalimentos.com.br',
		address: 'Rua dos Andradas, 45',
		city: 'Rio de Janeiro',
		state: 'RJ',
		cep: '20050-008',
		cnpj: '23.456.789/0001-11',
		country: 'Brasil',
		phone: '(21) 99876-5432'
	},
	{
		name: 'MoveisPlan LTDA',
		email: 'suporte@moveisplan.com.br',
		address: 'Rua das Palmeiras, 300',
		city: 'Curitiba',
		state: 'PR',
		cep: '80010-100',
		cnpj: '34.567.890/0001-22',
		country: 'Brasil',
		phone: '(41) 98765-4321'
	},
	{
		name: 'Brinquedos Infância LTDA',
		email: 'info@brinquedosinfancia.com.br',
		address: 'Rua da Alegria, 150',
		city: 'Belo Horizonte',
		state: 'MG',
		cep: '30140-070',
		cnpj: '45.678.901/0001-33',
		country: 'Brasil',
		phone: '(31) 91234-5678'
	},
	{
		name: 'Livraria Cultural SA',
		email: 'contato@livrariacultural.com.br',
		address: 'Av. Rio Branco, 1000',
		city: 'Rio de Janeiro',
		state: 'RJ',
		cep: '20090-004',
		cnpj: '56.789.012/0001-44',
		country: 'Brasil',
		phone: '(21) 99876-5567'
	},
	{
		name: 'Ferramentas Pro LTDA',
		email: 'suporte@ferramentaspro.com.br',
		address: 'Rua das Indústrias, 400',
		city: 'Porto Alegre',
		state: 'RS',
		cep: '90040-100',
		cnpj: '67.890.123/0001-55',
		country: 'Brasil',
		phone: '(51) 98765-4321'
	},
	{
		name: 'Beleza Pura SA',
		email: 'contato@belezapura.com.br',
		address: 'Rua dos Cosméticos, 80',
		city: 'Florianópolis',
		state: 'SC',
		cep: '88010-100',
		cnpj: '78.901.234/0001-66',
		country: 'Brasil',
		phone: '(48) 91234-5678'
	},
	{
		name: 'EsporteTotal LTDA',
		email: 'info@esportetotal.com.br',
		address: 'Rua dos Atletas, 70',
		city: 'Salvador',
		state: 'BA',
		cep: '40010-100',
		cnpj: '89.012.345/0001-77',
		country: 'Brasil',
		phone: '(71) 99876-5432'
	},
	{
		name: 'AutoPeças Brasil LTDA',
		email: 'vendas@autopecasbrasil.com.br',
		address: 'Av. dos Automóveis, 500',
		city: 'Brasília',
		state: 'DF',
		cep: '70040-100',
		cnpj: '90.123.456/0001-88',
		country: 'Brasil',
		phone: '(61) 98765-4321'
	}
]

const products = [
	{ name: 'Smartphone', price: '1299.99', quantity: 50, idCategory: 1, idSuppliers: 1 },
	{ name: 'Camisa', price: '49.99', quantity: 200, idCategory: 2, idSuppliers: 2 },
	{ name: 'Arroz', price: '5.99', quantity: 1000, idCategory: 3, idSuppliers: 3 },
	{ name: 'Sofá', price: '799.99', quantity: 20, idCategory: 4, idSuppliers: 4 },
	{ name: 'Boneca', price: '59.99', quantity: 150, idCategory: 5, idSuppliers: 5 },
	{ name: 'Livro de Ficção', price: '29.99', quantity: 300, idCategory: 6, idSuppliers: 6 },
	{ name: 'Martelo', price: '19.99', quantity: 500, idCategory: 7, idSuppliers: 7 },
	{ name: 'Shampoo', price: '12.99', quantity: 800, idCategory: 8, idSuppliers: 8 },
	{ name: 'Bola de Futebol', price: '49.99', quantity: 100, idCategory: 9, idSuppliers: 9 },
	{ name: 'Pneu', price: '299.99', quantity: 60, idCategory: 10, idSuppliers: 10 }
]

const inventoryMovements: {
	idProduct: number
	idUser: number
	quantity: number
	type: 'entry' | 'exit'
	description: string
}[] = [
	{
		idProduct: 1,
		idUser: 1,
		quantity: 30,
		type: 'entry',
		description: 'Entrada de novos smartphones para estoque.'
	},
	{
		idProduct: 2,
		idUser: 2,
		quantity: 50,
		type: 'exit',
		description: 'Saída de camisas para venda em loja física.'
	},
	{
		idProduct: 3,
		idUser: 3,
		quantity: 200,
		type: 'entry',
		description: 'Recebimento de novo lote de arroz.'
	},
	{
		idProduct: 4,
		idUser: 4,
		quantity: 5,
		type: 'exit',
		description: 'Venda de sofás para clientes.'
	},
	{
		idProduct: 5,
		idUser: 1,
		quantity: 100,
		type: 'entry',
		description: 'Chegada de nova remessa de bonecas.'
	},
	{
		idProduct: 6,
		idUser: 2,
		quantity: 150,
		type: 'exit',
		description: 'Distribuição de livros de ficção para livrarias.'
	},
	{
		idProduct: 7,
		idUser: 3,
		quantity: 200,
		type: 'entry',
		description: 'Estoque de novos martelos para construção.'
	},
	{
		idProduct: 8,
		idUser: 4,
		quantity: 400,
		type: 'exit',
		description: 'Venda de shampoo para revendedores.'
	},
	{
		idProduct: 9,
		idUser: 1,
		quantity: 60,
		type: 'entry',
		description: 'Recebimento de bolas de futebol para o estoque.'
	},
	{
		idProduct: 10,
		idUser: 2,
		quantity: 10,
		type: 'exit',
		description: 'Venda de pneus para oficina mecânica.'
	},
	{
		idProduct: 3,
		idUser: 2,
		quantity: 50,
		type: 'entry',
		description: 'Reabastecimento de arroz.'
	},
	{
		idProduct: 5,
		idUser: 3,
		quantity: 30,
		type: 'exit',
		description: 'Venda de bonecas para loja de brinquedos.'
	},
	{
		idProduct: 7,
		idUser: 4,
		quantity: 100,
		type: 'entry',
		description: 'Estoque de martelos para promoção.'
	},
	{
		idProduct: 9,
		idUser: 3,
		quantity: 30,
		type: 'exit',
		description: 'Venda de bolas de futebol para academia.'
	},
	{
		idProduct: 4,
		idUser: 1,
		quantity: 10,
		type: 'entry',
		description: 'Entrada de novos sofás no estoque.'
	},
	{
		idProduct: 6,
		idUser: 1,
		quantity: 70,
		type: 'entry',
		description: 'Entrada de novos livros de ficção no estoque.'
	},
	{
		idProduct: 8,
		idUser: 2,
		quantity: 100,
		type: 'entry',
		description: 'Entrada de novos shampoos no estoque.'
	},
	{
		idProduct: 10,
		idUser: 3,
		quantity: 5,
		type: 'entry',
		description: 'Entrada de novos pneus no estoque.'
	},
	{
		idProduct: 1,
		idUser: 4,
		quantity: 10,
		type: 'exit',
		description: 'Venda de smartphones para loja de eletrônicos.'
	},
	{
		idProduct: 2,
		idUser: 3,
		quantity: 20,
		type: 'exit',
		description: 'Venda de camisas para loja de roupas.'
	}
]

/**
 * RESET DATABASE
 */

await db.delete(user)
await db.delete(category)
await db.delete(product)
await db.delete(inventoryMovement)
await db.delete(supplier)

console.log('✔ Database reset')

/**
 *  CREATE
 */

await db.insert(user).values(
	users.map((pass) => ({
		email: pass.email,
		name: pass.name,
		password: pass.hash,
		role: pass.role,
		idAdmin: pass.idUser
	}))
)
console.log('✔ Created users')
await db.insert(category).values(categorys)
console.log('✔ Created categorys')
await db.insert(supplier).values(suppliers)
console.log('✔ Created suppliers')
await db.insert(product).values(products)
console.log('✔ Created products')
await db.insert(inventoryMovement).values(inventoryMovements)

console.log('Database seeded successfully!')
