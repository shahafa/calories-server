const chalk = require('chalk');
const jwt = require('express-jwt');
const userController = require('../controllers/user');

const authenticate = jwt({ secret: process.env.JWT_SECRET });

function routesConfig(app) {
  app.get('/test', authenticate, (req, res) => { res.send('Hello World!'); });

  app.post('/login', userController.login);
  app.post('/signup', userController.signup);

  console.log('%s Routes configured successfully', chalk.green('✓'));
}

module.exports = routesConfig;
