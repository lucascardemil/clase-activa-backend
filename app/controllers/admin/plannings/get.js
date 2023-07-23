const sql = require('../../../config/db.js');

async function getIdPlanning(req, res) {
    const table = req.params.id;
    const [rows] = await sql.query('SELECT * FROM ' + table + '')
    res.json(rows)
}
async function getAllPlanning(req, res) {
    try {
        const id = req.params.id;
        let query = `
            SELECT (@row_number:=@row_number + 1) AS id_temporal, t.*
            FROM (
                SELECT
                    courses.name AS course,
                    units_subjects.name AS subject,
                    units.id AS id_unit,
                    units.name AS unit,
                    axis.id AS id_axi,
                    axis.name AS axi,
                    objectives.id AS id_objective,
                    objectives.oa AS oa,
                    objectives.name AS objective
                FROM
                    objectives
                INNER JOIN planning_units_objectives ON objectives.id = planning_units_objectives.objective
                INNER JOIN planning_axis_objectives ON objectives.id = planning_axis_objectives.objective
                INNER JOIN units ON planning_units_objectives.unit = units.id
                INNER JOIN axis ON planning_axis_objectives.axi = axis.id
                INNER JOIN subjects AS units_subjects ON units.subject = units_subjects.id
                INNER JOIN subjects AS axis_subjects ON axis.subject = axis_subjects.id
                INNER JOIN courses ON units_subjects.course = courses.id
            ) t, (SELECT @row_number := 0) r`;

        if (id > 0) {
            query += ` WHERE t.id_unit = ${id}`;
        }

        const [rows] = await sql.query(query);
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
async function getSubjectForUnit(req, res) {
    try {
        const id = req.params.id;
        const [rows] = await sql.query(`SELECT * FROM units WHERE subject = ?`, [id])
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}

module.exports = {
    getIdPlanning,
    getAllPlanning,
    getSubjectForUnit
}

