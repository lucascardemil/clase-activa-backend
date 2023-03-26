const sql = require('../../config/db.js');

exports.getIdPlanning = async (req, res) => {
    const table = req.params.id;
    const [rows] = await sql.query('SELECT * FROM ' + table + '')
    res.json(rows)
}

exports.getIdSubObjective = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM subobjectives WHERE objective = ?', [id])
    res.json(rows)
}

exports.getAllPlanning = async (req, res) => {
    const [rows] = await sql.query(`SELECT
                                        objectives.id AS id,
                                        courses.name AS course,
                                        subjects.name AS subject,
                                        units.name AS unit,
                                        axis.name AS axi,
                                        objectives.name AS objective,
                                        indicators.name AS indicator
                                    FROM
                                        units
                                    INNER JOIN subjects ON units.subject = subjects.id
                                    INNER JOIN courses ON subjects.course = courses.id
                                    INNER JOIN axis ON units.id = axis.unit
                                    INNER JOIN objectives ON axis.id = objectives.axi
                                    INNER JOIN indicators ON objectives.id = indicators.objective`)
    res.json(rows)
}

exports.addPlaningUnit = async (req, res) => {
    const name = req.body.name;
    const subject = req.body.subject

    const [rows] = await sql.query('SELECT * FROM units WHERE name = ?', [name])

    if (rows.length === 0) {

        const [rows] = await sql.query('INSERT INTO units (name, subject) VALUES (?, ?)', [name, subject])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡La Unidad creado con exito!',
                result: {
                    id: rows.insertId,
                    name: name,
                    subject: subject,
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear la Unidad!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: '¡La Unidad ya está creado!',
        });
    }
}

exports.addPlanningObjective = async (req, res) => {
    const name = req.body.name;
    const unit = req.body.unit
    const axi = req.body.axi

    const [rows] = await sql.query('SELECT * FROM objectives WHERE name = ?', [name])

    if (rows.length === 0) {

        const [rows] = await sql.query('INSERT INTO objectives (name, unit, axi) VALUES (?, ?, ?)', [name, unit, axi])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡El Objetivo creado con exito!',
                result: {
                    id: rows.insertId,
                    name: name,
                    axi: axi,
                    unit: unit
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear el objetivo!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: '¡El objetivo ya está creado!',
        });
    }
}

exports.addPlanningWithObjective = async (req, res) => {
    const name = req.body.name;
    const objective = req.body.objective
    const table = req.body.table;
    const message = req.body.message;

    const [rows] = await sql.query('SELECT * FROM ' + table + ' WHERE name = ?', [name])

    if (rows.length === 0) {

        const [rows] = await sql.query('INSERT INTO ' + table + ' (name, objective) VALUES (?, ?)', [name, objective])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡El ' + message + ' creado con exito!',
                result: {
                    id: rows.insertId,
                    name: name,
                    objective: objective
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear el ' + table + '!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: '¡El ' + table + ' ya está creado!',
        });
    }
}

exports.addPlanningWithUnit = async (req, res) => {
    const name = req.body.name;
    const unit = req.body.unit;
    const table = req.body.table;
    const message = req.body.message;

    const [rows] = await sql.query('SELECT * FROM ' + table + ' WHERE name = ?', [name])

    if (rows.length === 0) {

        const [rows] = await sql.query('INSERT INTO ' + table + ' (name, unit) VALUES (?, ?)', [name, unit])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡La ' + message + ' creado con exito!',
                result: {
                    id: rows.insertId,
                    name: name,
                    unit: unit
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear la ' + message + '!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: '¡La ' + message + ' ya está creado!',
        });
    }
}