var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema ({
    first_name: {type: String, required: true, max:100},
    family_name: {type: String, required:true, max:100},
    date_of_birth : Date,
    date_of_death :Date
});

//Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function (){
    var fullname = "";
    if (this.first_name && this.family_name){
        fullname = this.family_name +", " + this.first_name;
    }
    if(!this.first_name || !this.family_name)
    {
        fullname ="";
    }

    return fullname;
});

//Virtual for author lifespan
AuthorSchema.
virtual('lifespan')
.get(function(){
    if(this.date_of_death){
    return (this.date_of_death.getYear() - this.date_of_birth.getYear()) };
});

AuthorSchema.virtual('date_of_birth_formatted')
.get(function(){
    return this.date_of_birth ? moment(this. date_of_birth).format('MMMM, D YYYY') : '';
});  

AuthorSchema.virtual('date_of_death_formatted')
.get(function(){
    return moment(this. date_of_death).format('MMMM, D YYYY');
});


//Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function(){
    return '/catalog/author/' + this._id;
});

const Author = mongoose.model('Author', AuthorSchema);
//EXport module
module.exports = {
    Author
}