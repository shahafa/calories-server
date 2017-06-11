const mongoose = require('mongoose');
const User = require('./User');

const MealSchema = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  userId: { type: String, index: true },
  userEmail: { type: String, index: true },
  date: Date,
  meal: String,
  calories: Number,
}, { timestamps: true });

MealSchema.statics.getMeals = async function (userId) {
  const isAdmin = await User.isAdmin(userId);

  const meals = await this.find(isAdmin ? {} : { userId }).exec();
  if (!meals) {
    return false;
  }

  return meals;
};

MealSchema.statics.add = async function (meal) {
  const newMeal = new this(meal);
  await newMeal.save();
};

MealSchema.statics.delete = async function (userId, mealId) {
  const isAdmin = await User.isAdmin(userId);

  const meal = await this.findOne(isAdmin ? { id: mealId } : { userId, id: mealId }).exec();
  if (!meal) {
    return false;
  }

  await meal.remove();
  return true;
};

MealSchema.statics.edit = async function (userId, meal) {
  const isAdmin = await User.isAdmin(userId);

  await this.findOneAndUpdate(isAdmin ? { id: meal.id } : { userId, id: meal.id }, meal);

  return true;
};

module.exports = mongoose.model('Meal', MealSchema);
