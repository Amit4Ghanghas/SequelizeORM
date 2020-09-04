const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger/swagger');
const passport = require('passport');
const compression = require('compression');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var expressWinston = require('express-winston');
var winston = require('winston');
require('./config/sequelize');

const authRoutes=require('../app/controllers/authController');
const rolesRoutes=require('../app/controllers/rolesController');
const featuresRoutes=require('../app/controllers/featuresController');
const usersRoutes=require('../app/controllers/userController');
const auths = require('basic-auth');
const userRoleRoutes=require('../app/controllers/userRoleController');
const introspectRoutes=require('../app/controllers/instrospectController');
const resetPasswordRoutes=require('../app/controllers/resetPasswordController');
// swagger

var options = {
    explorer: false,
    swaggerOptions: {
        authAction :{ Bearer: {name: "Bearer", schema: {type: "apiKey", in: "header", name: "Authorization" }, value: "Bearer <JWT>" } }
    },   
    customCss: '.swagger-ui .topbar { display: none }',
    // customCssUrl: '/custom.css'
};

app.use('/api-docs', (req, res, next) => {
    let user = auths(req);

    if (user === undefined || user['name'] !== process.env.SWAGGER_USER || user['pass'] !==  process.env.SWAGGER_PASSWORD) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Node"');
        res.end('Unauthorized');
    } else {
        next();
    }
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument.sw, options));

// compress all responses
app.use(compression());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Passport
app.use(passport.initialize());
require('../app/config/passport-config')(passport);

// Handling CROS origin error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
	
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return next();
});

//////////////////LOGGER/////////////////////////////////

//SUCESS
app.use(expressWinston.logger(
    {
        skip: function (req, res) {
            if (res.statusCode >= 100 && res.statusCode < 400) {
                level = "info";
                return false;

            }
            else if (res.statusCode >= 400) {
                level = "error";
                return true;
            }
            // if (res.statusCode == 401 || res.statusCode == 403) {
            //     level = "critical";
            //     return false;
            // }
            else if (req.path === "/v1" && level === "info") {
                level = "warn";
                return true;

            }
            // return false; 
        },
        level: function (req, res) {
            var level = "";
            if (res.statusCode >= 100) { level = "info"; }
            if (res.statusCode >= 400) { level = "error"; }
            if (res.statusCode >= 500) { level = "error"; }
            // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
            if (res.statusCode == 401 || res.statusCode == 403) { level = "critical"; }
            // No one should be using the old path, so always warn for those
            if (req.path === "/v1" && level === "info") { level = "warn"; }
            return level;
        },
        metaField: null, //this causes the metadata to be stored at the root of the log entry
        responseField: null, // this prevents the response from being included in the metadata (including body and status code)
        requestWhitelist: ['headers', 'query', 'body', 'params'],  //these are not included in the standard StackDriver httpRequest
        dynamicMeta: (req, res) => {
            const httpRequest = {}
            const meta = {}
            if (req) {
                meta.httpRequest = httpRequest
                httpRequest.requestMethod = req.method
                httpRequest.requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
                httpRequest.protocol = `HTTP/${req.httpVersion}`
                // httpRequest.remoteIp = req.ip // this includes both ipv6 and ipv4 addresses separated by ':'
                httpRequest.remoteIp = req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip   // just ipv4
                httpRequest.requestSize = req.socket.bytesRead
                httpRequest.userAgent = req.get('User-Agent')
                httpRequest.referrer = req.get('Referrer')
            }

            if (res) {
                meta.httpRequest = httpRequest
                httpRequest.status = res.statusCode
                httpRequest.latency = {
                    seconds: Math.floor(res.responseTime / 1000),
                    nanos: (res.responseTime % 1000) * 1000000
                }
                if (res.body) {
                    if (typeof res.body === 'object') {
                        httpRequest.responseSize = JSON.stringify(res.body).length
                    } else if (typeof res.body === 'string') {
                        httpRequest.responseSize = res.body.length
                    }
                }
            }
            return meta
        },
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
                // level: "error"
            }),
            // new (winston.transports.File)({
            //     filename: 'error.log',
            //     level: "error"
            // }),
            // new (winston.transports.File)({
            //     filename: 'application.log',
            //     level: "info"
            // })
        ]

    }
));


// ERROR
app.use(expressWinston.logger(
    {
        skip: function (req, res) {
            if (res.statusCode >= 100 && res.statusCode < 400) {
                level = "info";
                return true;

            }
            else if (res.statusCode >= 400) {
                level = "error";
                return false;
            }
            // if (res.statusCode == 401 || res.statusCode == 403) {
            //     level = "critical";
            //     return false;
            // }
            else if (req.path === "/v1" && level === "info") {
                level = "warn";
                return false;

            }
            // return false; 
        },
        level: function (req, res) {
            var level = "";
            if (res.statusCode >= 100) { level = "info"; }
            if (res.statusCode >= 400) { level = "error"; }
            if (res.statusCode >= 500) { level = "error"; }
            // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
            if (res.statusCode == 401 || res.statusCode == 403) { level = "critical"; }
            // No one should be using the old path, so always warn for those
            if (req.path === "/v1" && level === "info") { level = "warn"; }
            return level;
        },
        metaField: null, //this causes the metadata to be stored at the root of the log entry
        responseField: null, // this prevents the response from being included in the metadata (including body and status code)
        requestWhitelist: ['headers', 'query', 'body', 'params'],  //these are not included in the standard StackDriver httpRequest
        responseWhitelist: ['body'],
        dynamicMeta: (req, res) => {
            const httpRequest = {}
            const meta = {}
            if (req) {
                meta.httpRequest = httpRequest
                httpRequest.requestMethod = req.method
                httpRequest.requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
                httpRequest.protocol = `HTTP/${req.httpVersion}`
                // httpRequest.remoteIp = req.ip // this includes both ipv6 and ipv4 addresses separated by ':'
                httpRequest.remoteIp = req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip   // just ipv4
                httpRequest.requestSize = req.socket.bytesRead
                httpRequest.userAgent = req.get('User-Agent')
                httpRequest.referrer = req.get('Referrer')
            }

            if (res) {
                meta.httpRequest = httpRequest
                httpRequest.status = res.statusCode
                httpRequest.latency = {
                    seconds: Math.floor(res.responseTime / 1000),
                    nanos: (res.responseTime % 1000) * 1000000
                }
                if (res.body) {
                    if (typeof res.body === 'object') {
                        httpRequest.responseSize = JSON.stringify(res.body).length
                    } else if (typeof res.body === 'string') {
                        httpRequest.responseSize = res.body.length
                    }
                }
            }
            return meta
        },
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
                // level: "error"
            }),
            // new (winston.transports.File)({
            //     filename: 'error.log',
            //     level: "error"
            // }),
            // new (winston.transports.File)({
            //     filename: 'application.log',
            //     level: "info"
            // })
        ]

    }
));


/////////////////////////////////////////////////////////
app.use('/auth', authRoutes);
app.use('/resetPassword', resetPasswordRoutes);
app.use('/roles', passport.authenticate('jwt', {session:false}), rolesRoutes);
app.use('/features', passport.authenticate('jwt', {session:false}), featuresRoutes);
app.use('/userRole', passport.authenticate('jwt', {session:false}), userRoleRoutes);
app.use('/introspect', passport.authenticate('jwt', {session:false}), introspectRoutes);
app.use('/users', passport.authenticate('jwt', {session:false}), usersRoutes);


// Ignore favicon.ico 
function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({nope: true});
    } else {
        next();
    }
}
app.use(ignoreFavicon);

// Handling unidentified APIs
app.use((req, res, next) => {
    // loggerPath.apm?loggerPath.apm.captureError(error):"";
    const error = new Error('Not found');
    error.status(404);
    //next(error);
});

// Handling server errors
app.use((error, req, res, next) => {
    // loggerPath.apm?loggerPath.apm.captureError(error):"";
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;