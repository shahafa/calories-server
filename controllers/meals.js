const Meal = require('../models/Meal');
const {
  SUCCESS,
  ERROR_VALIDATION_FAILED,
} = require('../consts');

const getAll = async (req, res) => {
  const userId = req.user.user.id;

  const meals = await Meal.getMeals(userId);

  return res.json({
    status: SUCCESS,
    data: {
      meals,
    },
  });
};

const add = async (req, res) => {
  req.assert('meal', 'Meal object is missing').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      code: ERROR_VALIDATION_FAILED,
      message: 'Validation Failed',
      errors,
    });
  }

  const userId = req.user.user.id;

  const meal = Object.assign({ userId }, req.body.meal);
  await Meal.add(meal);

  return res.json({
    code: SUCCESS,
    data: {
      meal,
    },
  });
};

const deleteMeal = async (req, res) => {
  const userId = req.user.user.id;
  const mealId = req.params.id;

  await Meal.delete(userId, mealId);

  return res.json({
    code: SUCCESS,
  });
};

module.exports = {
  getAll,
  add,
  deleteMeal,
};
