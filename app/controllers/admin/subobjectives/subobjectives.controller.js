const sql = require('../../../config/db.js');
const {
    getIdSubObjective,
    getSelectSubObjectives,
    getSubObjectives,
    getIdSelectSubObjectives,
    getSelectSubObjectivesObjectives,
    getPreviewSubObjective
} = require('./get.js');


async function addSubObjective(req, res) {
    const { name } = req.body;
    const lowerCaseName = name.toLowerCase();
    try {
        // Check if the unit already exists
        const [existingSubObjective] = await sql.query('SELECT * FROM subobjectives WHERE LOWER(name) = ?', [lowerCaseName]);

        if (existingSubObjective.length > 0) {
            return res.json({ status: 'error', message: '¡El subobjetivo ya está creado!' });
        }
        // Add the unit if it doesn't exist
        const [newSubObjective] = await sql.query('INSERT INTO subobjectives (name) VALUES (?)', [name]);
        if (newSubObjective.affectedRows > 0) {
            const result = await getIdSelectSubObjectives(newSubObjective.insertId);
            return res.json({ status: 'success', message: '¡El subobjetivo creado con exito!', result: result[0] });
        }
    } catch (error) {
        console.error(error);
    }
}
async function updateSubObjective(req, res) {
    const { id, name } = req.body;
    const lowerCaseName = name.toLowerCase();
    try {
        // Check if the unit already exists
        const [existingSubObjective] = await sql.query('SELECT * FROM subobjectives WHERE LOWER(name) = ?', [lowerCaseName]);

        if (existingSubObjective.length > 0) {
            return res.json({ status: 'error', message: '¡El subobjetivo ya está creada!' });
        }
        // Add the unit if it doesn't exist
        const [newSubObjective] = await sql.query('UPDATE subobjectives SET name = ? WHERE id = ?', [name, id]);
        if (newSubObjective.affectedRows > 0) {
            const result = await getIdSelectSubObjectives(id);
            return res.json({ status: 'success', message: '¡El subobjetivo fue actualizado con éxito!', result: result[0] });
        }
    } catch (error) {
        console.error(error);
    }
}
async function addPlanningSubObjective(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objective = records.map(record => record.id);
        const subObjective = records.map(record => record.subObjective);
        const [existingResults] = await connection.query(
            'SELECT * FROM planning_subobjectives_objectives WHERE subobjective IN (?) AND objective IN (?)',
            [subObjective, objective]
        );

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingObjectives = existingResults.reduce((acc, result) => {
            acc[`${result.subobjective}-${result.objective}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingObjectives[`${record.subObjective}-${record.id}`]) {
                existingRecords.push(existingObjectives[`${record.subObjective}-${record.id}`]);
            } else {
                if (record.checked === true) {
                    const [insertResult] = await connection.query(
                        'INSERT INTO planning_subobjectives_objectives (subobjective, objective) VALUES (?, ?)',
                        [record.subObjective, record.id]
                    );
                    const [getResult] = await connection.query(
                        'SELECT * FROM planning_subobjectives_objectives WHERE id = ?',
                        [insertResult.insertId]
                    );
                    insertedRecords.push(getResult[0]);
                }
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getIdSubObjective(insertedRecords);
        const processedExistingRecords = await getIdSubObjective(existingRecords);

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
async function updatePlanningSubObjective(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objective = records.map(record => record.id);
        const subObjective = records.map(record => record.subObjective);
        const [existingResults] = await connection.query('SELECT * FROM planning_subobjectives_objectives WHERE subobjective IN (?) AND objective IN (?)', [subObjective, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingObjectives = existingResults.reduce((acc, result) => {
            acc[`${result.subobjective}-${result.objective}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (record.checked === false) {
                await connection.query('DELETE FROM planning_subobjectives_objectives WHERE subobjective IN (?) AND objective IN (?)', [record.subObjective, record.id]);
            } else if (existingObjectives[`${record.subObjective}-${record.id}`]) {
                existingRecords.push(existingObjectives[`${record.subObjective}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_subobjectives_objectives (subobjective, objective) VALUES (?, ?)', [record.subObjective, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_subobjectives_objectives WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getIdSubObjective(insertedRecords);
        const processedExistingRecords = await getIdSubObjective(existingRecords);

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
    getIdSubObjective,
    getSelectSubObjectives,
    getSubObjectives,
    getIdSelectSubObjectives,
    addSubObjective,
    updateSubObjective,
    addPlanningSubObjective,
    getSelectSubObjectivesObjectives,
    getPreviewSubObjective,
    updatePlanningSubObjective
}