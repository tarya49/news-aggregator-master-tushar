var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    fullName: {
        type: String, 
        required: [true, "Fullname not provided"]
    }, 
    email: {
        type: String,
        required: [true, "Email not provided"],
        lowercase: true,
        trim: true, 
        unique: [true, "Email already exists in the database"],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Not a valid email"
        }  
    },
    preferences: {
        type: [String], 
        default: ["sports"],
        required: [true, "preferences not provided"],
    },
    password: {
        type: String, 
        required: [true, "Password not provided"],
    },  
    created: {
        type: Date,
        default: Date.now
    }
}, { collection: 'data' });

module.exports = mongoose.model("User", userSchema);