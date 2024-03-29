const bcrypt = require("bcrypt")
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
    }, 
    password: {
        type: String,
    }
})



//password hash middleware
UserSchema.pre('save', function save(next) {
    const user = this
    if(!user.isModified('password')) {
        return next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err) { return next(err) }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) {return next (err) }
            user.password = hash
            next()
        })
    })
})

//Helper method for validating user's password
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model("User", UserSchema, "Users")