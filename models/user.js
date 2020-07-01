const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  encryptedPassword: { type: String, required: true },
  avatar_url: { type: String },
  bio: { type: String },
  role: {type: String, enum: ['Admin', 'Member'], default: 'Member'},
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: {
    type: Date
  }
});

// Update the updated_at field on save
userSchema.pre('save', (next) => {
  this.updated_at = Date.now()
  next()
})
userSchema.pre('drop', (next)=>{
  this.deleted_at = Date.now()
})
const User = mongoose.model('User', userSchema);
  // User.remove({}, (err)=>{
  //   console.log("removed!");
  // })
module.exports = {
  User
}