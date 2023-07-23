const sql = require('../../../config/db.js');
const {
    getSelectUnits,
    getIdUnitSelectAxis,
    getSelectIdUnitsObjectives,
    getSelectIdUnitsSkills,
    getSelectUnitsAttitudes,
    getSelectUnitsObjectives,
    getSelectUnitsSkills,
    getSelectIdUnitsAttitudes
} = require('./get.js');

async function addPlanningUnit(req, res) {
    const { name, subject } = req.body;
    const lowerCaseName = name.toLowerCase();
    try {
        // Check if the unit already exists
        const [existingUnit] = await sql.query('SELECT * FROM units WHERE LOWER(name) = ? AND subject = ?', [lowerCaseName, subject]);

        if (existingUnit.length > 0) {
            return res.json({ status: 'error', message: '¡La unidad ya está creada!' });
        }
        // Add the unit if it doesn't exist
        const [newUnit] = await sql.query('INSERT INTO units (name, subject) VALUES (?, ?)', [name, subject]);
        if (newUnit.affectedRows > 0) {
            const result = await getIdUnitSelectAxis(newUnit.insertId);
            return res.json({ status: 'success', message: '¡La unidad fue creada con éxito!', result: result[0] });
        }
    } catch (error) {
        console.error(error);
    }
}
async function updatePlanningUnit(req, res) {
    const { id, name, subject } = req.body;
    const lowerCaseName = name.toLowerCase();
    try {
        // Check if the unit already exists
        const [existingUnit] = await sql.query('SELECT * FROM units WHERE LOWER(name) = ? AND subject = ?', [lowerCaseName, subject]);

        if (existingUnit.length > 0) {
            return res.json({ status: 'error', message: '¡La unidad ya está creada!' });
        }
        // Add the unit if it doesn't exist
        const [newUnit] = await sql.query('UPDATE units SET name = ?, subject = ? WHERE id = ?', [name, subject, id]);
        if (newUnit.affectedRows > 0) {
            const result = await getIdUnitSelectAxis(id);
            return res.json({ status: 'success', message: '¡La unidad fue actualizada con éxito!', result: result[0] });
        }
    } catch (error) {
        console.error(error);
    }
}
async function addPlanningUnitObjective(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objective = records.map(record => record.id);
        const unit = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_units_objectives WHERE unit IN (?) AND objective IN (?)', [unit, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.unit}-${result.objective}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingAxis[`${record.unit}-${record.id}`]) {
                existingRecords.push(existingAxis[`${record.unit}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_units_objectives (unit, objective) VALUES (?, ?)', [record.unit, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_units_objectives WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getSelectIdUnitsObjectives(insertedRecords);
        const processedExistingRecords = await getSelectIdUnitsObjectives(existingRecords);

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
async function addPlanningUnitSkill(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const skill = records.map(record => record.id);
        const unit = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_units_skills WHERE unit IN (?) AND skill IN (?)', [unit, skill]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.unit}-${result.skill}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingAxis[`${record.unit}-${record.id}`]) {
                existingRecords.push(existingAxis[`${record.unit}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_units_skills (unit, skill) VALUES (?, ?)', [record.unit, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_units_skills WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getSelectIdUnitsSkills(insertedRecords);
        const processedExistingRecords = await getSelectIdUnitsSkills(existingRecords);

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
async function addPlanningUnitAttitude(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const attitude = records.map(record => record.id);
        const unit = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_units_attitudes WHERE unit IN (?) AND attitude IN (?)', [unit, attitude]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.unit}-${result.attitude}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingAxis[`${record.unit}-${record.id}`]) {
                existingRecords.push(existingAxis[`${record.unit}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_units_attitudes (unit, attitude) VALUES (?, ?)', [record.unit, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_units_attitudes WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getSelectIdUnitsAttitudes(insertedRecords);
        const processedExistingRecords = await getSelectIdUnitsAttitudes(existingRecords);

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
async function updatePlanningUnitObjective(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objective = records.map(record => record.id);
        const unit = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_units_objectives WHERE unit IN (?) AND objective IN (?)', [unit, objective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingUnits = existingResults.reduce((acc, result) => {
            acc[`${result.unit}-${result.objective}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (record.checked === false) {
                await connection.query('DELETE FROM planning_units_objectives WHERE unit IN (?) AND objective IN (?)', [record.unit, record.id]);
            } else if (existingUnits[`${record.unit}-${record.id}`]) {
                existingRecords.push(existingUnits[`${record.unit}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_units_objectives (unit, objective) VALUES (?, ?)', [record.unit, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_units_objectives WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getSelectIdUnitsObjectives(insertedRecords);
        const processedExistingRecords = await getSelectIdUnitsObjectives(existingRecords);

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
async function updatePlanningUnitSkill(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const skill = records.map(record => record.id);
        const unit = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_units_skills WHERE unit IN (?) AND skill IN (?)', [unit, skill]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.unit}-${result.skill}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (record.checked === false) {
                await connection.query('DELETE FROM planning_units_skills WHERE unit IN (?) AND objective IN (?)', [record.unit, record.id]);
            } else if (existingAxis[`${record.unit}-${record.id}`]) {
                existingRecords.push(existingAxis[`${record.unit}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_units_skills (unit, skill) VALUES (?, ?)', [record.unit, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_units_skills WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getSelectIdUnitsSkills(insertedRecords);
        const processedExistingRecords = await getSelectIdUnitsSkills(existingRecords);

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
async function updatePlanningUnitAttitude(req, res) {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const attitude = records.map(record => record.id);
        const unit = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_units_attitudes WHERE unit IN (?) AND attitude IN (?)', [unit, attitude]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.unit}-${result.attitude}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (record.checked === false) {
                await connection.query('DELETE FROM planning_units_attitudes WHERE unit IN (?) AND attitude IN (?)', [record.unit, record.id]);
            } else if (existingAxis[`${record.unit}-${record.id}`]) {
                existingRecords.push(existingAxis[`${record.unit}-${record.id}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_units_attitudes (unit, attitude) VALUES (?, ?)', [record.unit, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_units_attitudes WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await getSelectIdUnitsAttitudes(insertedRecords);
        const processedExistingRecords = await getSelectIdUnitsAttitudes(existingRecords);

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
    getSelectUnits,
    getIdUnitSelectAxis,
    getSelectIdUnitsObjectives,
    getSelectIdUnitsSkills,
    getSelectUnitsAttitudes,
    getSelectUnitsObjectives,
    addPlanningUnit,
    updatePlanningUnit,
    addPlanningUnitObjective,
    addPlanningUnitSkill,
    addPlanningUnitAttitude,
    updatePlanningUnitObjective,
    updatePlanningUnitSkill,
    getSelectUnitsSkills,
    getSelectIdUnitsAttitudes,
    updatePlanningUnitAttitude
}