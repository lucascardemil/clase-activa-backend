const sql = require('../../../config/db.js');
const {
    getSelectAxis,
    getIdAxisSubjects,
    getSelectIdAxisObjectives,
    getIdSelectAxis,
    getSelectAxisObjectives
} = require('./get.js');

async function addPlaningSubjectAxi(req, res) {
    const records = req.body;
    try {
        const insertedRecords = [];
        const existingSubjects = [];
        const deleteRecords = [];
        const existingRecords = [];

        for (const record of records) {
            const [result] = await sql.query('SELECT * FROM subjects WHERE name = ? AND course = ?', [record.subject, record.id]);
            existingSubjects.push({ id: result[0].id, axi: record.axi, checked: record.checked });
        }

        for (const subject of existingSubjects) {
            const lowerCaseName = subject.axi.toLowerCase();
            const [existingAxis] = await sql.query('SELECT * FROM axis WHERE LOWER(name) = ? AND subject = ?', [lowerCaseName, subject.id]);
            if (existingAxis.length > 0) {
                if(subject.checked === false){
                    const getResult = await getIdSelectAxis(existingAxis[0].id);
                    deleteRecords.push(getResult[0]);
                    await sql.query('DELETE FROM axis WHERE LOWER(name) IN (?) AND subject IN (?)', [lowerCaseName, subject.id]);
                }else{
                    const getResult = await getIdSelectAxis(existingAxis[0].id);
                    existingRecords.push(getResult[0]);
                }
            } else {
                const [newAxi] = await sql.query('INSERT INTO axis (name, subject) VALUES (?, ?)', [subject.axi, subject.id]);
                if (newAxi.affectedRows > 0) {
                    const getResult = await getIdSelectAxis(newAxi.insertId);
                    insertedRecords.push(getResult[0]);
                }
            }
        }

        res.json({
            status: 'success',
            result: { insertedRecords: insertedRecords, existingRecords: existingRecords, deleteRecords: deleteRecords }
        });

    } catch (error) {
        console.error(error);
    }
}
async function addPlanningAxiObjective(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objective = records.map(record => record.id);
        const axi = records.map(record => record.axi);
        const [existingResults] = await connection.query('SELECT * FROM planning_axis_objectives WHERE axi IN (?) AND objective IN (?)', [axi, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.axi}-${result.objective}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingAxis[`${record.axi}-${record.id}`]) {
                existingRecords.push(existingAxis[`${record.axi}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_axis_objectives (axi, objective) VALUES (?, ?)', [record.axi, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_axis_objectives WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getSelectIdAxisObjectives(insertedRecords);
        const processedExistingRecords = await getSelectIdAxisObjectives(existingRecords);

        res.json({
            status: 'success',
            result: { insertedRecords: processedInsertedRecords, existingRecords: processedExistingRecords }
        });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Error inserting records' });
    } finally {
        connection.release();
    }
}
async function updatePlanningAxiObjective(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objective = records.map(record => record.id);
        const axi = records.map(record => record.axi);
        const [existingResults] = await connection.query('SELECT * FROM planning_axis_objectives WHERE axi IN (?) AND objective IN (?)', [axi, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.axi}-${result.objective}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (record.checked === false) {
                await connection.query('DELETE FROM planning_axis_objectives WHERE axi IN (?) AND objective IN (?)', [record.axi, record.id]);
            } else if (existingAxis[`${record.axi}-${record.id}`]) {
                existingRecords.push(existingAxis[`${record.axi}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_axis_objectives (axi, objective) VALUES (?, ?)', [record.axi, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_axis_objectives WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getSelectIdAxisObjectives(insertedRecords);
        const processedExistingRecords = await getSelectIdAxisObjectives(existingRecords);

        res.json({
            status: 'success',
            result: { insertedRecords: processedInsertedRecords, existingRecords: processedExistingRecords }
        });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Error inserting records' });
    } finally {
        connection.release();
    }
}

module.exports = {
    getSelectAxis,
    getIdAxisSubjects,
    getSelectIdAxisObjectives,
    getIdSelectAxis,
    getSelectAxisObjectives,
    addPlaningSubjectAxi,
    addPlanningAxiObjective,
    updatePlanningAxiObjective
}