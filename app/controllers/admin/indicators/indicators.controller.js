const sql = require('../../../config/db.js');
const {
    getIdIndicator,
    getSelectIndicators,
    getIndicators,
    getIdSelectIndicators,
    getSelectIndicatorsObjectives,
    getPreviewIndicator
} = require('./get.js');


async function addIndicator(req, res) {
    const { name } = req.body;
    const lowerCaseName = name.toLowerCase();
    try {
        // Check if the unit already exists
        const [existingIndicator] = await sql.query('SELECT * FROM indicators WHERE LOWER(name) = ?', [lowerCaseName]);

        if (existingIndicator.length > 0) {
            return res.json({ status: 'error', message: '¡El indicador ya está creado!' });
        }
        // Add the unit if it doesn't exist
        const [newIndicator] = await sql.query('INSERT INTO indicators (name) VALUES (?)', [name]);
        if (newIndicator.affectedRows > 0) {
            const result = await getIdSelectIndicators(newIndicator.insertId);
            return res.json({ status: 'success', message: '¡El indicator creado con exito!', result: result[0] });
        }
    } catch (error) {
        console.error(error);
    }
}
async function updateIndicator(req, res) {
    const { id, name } = req.body;
    const lowerCaseName = name.toLowerCase();
    try {
        // Check if the unit already exists
        const [existingIndicator] = await sql.query('SELECT * FROM indicators WHERE LOWER(name) = ?', [lowerCaseName]);

        if (existingIndicator.length > 0) {
            return res.json({ status: 'error', message: '¡El indicador ya está creado!' });
        }
        // Add the unit if it doesn't exist
        const [newIndicator] = await sql.query('UPDATE indicators SET name = ? WHERE id = ?', [name, id]);
        if (newIndicator.affectedRows > 0) {
            const result = await getIdSelectIndicators(id);
            return res.json({ status: 'success', message: '¡El indicador fue actualizado con éxito!', result: result[0] });
        }
    } catch (error) {
        console.error(error);
    }
}
async function addPlanningIndicator(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objective = records.map(record => record.id);
        const indicator = records.map(record => record.indicator);
        const [existingResults] = await connection.query(
            'SELECT * FROM planning_indicators_objectives WHERE indicator IN (?) AND objective IN (?)',
            [indicator, objective]
        );

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingObjectives = existingResults.reduce((acc, result) => {
            acc[`${result.indicator}-${result.objective}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingObjectives[`${record.indicator}-${record.id}`]) {
                existingRecords.push(existingObjectives[`${record.indicator}-${record.id}`]);
            } else {
                if (record.checked === true) {
                    const [insertResult] = await connection.query(
                        'INSERT INTO planning_indicators_objectives (indicator, objective) VALUES (?, ?)',
                        [record.indicator, record.id]
                    );
                    const [getResult] = await connection.query(
                        'SELECT * FROM planning_indicators_objectives WHERE id = ?',
                        [insertResult.insertId]
                    );
                    insertedRecords.push(getResult[0]);
                }
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getIdIndicator(insertedRecords);
        const processedExistingRecords = await getIdIndicator(existingRecords);

        res.json({
            status: 'success',
            result: { insertedRecords: processedInsertedRecords, existingRecords: processedExistingRecords }
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error });
    } finally {
        connection.release();
    }
}
async function updatePlanningIndicator(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objective = records.map(record => record.id);
        const indicator = records.map(record => record.indicator);
        const [existingResults] = await connection.query('SELECT * FROM planning_indicators_objectives WHERE indicator IN (?) AND objective IN (?)', [indicator, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingObjectives = existingResults.reduce((acc, result) => {
            acc[`${result.indicator}-${result.objective}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (record.checked === false) {
                await connection.query('DELETE FROM planning_indicators_objectives WHERE indicator IN (?) AND objective IN (?)', [record.indicator, record.id]);
            } else if (existingObjectives[`${record.indicator}-${record.id}`]) {
                existingRecords.push(existingObjectives[`${record.indicator}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_indicators_objectives (indicator, objective) VALUES (?, ?)', [record.indicator, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_indicators_objectives WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getIdIndicator(insertedRecords);
        const processedExistingRecords = await getIdIndicator(existingRecords);

        res.json({
            status: 'success',
            result: { insertedRecords: processedInsertedRecords, existingRecords: processedExistingRecords}
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error });
    } finally {
        connection.release();
    }
}

module.exports = {
    getIdIndicator,
    getSelectIndicators,
    getIndicators,
    getIdSelectIndicators,
    addIndicator,
    updateIndicator,
    addPlanningIndicator,
    getSelectIndicatorsObjectives,
    getPreviewIndicator,
    updatePlanningIndicator
}