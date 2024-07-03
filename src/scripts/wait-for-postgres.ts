import { $ } from 'bun'

async function checkPostgres() {
	const { stdout, stderr, exitCode } =
		await $`docker exec postgres-dev pg_isready --host localhost`.nothrow().quiet()
	const output = await new Response(stdout).text()

	if (exitCode !== 0) {
		process.stdout.write('.')
		await checkPostgres()
		return
	}

	if (output.search('accepting connections') === -1) {
		process.stdout.write('.')
		await checkPostgres()
		return
	}

	console.log('\n PostGreSQL está pronto e aceitando conexões! \n')
}

process.stdout.write('\n\n Aguardando PostGreSQL Aceitar conexões')
await checkPostgres()
