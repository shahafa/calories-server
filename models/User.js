const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  email: { type: String, index: { unique: true } },
  password: String,
  role: { type: String, default: 'user' },
}, { timestamps: true });


/**
 * Password hash middleware.
 */
UserSchema.pre('save', function save(next) {
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
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

UserSchema.statics.getUsers = async function () {
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

UserSchema.statics.updateUserRole = async function (userId, role) {
  await this.findOneAndUpdate({ id: userId }, { role });

  return true;
};

UserSchema.statics.delete = async function (userId) {
  const user = await this.findOne({ id: userId }).exec();
  if (!user) {
    return false;
  }

  await user.remove();
  return true;
};

module.exports = mongoose.model('User', UserSchema);
