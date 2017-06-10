const chalk = require('chalk');
const jwt = require('express-jwt');
const { errorObject } = require('../lib/util');
const { ERROR_NO_PERMISSION } = require('../consts');
const usersController = require('../controllers/users');
const mealsController = require('../controllers/meals');
const settingsController = require('../controllers/settings');

const authenticate = jwt({ secret: process.env.JWT_SECRET });

const isUserManager = (req, res, next) => {
  if (req.user.user.role !== 'admin' && req.user.user.role !== 'userManager') {
    return res.status(403).send(errorObject(ERROR_NO_PERMISSION, 'no permission to perform operation'));
  }

  next();
};


function routesConfig(app) {
  app.post('/login', usersController.login);
  app.post('/signup', usersController.signup);

  app.get('/users', authenticate, isUserManager, usersController.getUsers);
  app.put('/users', authenticate, isUserManager, usersController.updateUsersRole);
  app.delete('/users/:id', authenticate, isUserManager, usersController.deleteUser);

  app.get('/meals', authenticate, mealsController.getAll);
  app.post('/meals', authenticate, mealsController.add);
  app.put('/meals/:id', authenticate, mealsController.edit);
  app.delete('/meals/:id', authenticate, mealsController.deleteMeal);

  app.get('/settings', authenticate, settingsController.getSettings);
  app.put('/settings', authenticate, settingsController.setSettings);

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
