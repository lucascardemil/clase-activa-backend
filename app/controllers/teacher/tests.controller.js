const sql = require('../../config/db.js');

exports.getAllTest = async (req, res) => {
    const [rows] = await sql.query('SELECT * FROM tests')
    res.send(rows)
}

exports.getIdTest = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM tests WHERE id = ?', [id])
    res.send(rows);
}

exports.addTest = async (req, res) => {

    const name = req.body.name
    const percentage = req.body.percentage
    const standard = req.body.standard
    const instruction = req.body.instruction
    const objective = req.body.objective
    const subject = req.body.subject
    const user = req.body.user


    const [rows] = await sql.query('SELECT * FROM tests WHERE name = ?', [name])

    if (rows.length === 0) {

        const [rows] = await sql.query('INSERT INTO tests (name, percentage, standard, instruction, objective, subject, user) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, percentage, standard, instruction, objective, subject, user])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡Examen creado con exito!',
                test: {
                    id: rows.insertId,
                    name: name,
                    percentage: percentage,
                    standard: standard,
                    subject: subject
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear el examen!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: 'El examen ya está creado!',
        });
    }

}

exports.updateTest = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name_update;
    const condition = req.body.condition_test_update;
    const subject = req.body.subject_update;

    const [rows] = await sql.query('UPDATE tests SET name = ?, condition_test = ?, subject = ? WHERE id = ?', [name, condition, subject, id])
    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡Materia actualizada con exito!',
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al actualizar la materia!',
        });
    }

}


exports.deleteTest = async (req, res) => {
    const id = req.params.id;

    const [rows] = await sql.query('DELETE FROM tests WHERE id = ?', [id])
    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡Materia eliminada con exito!',
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al aliminar la materia!',
        });
    }
}