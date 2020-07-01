const mongoose = require('mongoose')
const Sequelize = require('sequelize')
require('dotenv').config()
//import the User module
const {User} = require('./user')
const {Author} = require('./author')
const {Book} = require('./book')
const {Genre} = require('./genre')
const {BookInstance} = require('./bookinstance')

const Mongo_Db_Url = `mongodb+srv://${process.env.username}:${process.env.password}@mylib-9bnr6.mongodb.net/${process.env.database}?retryWrites=true&w=majority`;

mongoose.connect( Mongo_Db_Url, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then((res) => console.log("mongoDb is connected"))
    .catch((err) => console.log("Error: mongoDb connection"))    


module.exports = {
    User,
    Author,
    Book,
    BookInstance, 
    Genre
}
        


