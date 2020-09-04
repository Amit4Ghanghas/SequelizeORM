require('dotenv').config();
const {start}=require('./app/config/initializeDB')
const mysql = require('mysql2/promise');

const dbName = process.env.DB_NAME || "demo1";

mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
}).then(connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`)
    .then((res) => {
        console.info("Database create or successfully checked");
        start()
        .then( a=>{
            process.exit(0);
        })
        .catch(error=>{ console.log("Error: ", error); });
    })
    .catch(error=>{ console.log("Error: ", error); });
})
.catch(error=>{ console.log("Error: ", error); });