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

  const meals = await Meal.getMeals(userId);
  return res.json({
    code: SUCCESS,
    data: {
      meals,
    },
  });
};

const edit = async (req, res) => {
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

  await Meal.delete(userId, req.body.meal.id);

  const meal = Object.assign({ userId }, req.body.meal);
  await Meal.add(meal);

  const meals = await Meal.getMeals(userId);
  return res.json({
    code: SUCCESS,
    data: {
      meals,
    },
  });
};

const deleteMeal = async (req, res) => {
  const userId = req.user.user.id;
  const mealId = req.params.id;

  await Meal.delete(userId, mealId);

  const meals = await Meal.getMeals(userId);
  return res.json({
    code: SUCCESS,
    data: {
      meals,
    },
  });
};

module.exports = {
  getAll,
  add,
  edit,
  deleteMeal,
};
