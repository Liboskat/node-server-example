bodyParser = require('body-parser').json();
const jwt = require('jsonwebtoken');
const eurInUsd = 1.17;
const rubInUsd = 0.016;
const gbpInUsd = 1.32;


module.exports = function(app) {
    app.post('/currency', bodyParser, function(req, res) {
        var token = req.body['token'];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        jwt.verify(token, req.app.get('token_key'), function(err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

            var body = req.body;
            var value = parseInt(body["value"]);
            var firstCurrency = body["first"];
            var secondCurrency = body["second"];
            var result;
            var error;

            if(firstCurrency === secondCurrency) {
                result = value;
                res.json({
                    status: "success",
                    result: result + ''
                });
            } else {
                switch (firstCurrency) {
                    case 'EUR':
                        value = value * eurInUsd;
                        break;
                    case 'RUB':
                        value = value * rubInUsd;
                        break;
                    case 'GBP':
                        value = value * gbpInUsd;
                        break;
                    case 'USD':
                        break;
                    default:
                        error = true;
                }
                if(error) {
                    res.json({
                        status: "error",
                        message: "Unknown currency",
                        data: null
                    });
                } else {
                    switch (secondCurrency) {
                        case 'EUR':
                            result = value / eurInUsd;
                            break;
                        case 'RUB':
                            result = value / rubInUsd;
                            break;
                        case 'GBP':
                            result = value / gbpInUsd;
                            break;
                        case 'USD':
                            result = value;
                            break;
                        default:
                            error = true;
                    }
                }
                if(error) {
                    res.json({
                        status: "error",
                        message: "Unknown currency",
                        data: null
                    });
                } else {
                    res.json({
                        status: "success",
                        result: result + ''
                    });
                }
            }
        });
    });
};