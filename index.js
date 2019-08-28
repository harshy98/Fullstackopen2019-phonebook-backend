const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Socrates",
      "number": "00-1100-11",
      "id": 3
    },
    {
      "name": "Nikola Tesla",
      "number": "44-11-2323431",
      "id": 4
    }
  ]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info',(req, res) => {
  res.send('<p>Phonebook has info for ' + persons.length + ' people</p>' + '<p>' + new Date() + '</p>')
})

app.get('/api/persons/:id',(req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)
	if(person){
		const personData = {
			name: person.name,
			number: person.number,
			id: person.id
		}
		res.json(personData)
	}
	else{
		res.end('Person not found')
	}
})

app.delete('/api/persons/:id',(req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)
	res.status(204).end()
})

app.post('/api/persons',(req, res) => {
	const body = req.body
	if(!body){
		res.status(400).json({
			error: 'content not available'
		})
	}
	const newperson = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random()*Math.floor(100000000000000000000))
	}
	const dupliPerson = persons.find(person => person.name === body.name)
	if(!newperson.name || !newperson.number){
		res.status(400).json({error:'name or number is missing'})
	}
	else if(dupliPerson){
		res.status(400).json({error:'person already added'})
	}
	persons = persons.concat(newperson)
	res.json(newperson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})