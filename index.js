require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
const Person = require('./models/person')
const personFormat = (person) => {
  return {
    name: person.name,
    number:person.number
  }
}
app.use(express.static('build'))
app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
	  res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info',(req, res, next) => {
  Person.countDocuments()
    .then(result => {
      const message = `<p>Phonebook has info for ${result} people</p><p>${new Date()}</p>`;
      res.send(message).end();
    })
    .catch(error => next(error));
})

app.get('/api/persons/:id',(req, res, next) => {
	Person.findById(req.params.id).then(foundPerson => {
		if(!foundPerson){
		res.end('person not found')
		}
		else{
			res.json(foundPerson.toJSON())
		}
	}).catch(error => next(error))
	/*const id = Number(req.params.id)
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
	}*/
})

app.delete('/api/persons/:id',(req, res, next) => {
	Person.findByIdAndRemove(req.params.id).
	then(() => res.status(204).end()).
	catch(error => next(error))
})

app.post('/api/persons',(req, res, next) => {
	const body = req.body
	if(!body.name){
		res.status(400).json({
			error: 'name not available'
		})
	}
	if(!body.number){
		res.status(400).json({
			error: 'number not available'
		})
	}

	const newperson = new Person({
		name: body.name,
		number: body.number
	})
	newperson.save().then(savedPerson => {
		res.json(savedPerson.toJSON())
	}).catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})