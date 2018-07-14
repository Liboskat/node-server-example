const calculatorRoutes = require('./calculator_routes');
const loginRoutes = require('./auth_routes');
const currencyRoutes = require('./currency_routes');

module.exports = function(app) {
    calculatorRoutes(app);
    loginRoutes(app);
    currencyRoutes(app);
};
