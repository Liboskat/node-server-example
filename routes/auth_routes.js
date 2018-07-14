bodyParser = require('body-parser').json();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CONNECTION_STRING = 'postgresql://postgres:ugandatunis@localhost:5432/postgres';
const Client = require('pg-native');
const client = new Client();

const ADD_USER = 'INSERT INTO users(login, hashed_password) VALUES($1, $2) RETURNING *';
const FIND_BY_LOGIN = 'SELECT hashed_password FROM users WHERE login = $1';

module.exports = function(app) {
    app.post('/login', bodyParser, function(req, res) {
        const body = req.body;
        const login = body["login"];
        const password = body["password"];

        if(login === "" || password === "") {
            sendError(res, 'fields are empty')
        }

        client.connectSync(CONNECTION_STRING);
        let rows = client.querySync(FIND_BY_LOGIN, [login]);

        if(rows.length === 0) {
            sendError(res, 'login/password is not correct');
        } else {
            let hashed_password = rows[0]['hashed_password'];
            if(bcrypt.compareSync(password, hashed_password)) {
                const token = jwt.sign({id: login}, req.app.get('token_key'), {expiresIn: '24h'});
                res.json({
                    auth: true,
                    token: token,
                    status: 'success'
                });
            } else {
                sendError(res, 'login/password is not correct');
            }
        }
    });

    app.post('/signup', bodyParser, function (req, res) {
        const user = req.body;
        const login = user["login"];
        const password = user["password"];

        if(login === "" || password === "") {
            sendError(res, 'fields are empty')
        }

        client.connectSync(CONNECTION_STRING);
        let rows = client.querySync(FIND_BY_LOGIN, [login]);

        if(rows.length > 0) {
            sendError(res, 'User has already registered');
        } else {
            client.querySync(ADD_USER, [login, bcrypt.hashSync(password, 10)]);
            res.json({
                status: "success",
                message: "Successfully registered"
            });
        }
    });

    function sendError(res, err) {
        res.json({
            status: "error",
            message: err
        });
    }
};