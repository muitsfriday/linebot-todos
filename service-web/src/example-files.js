import fs from 'fs'
import path from 'path'

const read = filename => new Promise((rs, rj) => {
	fs.readFile(filename, 'utf8', (err, content) => {
		if (err !== null) {
			return rj(err)
		} else {
			return rs(content)
		}
	})
})

const main = async () => {
	try {
		const content = await read(__dirname + '/data.txt', 'utf8')
		let rows = content.split(/\r?\n/)

		for (let r of rows) {
			console.log(r.length)
		}
	} catch (err) {
		console.error(err)
	}
}


main()
