// const http = require('node:http') // commonjs - sistema de modulos de node
// const http import 'node:http' ecmascript modules - sistema de modulos de ecmasciprt
// const crypto = require('node:crypto')
const express = require('express')
const logger = require('./loggerMiddleware.js')
const cors = require('cors')

const app = express()

// npm install express

app.use(cors()) // por defecto cualquier origen utilize la api
app.use(express.json()) // middleware body parser

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30',
    important: true,
    categories: ['sports', 'hobby']
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30',
    important: false
  }
]

// cada vez que llegue una request (petición) ejecuta el callback
// const app = http.createServer((request, response) => {
//   // response objeto que devuelve la información que quieras
//   // writeHead cabecera
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  // :id puede ser 1, 2, 3, etc, o lo que sea
  // params guarda todos los objetos de la ruta dinámica

  const id = Number(request.params.id) // lo ingresado en la ruta se obtiene como string
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes/', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' ? note.important : false
    // id: crypto.randomUUID
  }

  notes = [...notes, newNote] // crear nuevo array

  // devolver la nueva nota que se ha creado
  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
