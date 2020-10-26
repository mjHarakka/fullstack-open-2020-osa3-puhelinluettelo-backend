const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password for the database, name and number of the object to be saved as an argument')
	process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://mikko:${password}@cluster0.duudm.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
	name: String,
	number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
	name: name,
	number: number,
})

if (process.argv.length == 3) {
	console.log('Persons: ')
	Person.find({}).then(result => {
		result.forEach( person => {
			console.log(person)
		})
		mongoose.connection.close()
	})
} else {
	person.save().then(response => {
		console.log('person saved!')
		mongoose.connection.close()
	})

}
