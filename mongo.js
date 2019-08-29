const mongoose = require('mongoose')
const Person = require('./models/person')

const password = process.argv[2]

const url = 'mongodb+srv://harshrd:'+password+'@phonebook-1a8ze.mongodb.net/persondb?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true })

if ( process.argv.length===3 ) {
	console.log('phonebook:')
  Person.find({}).then(res => {
	  res.forEach(person => console.log(person.name + ' ' + person.number))
	  mongoose.connection.close()
  })
}

if(process.argv.length===5){
const person = new Person({
  name: process.argv[3].toString(),
  number: process.argv[4].toString()
})

person.save().then(response => {
  console.log('added ' + process.argv[3] + ' number ' + process.argv[4] + ' to phonebook')
  mongoose.connection.close()
})
}