const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
   email: {
        type: String,
        required: true,
   },
   passwordHash: {
        type: String,
        required: true,
   },
   phone: {
        type: String,
        required: true,
   },
   isAdmain: {
        type: String,
        default: false,
   },
   street: {
        type: String,
        default: '',
   },
   appartment: {
        type: String,
        default: '',
   },
   zip: {
        type: String,
        default: ''
   },
   city: {
        type: String,
        default: '',
   },
   country:{
        type: String,
        default : ''
   },

})

userSchema.set('toJSON',{
    virtuals: true,
});
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
const User = mongoose.model('User' , userSchema);

module.exports = User;