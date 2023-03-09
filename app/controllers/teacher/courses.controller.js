const sql = require('../../config/db.js');

exports.getAllCourses = async (req, res) => {
    const [rows] = await sql.query('SELECT courses.id as id, courses.name as name, courses.condition_course as condition_course, levels.name as level, levels.condition_level as condition_level FROM courses INNER JOIN levels ON courses.level = levels.id')
    res.send(rows)
}

exports.getIdCourse = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM courses WHERE id = ?', [id])
    res.send(rows);

}

exports.getCourseForLevel = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM courses WHERE level = ? AND condition_course = 1', [id])
    res.send(rows);
}

exports.addCourse = async (req, res) => {
    const name = req.body.name;
    const condition = req.body.condition;
    const level = req.body.level;

    const [rows] = await sql.query('SELECT * FROM courses WHERE name = ?', [name])

    if (rows.length === 0) {
        const [rows] = await sql.query('INSERT INTO courses (name, condition_course, level) VALUES (?, ?, ?)', [name, condition, level])
        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡Curso creado con éxito!',
                course: {
                    id: rows.insertId,
                    name: name,
                    level: level,
                    condition: condition,
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear el curso!',
            });
        }
    } else {
        res.json({
            status: 'error',
            message: '¡El curso ya está creado!',
        });
    }
}

exports.updateCourse = async (req, res) => {
    const id = req.body.id;
    const level = req.body.level_update;
    const name = req.body.name_update;
    const condition = req.body.condition_update;

    const [rows] = await sql.query('UPDATE courses SET name = ?, condition_course = ?, level = ? WHERE id = ?', [name, condition, level, id])
    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡Curso actualizado con exito!',
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al actualizar el curso!',
        });

    }
}


exports.deleteCourse = async (req, res) => {
    const id = req.params.id;

    const [rows] = await sql.query('DELETE FROM courses WHERE id = ?', [id])
    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡El curso fue eliminado con exito!'
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al eliminar el curso!',
        });
    }
}