const mongoose = (require = require("mongoose"));
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  numOfScans: {
    type: Number,
    default: 0,
  },
  productPlan: {
    type: Number,
    default: -1,
  },
  stripeCustomerId: {
    type: String,
    default: null,
  },
  stripeSubscriptionPlanId: {
    type: String,
    default: null,
  },
  appointment: {
    type: Map,
    default: null,
  },
  scanCounter: {
    Type: Number,
    default: 0,
  },
});

// Create report model
const User = mongoose.model("user", UserSchema);

// Export model to use in other files
module.exports = User;
