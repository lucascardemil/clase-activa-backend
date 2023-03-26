const sql = require('../../config/db.js');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

exports.getAllUsers = async (req, res) => {
    const [rows] = await sql.query('SELECT * FROM users')
    res.json(rows)
}

exports.getUserId = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM users WHERE id = ?', [id])
    res.json({ rows })
}

exports.signIn = async (req, res) => {
    const rut = req.body.rut;
    const password = md5(req.body.password);
    const rut_format = rut.replace(/[^0-9kK]+/g, '').toUpperCase();

    const [rows] = await sql.query('SELECT * FROM users WHERE rut = ? AND password = ?', [rut_format, password])
    if (rows.length > 0) {
        const token = jwt.sign(
            { name: rows[0].name, id: rows[0].id, role: rows[0].role },
            process.env.TOKEN_KEY, { expiresIn: '2h', });

        res.json({
            status: 'success',
            message: '¡Usuario ingresado con exito!',
            role: rows[0].role,
            token: token
        });
    } else {
        res.json({
            message: '¡Rut o contraseña incorrecta!'
        });
    }
}


exports.signUp = async (req, res) => {
    const role = req.body.role;
    const rut = req.body.rut;
    const name = req.body.name;
    const email = req.body.email;
    const password = md5(req.body.password);

    const rut_format = rut.replace(/[^0-9kK]+/g, '').toUpperCase();

    const [rows] = await sql.query('SELECT * FROM users WHERE rut = ? OR email = ?', [rut_format, email])
    if (rows.length == 0) {
        const [rows] = await sql.query('INSERT INTO users (role, rut, name, email, password) VALUES (?, ?, ?, ?, ?)', [role, rut_format, name, email, password])
        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡Usuario creado con exito!',
            });
        } else {
            res.json({
                status: 'error',
                message: 'Error al crear el usuario!',
            });
        }
    } else {
        res.json({
            status: 'error',
            message: 'Error el usuario ya existe!',
        });
    }
}

exports.updateInfoPerson = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const last_name = req.body.last_name;
    const mothers_last_name = req.body.mothers_last_name;
    const email = req.body.email;
    const telefono = req.body.telefono;

    const [rows] = await sql.query('UPDATE users SET name = ?, last_name = ?, mothers_last_name = ?, email = ?, telefono = ? WHERE id = ?', [name, last_name, mothers_last_name, email, telefono, id])
    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡Usuario actualizado con exito!',
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al actualizar el usuario!',
        });

    }
}

exports.changePasswordUser = async (req, res) => {
    const id = req.body.id;
    const password = md5(req.body.password);

    const [rows] = await sql.query('UPDATE users SET password = ? WHERE id = ?', [password, id])
    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡Contraseña actualizada con exito!',
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al actualizar la contraseña!',
        });

    }
}

