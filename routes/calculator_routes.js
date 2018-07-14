bodyParser = require('body-parser').json();
const jwt = require('jsonwebtoken');

module.exports = function(app) {
    app.post('/calculator', bodyParser, function(req, res) {
        var token = req.body['token'];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        jwt.verify(token, req.app.get('token_key'), function(err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

            var body = req.body;
            var first = parseInt(body["first"]);
            var second = parseInt(body["second"]);
            var operation = body["operation"];
            var result;
            switch (operation) {
                case 'ADDITION':
                    result = first + second;
                    res.json({
                        status: "success",
                        result: result + ''
                    });
                    break;
                case 'SUBTRACTION':
                    result = first - second;
                    res.json({
                        status: "success",
                        result: result + ''
                    });
                    break;
                case 'MULTIPLICATION':
                    result = first * second;
                    res.json({
                        status: "success",
                        result: result + ''
                    });
                    break;
                case 'DIVISION':
                    result = first / second;
                    res.json({
                        status: "success",
                        result: result + ''
                    });
                    break;
                default:
                    res.json({
                        status: "error",
                        message: "Unknown operation",
                        data: null
                    });
            }
        });
    });
};