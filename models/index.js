const mongoose = require('mongoose')

const bcrypt =   require('bcrypt')
const Sequelize = require('sequelize')
require('dotenv').config()
//import the User module
var {User} = require('./user')
const {Author} = require('./author')
const {Book} = require('./book')
const {Genre} = require('./genre')
const {BookInstance} = require('./bookinstance')

const Mongo_Db_Url = `mongodb+srv://${process.env.username}:${process.env.password}@mylib-9bnr6.mongodb.net/${process.env.database}?retryWrites=true&w=majority`;

mongoose.connect( Mongo_Db_Url, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then((database) => {
        console.log("mongoDb is connected", database);
        //add default user details to login atleast once
        let userInstance;
        bcrypt.hash('password', 10)
            .then((pass) => {
                userInstance = new User({
                    name: 'name', 
                    email: 'example1@email.com', 
                    role: 'Admin', 
                    encryptedPassword: pass
                });

                userInstance.save(function(err){
                    
                    if (err){
                        console.log("Error is occured. ", err);
                        throw err;
                    }
                    console.log("")
                });
            })
            .catch((err) => {
                console.log("Error: user's entry");
                throw err;
            })
        
        
    })
    .catch((err) => console.log("Error: mongoDb connection", err.message))

module.exports = {
    User,
    Author,
    Book,
    BookInstance, 
    Genre
}
        


