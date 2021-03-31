const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    Date:{
        type: Date,
        default: Date.now
    }

});

UserSchema.pre('save',  (next) => {
    if (this.password) {
        const salt =  bcrypt.genSaltSync(10)
        this.password =  bcrypt.hashSync(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User',UserSchema);