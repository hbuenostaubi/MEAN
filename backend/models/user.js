const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},  //unique is not a validator
  //use npm i --save mongoose-unique-validator and will add to pkg.json
  password: {type:String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports= mongoose.model('User', userSchema);  // mongo will call
