const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  email: { type: String, index: { unique: true } },
  password: String,
  role: { type: String, default: 'user' },
}, { timestamps: true });


/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;

  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) { return next(hashErr); }

      user.password = hash;
      return next();
    });
  });
});


/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.statics.getUsers = async function () {
  const users = await this.find().exec();
  if (!users) {
    return false;
  }

  return users.map(user => ({
    id: user.id,
    email: user.email,
    role: user.role,
  }));
};

userSchema.statics.updateUserRole = async function (userId, role) {
  await this.findOneAndUpdate({ id: userId }, { role });

  return true;
};

module.exports = mongoose.model('User', userSchema);
