const sql = require('../../../config/db.js');

async function getSelectUnits(req, res) {
    try {
        const [rows] = await sql.query(`SELECT
                                    levels.name AS level,
                                    courses.name AS course,
                                    subjects.name AS subject,
                                    units.name AS unit,
                                    units.id AS id
                                FROM
                                    units
                                INNER JOIN subjects ON units.subject = subjects.id
                                INNER JOIN courses ON subjects.course = courses.id
                                INNER JOIN levels ON courses.level = levels.id`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSelectUnitsObjectives(req, res) {
    try {
        const [rows] = await sql.query(`SELECT
                                                units.id AS id_unit,
                                                objectives.id AS id_objective,
                                                objectives.oa AS oa,
                                                units.name AS name_unit,
                                                subjects.name AS name_subject,
                                                courses.name AS name_course,
                                                levels.name AS name_level
                                            FROM
                                                planning_units_objectives
                                            INNER JOIN units ON planning_units_objectives.unit = units.id
                                            INNER JOIN objectives ON planning_units_objectives.objective = objectives.id
                                            INNER JOIN subjects ON units.subject = subjects.id
                                            INNER JOIN courses ON subjects.course = courses.id
                                            INNER JOIN levels ON courses.level = levels.id`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSelectUnitsSkills(req, res) {
    try {
        const [rows] = await sql.query(`SELECT
                                                units.id AS id_unit,
                                                skills.id AS id_skill,
                                                skills.oa AS oa,
                                                units.name AS name_unit,
                                                subjects.name AS name_subject,
                                                courses.name AS name_course,
                                                levels.name AS name_level
                                            FROM
                                                planning_units_skills
                                            INNER JOIN units ON planning_units_skills.unit = units.id
                                            INNER JOIN skills ON planning_units_skills.skill = skills.id
                                            INNER JOIN subjects ON units.subject = subjects.id
                                            INNER JOIN courses ON subjects.course = courses.id
                                            INNER JOIN levels ON courses.level = levels.id`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSelectUnitsAttitudes(req, res) {
    try {
        const [rows] = await sql.query(`SELECT
                                                units.id AS id_unit,
                                                attitudes.id AS id_attitude,
                                                attitudes.oa AS oa,
                                                units.name AS name_unit,
                                                subjects.name AS name_subject,
                                                courses.name AS name_course,
                                                levels.name AS name_level
                                            FROM
                                                planning_units_attitudes
                                            INNER JOIN units ON planning_units_attitudes.unit = units.id
                                            INNER JOIN attitudes ON planning_units_attitudes.attitude = attitudes.id
                                            INNER JOIN subjects ON units.subject = subjects.id
                                            INNER JOIN courses ON subjects.course = courses.id
                                            INNER JOIN levels ON courses.level = levels.id`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getIdUnitSelectAxis(id) {
    try {
        const [rows] = await sql.query(`SELECT
                                levels.name AS level,
                                courses.name AS course,
                                subjects.name AS subject,
                                units.name AS unit,
                                units.id AS id
                            FROM
                                units
                            INNER JOIN subjects ON units.subject = subjects.id
                            INNER JOIN courses ON subjects.course = courses.id
                            INNER JOIN levels ON courses.level = levels.id
                            WHERE units.id = ?`, [id])
        return rows;
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSelectIdUnitsObjectives(data) {
    const records = data;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const existingRecords = [];

        if (records.length === 0) {
            return [];
        }

        // Obtener todos los registros existentes en una sola consulta
        const unit = records.map(record => record.unit);
        const objective = records.map(record => record.objective);

        const [existingResults] = await connection.query(`SELECT
                                                                planning_units_objectives.id AS id,
                                                                units.id AS id_unit,
                                                                objectives.id AS id_objective,
                                                                objectives.oa AS oa,
                                                                units.name AS name
                                                            FROM
                                                                planning_units_objectives
                                                            INNER JOIN units ON planning_units_objectives.unit = units.id
                                                            INNER JOIN objectives ON planning_units_objectives.objective = objectives.id
                                                            WHERE planning_units_objectives.unit IN (?) AND planning_units_objectives.objective IN (?)`, [unit, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.id_unit}-${result.id_objective}`] = result;
            return acc;
        }, {});

        for (const record of records) {
            if (existingAxis[`${record.unit}-${record.objective}`]) {
                existingRecords.push(existingAxis[`${record.unit}-${record.objective}`]);
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
async function getSelectIdUnitsSkills(data) {
    const records = data;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const existingRecords = [];

        if (records.length === 0) {
            return [];
        }

        // Obtener todos los registros existentes en una sola consulta
        const unit = records.map(record => record.unit);
        const skill = records.map(record => record.skill);

        const [existingResults] = await connection.query(`SELECT
                                                                units.id AS id_unit,
                                                                skills.id AS id_skill,
                                                                skills.oa AS oa,
                                                                units.name AS name
                                                            FROM
                                                                planning_units_skills
                                                            INNER JOIN units ON planning_units_skills.unit = units.id
                                                            INNER JOIN skills ON planning_units_skills.skill = skills.id
                                                            WHERE planning_units_skills.unit IN (?) AND planning_units_skills.skill IN (?)`, [unit, skill]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.id_unit}-${result.id_skill}`] = result;
            return acc;
        }, {});

        for (const record of records) {
            if (existingAxis[`${record.unit}-${record.skill}`]) {
                existingRecords.push(existingAxis[`${record.unit}-${record.skill}`]);
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
async function getSelectIdUnitsAttitudes(data) {
    const records = data;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const existingRecords = [];

        if (records.length === 0) {
            return [];
        }

        // Obtener todos los registros existentes en una sola consulta
        const unit = records.map(record => record.unit);
        const attitude = records.map(record => record.attitude);

        const [existingResults] = await connection.query(`SELECT
                                                                units.id AS id_unit,
                                                                attitudes.id AS id_attitude,
                                                                attitudes.oa AS oa,
                                                                units.name AS name
                                                            FROM
                                                                planning_units_attitudes
                                                            INNER JOIN units ON planning_units_attitudes.unit = units.id
                                                            INNER JOIN attitudes ON planning_units_attitudes.attitude = attitudes.id
                                                            WHERE planning_units_attitudes.unit IN (?) AND planning_units_attitudes.attitude IN (?)`, [unit, attitude]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.id_unit}-${result.id_attitude}`] = result;
            return acc;
        }, {});

        for (const record of records) {
            if (existingAxis[`${record.unit}-${record.attitude}`]) {
                existingRecords.push(existingAxis[`${record.unit}-${record.attitude}`]);
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
    getSelectUnits,
    getSelectUnitsObjectives,
    getIdUnitSelectAxis,
    getSelectIdUnitsObjectives,
    getSelectIdUnitsSkills,
    getSelectUnitsAttitudes,
    getSelectUnitsSkills,
    getSelectIdUnitsAttitudes
}