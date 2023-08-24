const sql = require('../../../config/db.js');

async function getPreviewSubObjective(req, res) {
    const id = req.params.id;
    try {
        const [rows] = await sql.query(`SELECT
                                            planning_subobjectives_objectives.id AS id,
                                            subobjectives.id AS id_subobjective,
                                            objectives.id AS id_objective,
                                            objectives.oa AS oa,
                                            subobjectives.name AS name
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
async function getSelectSubObjectives(req, res) {
    try {
        const [rows] = await sql.query(`SELECT * FROM subobjectives`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSelectSubObjectivesObjectives(req, res) {
    try {
        const [rows] = await sql.query(`SELECT
                                            planning_subobjectives_objectives.id AS id,
                                            subobjectives.id AS id_subobjective,
                                            objectives.id AS id_objective,
                                            objectives.oa AS oa,
                                            subobjectives.name AS name
                                        FROM
                                            planning_subobjectives_objectives
                                        INNER JOIN subobjectives ON planning_subobjectives_objectives.subobjective = subobjectives.id
                                        INNER JOIN objectives ON planning_subobjectives_objectives.objective = objectives.id`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSubObjectives(data) {
    const records = data;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const existingRecords = [];

        if (records.length === 0) {
            return [];
        }

        // Obtener todos los registros existentes en una sola consulta
        const id = records.map(record => record.id);
        const [existingResults] = await connection.query(`SELECT
                                                                *
                                                            FROM
                                                                subobjectives
                                                            WHERE
                                                                id = ?`, [id]);

        //Crear un objeto para buscar registros existentes más fácilmente
        const existingSubObjective = existingResults.reduce((acc, result) => {
            acc[result.id_subobjective] = result;
            return acc;
        }, {});

        for (const record of records) {
            if (existingSubObjective[record.id]) {
                existingRecords.push(existingSubObjective[record.id]);
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
async function getIdSelectSubObjectives(id) {
    try {
        const [rows] = await sql.query(`SELECT * FROM subobjectives WHERE id = ?`, [id])
        return rows;
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getIdSubObjective(data) {
    const records = data;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const existingRecords = [];

        if (records.length === 0) {
            return [];
        }

        // Obtener todos los registros existentes en una sola consulta
        const subobjective = records.map(record => record.subobjective);
        const objective = records.map(record => record.objective);
        const [existingResults] = await connection.query(`SELECT
                                                                planning_subobjectives_objectives.id AS id,
                                                                subobjectives.id AS id_subobjective,
                                                                objectives.id AS id_objective,
                                                                objectives.oa AS oa,
                                                                subobjectives.name AS name
                                                            FROM
                                                                planning_subobjectives_objectives
                                                            INNER JOIN subobjectives ON planning_subobjectives_objectives.subobjective = subobjectives.id
                                                            INNER JOIN objectives ON planning_subobjectives_objectives.objective = objectives.id
                                                            WHERE planning_subobjectives_objectives.subobjective IN (?) AND planning_subobjectives_objectives.objective IN (?)`, [subobjective, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingSubObjective = existingResults.reduce((acc, result) => {
            acc[`${result.id_subobjective}-${result.id_objective}`] = result;
            return acc;
        }, {});

        for (const record of records) {
            if (existingSubObjective[`${record.subobjective}-${record.objective}`]) {
                existingRecords.push(existingSubObjective[`${record.subobjective}-${record.objective}`]);
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
    getIdSubObjective,
    getSelectSubObjectives,
    getSubObjectives,
    getIdSelectSubObjectives,
    getSelectSubObjectivesObjectives,
    getPreviewSubObjective
}