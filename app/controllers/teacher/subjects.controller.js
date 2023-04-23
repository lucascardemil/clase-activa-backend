const sql = require('../../config/db.js');

exports.getAllSubjects = async (req, res) => {
    const [rows] = await sql.query(`SELECT subjects.name as name,
                                           subjects.condition_subject as condition_subject, 
                                           subjects.id as id,
                                           levels.name as level,
                                           courses.name as course, 
                                           levels.condition_level as condition_level, 
                                           courses.condition_course as condition_course 
                                    FROM subjects 
                                    INNER JOIN courses ON subjects.course = courses.id 
                                    INNER JOIN levels ON courses.level = levels.id ORDER BY subjects.name DESC`)
    res.json(rows)
}

exports.getIdSubject = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM subjects WHERE id = ?', [id])
    res.json(rows);
}

exports.getSubjectForCourse = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM subjects WHERE course = ? AND condition_subject = 1', [id])
    res.json(rows);
}

exports.addSubject = async (req, res) => {
    Promise.all(req.body.map(async (element) => {
        const [rows] = await sql.query('SELECT * FROM subjects WHERE name = ?', [element.name])
        return rows;
    })).then(result => {
        if (result[0].length === 0) {
            Promise.all(req.body.map(async (element) => {
                const [rows] = await sql.query('INSERT INTO subjects (name, condition_subject, course) VALUES (?, ?, ?)', [element.name, element.condition_subject, element.course])
                return rows;
            })).then(result => {
                if (result.length > 0) {
                    res.json({
                        status: 'success',
                        message: '¡Asignatura creado con exito!',
                    });
                } else {
                    res.json({
                        status: 'error',
                        message: '¡Error al crear la asignatura!',
                    });
                }
            })
        } else {
            res.json({
                status: 'error',
                message: '¡El nivel ya está creado!',
            });
        }
    })
}

exports.updateSubject = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name_update;
    const condition = req.body.condition_subject_update;

    const [rows] = await sql.query('UPDATE subjects SET name = ?, condition_subject = ? WHERE id = ?', [name, condition, id])
    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡Asignatura actualizado con exito!',
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al actualizar la asignatura!',
        });
    }

}


exports.deleteSubject = async (req, res) => {
    const id = req.params.id;

    const [rows] = await sql.query('DELETE FROM subjects WHERE id = ?', [id])
    if (rows.affectedRows > 0) {
        res.json({
            status: 'success',
            message: '¡Asignatura eliminada con exito!',
        });
    } else {
        res.json({
            status: 'error',
            message: '¡Error al aliminar la asignatura!',
        });
    }
}