const sql = require('../../config/db.js');
const fs = require('fs');

exports.getUserEducationLevel = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT levels.id AS id FROM user_educations INNER JOIN subjects ON user_educations.subject = subjects.id INNER JOIN courses ON subjects.course = courses.id INNER JOIN levels ON courses.level = levels.id WHERE user_educations.user = ? GROUP BY levels.id', [id])
    res.json(rows)
}

exports.getUserEducationCourse = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT courses.id AS id FROM user_educations INNER JOIN subjects ON user_educations.subject = subjects.id INNER JOIN courses ON subjects.course = courses.id INNER JOIN levels ON courses.level = levels.id WHERE user_educations.user = ?', [id])
    res.json(rows)
}

exports.getUserEducation = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT subjects.id AS id FROM user_educations INNER JOIN subjects ON user_educations.subject = subjects.id INNER JOIN courses ON subjects.course = courses.id INNER JOIN levels ON courses.level = levels.id WHERE user_educations.user = ?', [id])
    res.json(rows)
}

exports.getSchoolUser = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM user_schools WHERE user = ?', [id])
    res.json(rows)
}

exports.updateInfoEducation = async (req, res) => {

    const [rows] = await sql.query('SELECT * FROM user_educations')

    const subject = rows.map(row => row.subject);
    const list_subjects = req.body[0].filter(list_subject => !subject.includes(list_subject.id));

    Promise.all(list_subjects.map(async element => {
        const [rows] = await sql.query('INSERT INTO user_educations (subject, user) VALUES (?, ?)', [element.id, element.id_user])
        return rows;
    })).then((result) => {
        if (result.length > 0) {
            res.json({
                status: 'success',
                message: '¡Asignatura asignadas con exito!',
            });
        } else {
            Promise.all(req.body[1].map(async (element) => {

                if (element.subject) {
                    const [rows] = await sql.query('DELETE FROM user_educations WHERE subject = ?', [element.subject])
                    return rows;
                } else if (element.course) {
                    const [rows] = await sql.query('SELECT * FROM subjects WHERE course = ?', [element.course])
                    rows.map(async row => {
                        const [rows] = await sql.query('DELETE FROM user_educations WHERE subject = ?', [row.id])
                        return rows;
                    })

                } else if (element.level) {
                    const [rows] = await sql.query('SELECT * FROM courses WHERE level = ?', [element.level])
                    rows.map(async row => {
                        const [rows] = await sql.query('SELECT * FROM subjects WHERE course = ?', [row.id])
                        rows.map(async row => {
                            const [rows] = await sql.query('DELETE FROM user_educations WHERE subject = ?', [row.id])
                            return rows;
                        })
                    })
                }


            })).then(result => {
                if (result.length > 0) {
                    res.json({
                        status: 'success',
                        message: '¡Asignatura eliminadas con exito!',
                    });
                } else {
                    res.json({
                        status: 'error',
                        message: '¡La asignatura ya existe!',
                    });
                }
            })
        }
    })

}


exports.updateImageSchool = async (req, res) => {
    const uploads = req.files.uploads
    const users = JSON.parse(req.body.users)


    uploads.map(upload => {
        users.map(async user => {

            const [results] = await sql.query('SELECT * FROM user_schools WHERE user = ?', [user.id])
            if (results.length == 0) {

                results.map(row => fs.unlinkSync(row.image));

                const [rows] = await sql.query('INSERT INTO user_schools (school, name_image, image, user) VALUES (?, ?, ?, ?)', [user.school, upload.name, upload.path, user.id])
                if (rows.affectedRows > 0) {
                    
                    res.json({
                        status: 'success',
                        message: '¡Imagen se agrego con éxito!',
                        school: {
                            id: rows.insertId,
                            school: user.school,
                            image: upload.path 
                        }
                    });
                } else {
                    res.json({
                        status: 'error',
                        message: '¡Error al guardar la imagen!',
                    });
                }
            } else {

                results.map(row => fs.unlinkSync(row.image));

                const [rows] = await sql.query('UPDATE user_schools SET school = ?, image = ? WHERE user = ?', [user.school, upload.path, user.id])
                if (rows.affectedRows > 0) {
                    res.json({
                        status: 'success',
                        message: '¡Imagen actualizada con exito!',
                        school: {
                            school: user.school,
                            image: upload.path 
                        }
                    });
                } else {
                    res.json({
                        status: 'error',
                        message: '¡Error al actualizar la imagen!',
                    });

                }
            }
        })
    })
}