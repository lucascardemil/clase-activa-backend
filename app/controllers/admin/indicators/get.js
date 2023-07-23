const sql = require('../../../config/db.js');

async function getPreviewIndicator(req, res) {
    const id = req.params.id;
    try {
        const [rows] = await sql.query(`SELECT
                                            planning_indicators_objectives.id AS id,
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
async function getSelectIndicators(req, res) {
    try {
        const [rows] = await sql.query(`SELECT * FROM indicators`)
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getSelectIndicatorsObjectives(req, res) {
    try {
        const [rows] = await sql.query(`SELECT
                                            planning_indicators_objectives.id AS id,
                                            indicators.id AS id_indicator,
                                            objectives.id AS id_objective,
                                            objectives.oa AS oa,
                                            indicators.name AS name
                                        FROM
                                            planning_indicators_objectives
                                        INNER JOIN indicators ON planning_indicators_objectives.indicator = indicators.id
                                        INNER JOIN objectives ON planning_indicators_objectives.objective = objectives.id`)
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getIndicators(data) {
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
                                                                indicators
                                                            WHERE
                                                                id = ?`, [id]);

        //Crear un objeto para buscar registros existentes más fácilmente
        const existingIndicator = existingResults.reduce((acc, result) => {
            acc[result.id_indicator] = result;
            return acc;
        }, {});

        for (const record of records) {
            if (existingIndicator[record.id]) {
                existingRecords.push(existingIndicator[record.id]);
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
async function getIdSelectIndicators(id) {
    try {
        const [rows] = await sql.query(`SELECT * FROM indicators WHERE id = ?`, [id])
        return rows;
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}
async function getIdIndicator(data) {
    const records = data;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const existingRecords = [];

        if (records.length === 0) {
            return [];
        }

        // Obtener todos los registros existentes en una sola consulta
        const indicator = records.map(record => record.indicator);
        const objective = records.map(record => record.objective);
        const [existingResults] = await connection.query(`SELECT
                                                                planning_indicators_objectives.id AS id,
                                                                indicators.id AS id_indicator,
                                                                objectives.id AS id_objective,
                                                                objectives.oa AS oa,
                                                                indicators.name AS name
                                                            FROM
                                                                planning_indicators_objectives
                                                            INNER JOIN indicators ON planning_indicators_objectives.indicator = indicators.id
                                                            INNER JOIN objectives ON planning_indicators_objectives.objective = objectives.id
                                                            WHERE planning_indicators_objectives.indicator IN (?) AND planning_indicators_objectives.objective IN (?)`, [indicator, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingIndicator = existingResults.reduce((acc, result) => {
            acc[`${result.id_indicator}-${result.id_objective}`] = result;
            return acc;
        }, {});

        for (const record of records) {
            if (existingIndicator[`${record.indicator}-${record.objective}`]) {
                existingRecords.push(existingIndicator[`${record.indicator}-${record.objective}`]);
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
    getIdIndicator,
    getSelectIndicators,
    getIndicators,
    getIdSelectIndicators,
    getSelectIndicatorsObjectives,
    getPreviewIndicator
}