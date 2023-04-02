const sql = require('../../config/db.js');

exports.getIdPlanning = async (req, res) => {
    const table = req.params.id;
    const [rows] = await sql.query('SELECT * FROM ' + table + '')
    res.json(rows)
}

exports.getIdSubObjective = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM planning_subobjectives WHERE objective = ?', [id])
    res.json(rows)
}

exports.getUnitForSubject = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM planning_units WHERE subject = ?', [id])
    res.json(rows)
}

exports.getAxiForUnit = async (req, res) => {
    const id = req.params.id;
    const [rows] = await sql.query('SELECT * FROM planning_axis WHERE unit = ?', [id])
    res.json(rows)
}

exports.getAllPlanning = async (req, res) => {
    const [rows] = await sql.query(`SELECT
                                        planning_objectives.objective AS id,
                                        courses.name AS course,
                                        subjects.name AS subject,
                                        planning_units.name AS unit,
                                        axis.name AS axi,
                                        objectives.name AS objective,
                                        planning_indicators.name AS indicator,
                                        planning_skills.name AS skill,
                                        attitudes.name AS attitude
                                    FROM
                                        planning_units
                                    INNER JOIN subjects ON planning_units.subject = subjects.id
                                    INNER JOIN courses ON subjects.course = courses.id
                                    INNER JOIN planning_axis ON planning_units.id = planning_axis.unit
                                    INNER JOIN axis ON planning_axis.axi = axis.id
                                    INNER JOIN planning_objectives ON planning_units.id = planning_objectives.unit
                                    INNER JOIN objectives ON planning_objectives.objective = objectives.id
                                    INNER JOIN planning_indicators ON objectives.id = planning_indicators.objective
                                    INNER JOIN planning_skills ON planning_units.id = planning_skills.unit
                                    INNER JOIN planning_attitudes ON planning_units.id = planning_attitudes.unit
                                    INNER JOIN attitudes ON planning_attitudes.attitude = attitudes.id`);
    res.json(rows)
}

exports.addPlaning = async (req, res) => {
    const name = req.body.name;
    const table = req.body.table;
    const message = req.body.message;

    const [rows] = await sql.query('SELECT * FROM ?? WHERE name = ?', [table, name])

    if (rows.length === 0) {
        const [rows] = await sql.query('INSERT INTO ?? (name) VALUES (?)', [table, name])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡La ' + message + ' creado con exito!',
                result: {
                    id: rows.insertId,
                    name: name,
                    table: table
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear la ' + message + '!',
            });
        }
    } else {
        res.json({
            status: 'error',
            message: '¡La ' + message + ' ya está creado!',
        });
    }
}

exports.addPlanningUnit = async (req, res) => {
    const name = req.body.name;
    const subject = req.body.subject;

    const [rows] = await sql.query('SELECT * FROM planning_units WHERE name = ?', [name])

    if (rows.length === 0) {
        const [rows] = await sql.query('INSERT INTO planning_units (name, subject) VALUES (?, ?)', [name, subject])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡La unidad fue creado con exito!',
                result: {
                    id: rows.insertId,
                    name: name,
                    subject: subject
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear la unidad!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: '¡La unidad ya está creado!',
        });
    }
}

async function processRecords(records, tableName, fieldName) {
    const connection = await sql.getConnection();

    // Obtener todos los registros en una sola consulta
    const fieldValues = records.map(record => record[fieldName]);

    // Verificar si el array fieldValues está vacío
    if (fieldValues.length === 0) {
        return [];
    }

    const [queryResults] = await connection.query(`SELECT * FROM ${tableName} WHERE id IN (?)`, [fieldValues]);

    // Crear un objeto para buscar registros más fácilmente
    const recordsObject = queryResults.reduce((acc, result) => {
        acc[result.id] = result;
        return acc;
    }, {});

    // Iterar sobre los registros y devolver el resultado procesado
    const result = records.map(record => recordsObject[record[fieldName]]);

    return result;
}

exports.addPlanningAxi = async (req, res) => {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const axis = records.map(record => record.id);
        const units = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_axis WHERE axi IN (?) AND unit IN (?)', [axis, units]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAxis = existingResults.reduce((acc, result) => {
            acc[`${result.axi}-${result.unit}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingAxis[`${record.id}-${record.unit}`]) {
                existingRecords.push(existingAxis[`${record.id}-${record.unit}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_axis (axi, unit) VALUES (?, ?)', [record.id, record.unit]);
                const [getResult] = await connection.query('SELECT * FROM planning_axis WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await processRecords(insertedRecords, 'axis', 'axi');
        const processedExistingRecords = await processRecords(existingRecords, 'axis', 'axi');

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

exports.addPlanningObjective = async (req, res) => {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const objectives = records.map(record => record.id);
        const units = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_objectives WHERE objective IN (?) AND unit IN (?)', [objectives, units]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingObjectives = existingResults.reduce((acc, result) => {
            acc[`${result.objective}-${result.unit}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingObjectives[`${record.id}-${record.unit}`]) {
                existingRecords.push(existingObjectives[`${record.id}-${record.unit}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_objectives (objective, unit) VALUES (?, ?)', [record.id, record.unit]);
                const [getResult] = await connection.query('SELECT * FROM planning_objectives WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await processRecords(insertedRecords, 'objectives', 'objective');
        const processedExistingRecords = await processRecords(existingRecords, 'objectives', 'objective');

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

exports.addPlanningSubObjective = async (req, res) => {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const subObjective = records.map(record => record.subObjective);
        const [existingResults] = await connection.query('SELECT * FROM planning_subobjectives WHERE name IN (?)', [subObjective]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingObjectives = existingResults.reduce((acc, result) => {
            acc[`${result.name}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingObjectives[`${record.id}-${record.subObjective}`]) {
                existingRecords.push(existingObjectives[`${record.id}-${record.subObjective}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_subobjectives (name, objective) VALUES (?, ?)', [record.subObjective, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_subobjectives WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        res.json({
            status: 'success',
            result: { insertedRecords, existingRecords }
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Error inserting records' });
    } finally {
        connection.release();
    }
}

exports.addPlanningSkill = async (req, res) => {
    const name = req.body.name;
    const unit = req.body.unit;
    const [rows] = await sql.query('SELECT * FROM planning_skills WHERE name = ?', [name])

    if (rows.length === 0) {
        const [rows] = await sql.query('INSERT INTO planning_skills (name, unit) VALUES (?, ?)', [name, unit])

        if (rows.affectedRows > 0) {
            res.json({
                status: 'success',
                message: '¡La habilidad fue creado con exito!',
                result: {
                    id: rows.insertId,
                    name: name
                }
            });
        } else {
            res.json({
                status: 'error',
                message: '¡Error al crear la habilidad!',
            });
        }

    } else {
        res.json({
            status: 'error',
            message: '¡La habilidad ya está creado!',
        });
    }
}

exports.addPlanningAttitude = async (req, res) => {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const attitudes = records.map(record => record.id);
        const units = records.map(record => record.unit);
        const [existingResults] = await connection.query('SELECT * FROM planning_attitudes WHERE attitude IN (?) AND unit IN (?)', [attitudes, units]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingAttitudes = existingResults.reduce((acc, result) => {
            acc[`${result.attitude}-${result.unit}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingAttitudes[`${record.id}-${record.unit}`]) {
                existingRecords.push(existingAttitudes[`${record.id}-${record.unit}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_attitudes (attitude, unit) VALUES (?, ?)', [record.id, record.unit]);
                const [getResult] = await connection.query('SELECT * FROM planning_attitudes WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        const processedInsertedRecords = await processRecords(insertedRecords, 'attitudes', 'attitude');
        const processedExistingRecords = await processRecords(existingRecords, 'attitudes', 'attitude');

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

exports.addPlanningIndicator = async (req, res) => {
    const records = req.body;
    const connection = await sql.getConnection();

    try {
        await connection.beginTransaction();

        const insertedRecords = [];
        const existingRecords = [];

        // Obtener todos los registros existentes en una sola consulta
        const indicator = records.map(record => record.indicator);
        const [existingResults] = await connection.query('SELECT * FROM planning_indicators WHERE name IN (?)', [indicator]);

        // Crear un objeto para buscar registros existentes más fácilmente
        const existingIndicators = existingResults.reduce((acc, result) => {
            acc[`${result.name}`] = result;
            return acc;
        }, {});

        // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
        for (const record of records) {
            if (existingIndicators[`${record.indicator}`]) {
                existingRecords.push(existingIndicators[`${record.indicator}`]);
            } else {
                const [insertResult] = await connection.query('INSERT INTO planning_indicators (name, objective) VALUES (?, ?)', [record.indicator, record.id]);
                const [getResult] = await connection.query('SELECT * FROM planning_indicators WHERE id = ?', [insertResult.insertId]);
                insertedRecords.push(getResult[0]);
            }
        }

        await connection.commit();

        res.json({
            status: 'success',
            result: { insertedRecords, existingRecords }
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Error inserting records' });
    } finally {
        connection.release();
    }
}