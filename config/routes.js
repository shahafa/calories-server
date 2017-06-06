const chalk = require('chalk');
const jwt = require('express-jwt');
const usersController = require('../controllers/users');
const mealsController = require('../controllers/meals');

const authenticate = jwt({ secret: process.env.JWT_SECRET });

function routesConfig(app) {
  app.post('/login', usersController.login);
  app.post('/signup', usersController.signup);

  app.get('/meals', authenticate, mealsController.getAll);
  app.post('/meals', authenticate, mealsController.add);
  app.put('/meals/:id', authenticate, mealsController.edit);
  app.delete('/meals/:id', authenticate, mealsController.deleteMeal);

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
