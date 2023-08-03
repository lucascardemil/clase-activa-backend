const sql = require('../../../config/db.js');

async function getSelectAxis(req, res) {
    try {
        const [rows] = await sql.query(`SELECT 
                                            axis.id AS id,
                                            axis.name AS name,
                                            subjects.name AS subject,
                                            courses.name AS course,
                                            levels.name AS level 
                                            FROM axis
                                            INNER JOIN subjects ON axis.subject = subjects.id
                                            INNER JOIN courses ON subjects.course = courses.id
                                            INNER JOIN levels ON courses.level = levels.id`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSelectAxisObjectives(req, res) {
    try {
        const [rows] = await sql.query(`SELECT
                                                axis.id AS id_axi,
                                                objectives.id AS id_objective,
                                                objectives.oa AS oa,
                                                axis.name AS name_axi,
                                                subjects.name AS name_subject
                                            FROM
                                                planning_axis_objectives
                                            INNER JOIN axis ON planning_axis_objectives.axi = axis.id
                                            INNER JOIN objectives ON planning_axis_objectives.objective = objectives.id
                                            INNER JOIN subjects ON axis.subject = subjects.id`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getIdSelectAxis(id) {
    try {
        const [rows] = await sql.query(`SELECT 
                                            axis.id AS id,
                                            axis.name AS name,
                                            subjects.name AS subject,
                                            courses.name AS course,
                                            levels.name AS level
                                            FROM axis
                                            INNER JOIN subjects ON axis.subject = subjects.id
                                            INNER JOIN courses ON subjects.course = courses.id
                                            INNER JOIN levels ON courses.level = levels.id
                                            WHERE axis.id = ?`, [id])
        return rows;
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getIdAxisSubjects(req, res) {
    try {
        const name = req.params.name;
        const subject = req.params.subject;

        const [rows] = await sql.query(`SELECT 
                                        axis.id AS id,
                                        axis.name AS name,
                                        subjects.name AS subject 
                                        FROM axis
                                        INNER JOIN subjects ON axis.subject = subjects.id
                                        WHERE axis.name IN (?) AND subjects.id IN (?)`, [name, subject]);
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSelectIdAxisObjectives(data) {
    const records = data;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const existingRecords = [];

        if (records.length === 0) {
            return [];
        }

        // Obtener todos los registros existentes en una sola consulta
        const axi = records.map(record => record.axi);
        const objective = records.map(record => record.objective);

        const [existingResults] = await connection.query(`SELECT
                                                                    planning_axis_objectives.id AS id,
                                                                    axis.id AS id_axi,
                                                                    objectives.id AS id_objective,
                                                                    objectives.oa AS oa,
                                                                    axis.name AS name
                                                                FROM
                                                                    planning_axis_objectives
                                                                INNER JOIN axis ON planning_axis_objectives.axi = axis.id
                                                                INNER JOIN objectives ON planning_axis_objectives.objective = objectives.id
                                                                WHERE planning_axis_objectives.axi IN (?) AND planning_axis_objectives.objective IN (?)`, [axi, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.id_axi}-${result.id_objective}`] = result;
            return acc;
        }, {});

        for (const record of records) {
            if (existingAxis[`${record.axi}-${record.objective}`]) {
                existingRecords.push(existingAxis[`${record.axi}-${record.objective}`]);
            }
        }

        await connection.commit();

        return existingRecords;

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Error inserting records' });
    } finally {
        connection.release();
    }
}
module.exports = {
    getSelectAxis,
    getSelectAxisObjectives,
    getIdSelectAxis,
    getIdAxisSubjects,
    getSelectIdAxisObjectives
}