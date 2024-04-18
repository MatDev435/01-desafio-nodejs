import fs from 'node:fs'
import { parse } from 'csv'

const csvPath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
    delimiter: ',',
    fromLine: 2,
    skipEmptyLines: true
})

async function readCsvFile() {
    const lines = stream.pipe(csvParse)

    for await (const line of lines) {
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        })
    }
}

readCsvFile()