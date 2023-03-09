const sql = require('../../config/db.js');


exports.getAllLevels = async (req, res) => {
    const [rows] = await sql.query('SELECT * FROM levels')
    res.send(rows)
}

exports.getIdLevel = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM levels WHERE id = ?', [id])
    res.send(rows)
}

exports.addLevel = async (req, res) => {
    const name = req.body.name;
    const condition = req.body.condition;

    const [rows] = await sql.query('SELECT * FROM levels WHERE name = ?', [name])

    if (rows.length === 0) {
        const [rows] = await sql.query('INSERT INTO levels (name, condition_level) VALUES (?, ?)', [name, condition])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡Nivel creado con exito!',
                level: {
                    id: rows.insertId,
                    name: name,
                    condition: condition,
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear el nivel!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: '¡El nivel ya está creado!',
        });
    }


}

exports.updateLevel = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name_update;
    const condition = req.body.condition_update;

    const [rows] = await sql.query('UPDATE levels SET name = ?, condition_level = ? WHERE id = ?', [name, condition, id])

    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡El nivel fue actualizado con exito!',
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al actualizar el nivel!',
        });
    }

}


exports.deleteLevel = async (req, res) => {
    const id = req.params.id;

    const [rows] = await sql.query('DELETE FROM levels WHERE id = ?', [id])

    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡El nivel fue eliminado con exito!'
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al eliminar el nivel!',
        });
    }
}