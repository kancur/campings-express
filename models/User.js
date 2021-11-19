const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true],
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
    },
    favorite_camps: [{ type: Schema.Types.ObjectId, ref: "Camping" }],
  },
  {
    strict: false,
    collection: 'users',
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({ email: 'This email address is already used.' });
  } else {
    next(error);
  }
});

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('Incorrect password')
  }
  throw Error('Incorrect email');
};

module.exports = mongoose.model('User', userSchema);
