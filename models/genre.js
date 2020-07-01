var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: {type:String, min:3, max:100},
    populatedField: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', 
        autopopulate: true
    }
});

//Virtual url
GenreSchema.
virtual('url')
.get(function(){
    return "/catalog/genre/" + this._id;
});

const Genre = mongoose.model('Genre', GenreSchema);
module.exports = {
    Genre
}