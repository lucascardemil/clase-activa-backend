const sql = require('../../config/db.js');

exports.getAllThemes = async (req, res) => {
    const [rows] = await sql.query('SELECT themes.name as name, themes.condition_theme as condition_theme, themes.id as id, levels.name as level_name, courses.name as course_name, subjects.name as subject_name, levels.condition_level as condition_level, subjects.condition_subject as condition_subject, courses.condition_course as condition_course FROM themes INNER JOIN subjects ON themes.subject = subjects.id INNER JOIN courses ON subjects.course = courses.id INNER JOIN levels ON courses.level = levels.id')
    res.json(rows)
}

exports.getIdTheme = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT themes.name as name, themes.condition_theme as condition_theme, themes.id as id, levels.id as level_id, courses.id as course_id, subjects.id as subject_id FROM themes INNER JOIN subjects ON themes.subject = subjects.id INNER JOIN courses ON subjects.course = courses.id INNER JOIN levels ON courses.level = levels.id WHERE themes.id = ?', [id])
    res.json(rows);
}

exports.getThemeForSubject = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM themes WHERE subject = ? AND condition_theme = 1', [id])
    res.json(rows);
}



exports.addTheme = async (req, res) => {

    const name = req.body.name
    const condition_theme = req.body.condition_theme
    const subject = req.body.subject


    const [rows] = await sql.query('SELECT * FROM themes WHERE name = ?', [name])

    if (rows.length === 0) {

        const [rows] = await sql.query('INSERT INTO themes (name, condition_theme, subject) VALUES (?, ?, ?)', [name, condition_theme, subject])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡Materia creado con exito!',
                level: {
                    id: rows.insertId,
                    name: name,
                    condition: condition_theme,
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear la materia!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: 'La materia ya está creado!',
        });
    }

}

exports.updateTheme = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name_update;
    const condition = req.body.condition_theme_update;
    const subject = req.body.subject_update;

    const [rows] = await sql.query('UPDATE themes SET name = ?, condition_theme = ?, subject = ? WHERE id = ?', [name, condition, subject, id])
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


exports.deleteTheme = async (req, res) => {
    const id = req.params.id;

    const [rows] = await sql.query('DELETE FROM themes WHERE id = ?', [id])
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