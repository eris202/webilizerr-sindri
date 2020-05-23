const mongoose = (require = require("mongoose"));
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: false
    },
    stripeCustomerId: {
        type: String,
        default: null
    },
    stripeSubscriptionPlanId:{
        type: String,
        default: null
    },
    appointment: {
        type: Map,
        default: null
    }
});
  
  
// Create report model
const User = mongoose.model("user", UserSchema);

// Export model to use in other files
module.exports = User;
  