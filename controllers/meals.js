const Meal = require('../models/Meal');
const {
  SUCCESS,
  ERROR_VALIDATION_FAILED,
  ERROR_SOMETHING_BAD_HAPPEND,
} = require('../consts');

const getAll = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const meals = await Meal.getMeals(userId);

    return res.json({
      status: SUCCESS,
      data: {
        meals,
      },
    });
  } catch (err) {
    return res.status(500).send({
      code: ERROR_SOMETHING_BAD_HAPPEND,
      message: 'Something bad happened :(',
      errors: err,
    });
  }
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

  try {
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
  } catch (err) {
    return res.status(500).send({
      code: ERROR_SOMETHING_BAD_HAPPEND,
      message: 'Something bad happened :(',
      errors: err,
    });
  }
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

  try {
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
  } catch (err) {
    return res.status(500).send({
      code: ERROR_SOMETHING_BAD_HAPPEND,
      message: 'Something bad happened :(',
      errors: err,
    });
  }
};

const deleteMeal = async (req, res) => {
  const userId = req.user.user.id;
  const mealId = req.params.id;

  try {
    await Meal.delete(userId, mealId);

    const meals = await Meal.getMeals(userId);
    return res.json({
      code: SUCCESS,
      data: {
        meals,
      },
    });
  } catch (err) {
    return res.status(500).send({
      code: ERROR_SOMETHING_BAD_HAPPEND,
      message: 'Something bad happened :(',
      errors: err,
    });
  }
};

module.exports = {
  getAll,
  add,
  edit,
  deleteMeal,
};
