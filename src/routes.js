import { Database } from "./Database.js"
import { buildRoutePath } from './utils/build-route-path.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = database.insert('tasks', {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: null
            })

            return res.writeHead(201).end()
        }
    },

    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search && {
                title: search,
                description: search,
                updated_at: new Date()
            }, null)

            return res.end(JSON.stringify(tasks))
        }
    },

    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!id) {
                return res.writeHead(404).end('ID é obrigatório')
            }

            const task = database.select('tasks', null, id)

            if (task) {
                const updatedTask = {
                    ...task,
                    title,
                    description,
                    updated_at: new Date()
                }

                database.update('tasks', id, updatedTask)
            } else {
                return res.writeHead(404).end()
            }

            return res.writeHead(204).end()
        }
    },

    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            if (!id) {
                return res.writeHead(404).end('ID é obrigatório')
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },

    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            if (!id) {
                return res.writeHead(404).end('ID é obrigatório')
            }

            const task = database.select('tasks', null, id)

            if (task) {
                const completedTask = {
                    ...task,
                    completed_at: new Date()
                }

                database.update('tasks', id, completedTask)
            } else {
                return res.writeHead(404).end()
            }

            return res.writeHead(204).end()
        }
    },
]