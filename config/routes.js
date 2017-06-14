const chalk = require('chalk');
const jwt = require('express-jwt');
const path = require('path');
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
  app.post('/v1/login', usersController.login);
  app.post('/v1/signup', usersController.signup);

  app.get('/v1/users', authenticate, isUserManager, usersController.getUsers);
  app.put('/v1/users', authenticate, isUserManager, usersController.updateUsersRole);
  app.delete('/v1/users/:id', authenticate, isUserManager, usersController.deleteUser);

  app.get('/v1/meals', authenticate, mealsController.getAll);
  app.post('/v1/meals', authenticate, mealsController.add);
  app.put('/v1/meals/:id', authenticate, mealsController.edit);
  app.delete('/v1/meals/:id', authenticate, mealsController.deleteMeal);

  app.get('/v1/settings', authenticate, settingsController.getSettings);
  app.put('/v1/settings', authenticate, settingsController.setSettings);

  app.get('/*', (req, res) => { res.sendFile(path.join(__dirname, 'build', 'index.html')); });

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
