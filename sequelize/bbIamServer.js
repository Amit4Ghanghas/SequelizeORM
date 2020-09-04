
require('dotenv').config();
const app = require('./app/app');
var port = process.env.PORT;

app.listen(port,function(){
    console.log('Server started on port: ' + port);
});