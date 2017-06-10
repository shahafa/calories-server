const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  userId: { type: String, index: true },
  date: Date,
  meal: String,
  calories: Number,
}, { timestamps: true });

MealSchema.statics.getMeals = async function (userId) {
  const meals = await this.find({ userId }).exec();
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
  const meal = await this.findOne({ id: mealId }).exec();
  if (!meal || meal.userId !== userId) {
    return false;
  }

  await meal.remove();
  return true;
};

MealSchema.statics.edit = async function (userId, meal) {
  await this.findOneAndUpdate({ userId, id: meal.id }, meal);

  return true;
};

module.exports = mongoose.model('Meal', MealSchema);
