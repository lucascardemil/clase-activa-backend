const mysql2 = require('mysql2/promise');

const connection = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clase_activa_2023'
});

// const connection = mysql2.createPool({
//     host: 'localhost',
//     user: 'claseac1_2023',
//     password: 'sbr+iLy2h{-b',
//     database: 'claseac1_2023'
// });

module.exports = connection;