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
async function getIdSubObjective(req, res) {
    const id = req.params.id;
    try {
        const [rows] = await sql.query(`SELECT
                                            subobjectives.id AS id_subobjective,
                                            objectives.id AS id_objective,
                                            objectives.oa AS oa,
                                            objectives.name AS name,
                                            subobjectives.name AS name_subobjective
                                        FROM
                                            planning_subobjectives_objectives
                                        INNER JOIN subobjectives ON planning_subobjectives_objectives.subobjective = subobjectives.id
                                        INNER JOIN objectives ON planning_subobjectives_objectives.objective = objectives.id
                                        WHERE objectives.id = ?`, [id]);
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getIdIndicator(req, res) {
    const id = req.params.id;
    try {
        const [rows] = await sql.query(`SELECT
                                            indicators.id AS id_indicator,
                                            objectives.id AS id_objective,
                                            objectives.oa AS oa,
                                            indicators.name AS name
                                        FROM
                                            planning_indicators_objectives
                                        INNER JOIN indicators ON planning_indicators_objectives.indicator = indicators.id
                                        INNER JOIN objectives ON planning_indicators_objectives.objective = objectives.id
                                        WHERE objectives.id = ?`, [id]);
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getIdSkill(req, res) {
    const id = req.params.id;
    const [rows] = await sql.query(`SELECT
                                    skills.oa AS oa,
                                    skills.name AS name,
                                    planning_units_skills.unit AS unit    
                                FROM planning_units_skills
                                INNER JOIN skills ON planning_units_skills.skill = skills.id 
                                WHERE unit = ?`, [id])
    res.setHeader('Cache-Control', 'no-store');
    res.json(rows)
}
async function getIdAttitude(req, res) {
    const id = req.params.id;
    const [rows] = await sql.query(`SELECT
                                        attitudes.oa AS oa,
                                        attitudes.name AS name,
                                        planning_units_attitudes.unit AS unit    
                                    FROM planning_units_attitudes
                                    INNER JOIN attitudes ON planning_units_attitudes.attitude = attitudes.id 
                                    WHERE unit = ?`, [id])
    res.setHeader('Cache-Control', 'no-store');
    res.json(rows)
}

module.exports = {
    getIdPlanning,
    getAllPlanning,
    getSubjectForUnit,
    getIdSubObjective,
    getIdIndicator,
    getIdSkill,
    getIdAttitude
}

