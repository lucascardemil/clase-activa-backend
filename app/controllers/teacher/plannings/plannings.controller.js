const sql = require('../../../config/db.js');
const {
    getIdPlanning,
    getIdSubObjective,
    getIdAttitude,
    getIdSkill,
    getIdIndicator,
    getSelectUnits,
    getSelectAxis,
    getAllPlanning,
    getSelectIdAxisObjectives,
    getSelectIdUnitsObjectives,
    getSelectSubObjectives,
    getSelectUnitsAttitudes,
    getSelectObjectiveIndicator,
    getIdObjective,
    getSelectIdUnitsSkills,
    getIdUnitSelectAxis,
    getIdAxisSubjects,
    getSubjectForUnit
} = require('./get.js');


module.exports = {
    getIdPlanning,
    getIdSubObjective,
    getIdAttitude,
    getIdSkill,
    getIdIndicator,
    getSelectUnits,
    getSelectAxis,
    getAllPlanning,
    getSelectIdAxisObjectives,
    getSelectIdUnitsObjectives,
    getSelectSubObjectives,
    getSelectUnitsAttitudes,
    getSelectObjectiveIndicator,
    getIdObjective,
    getSelectIdUnitsSkills,
    getIdUnitSelectAxis,
    getIdAxisSubjects,
    getSubjectForUnit,

    addPlanningAxiObjective: async function (req, res) {
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
    },

    addPlanningUnitObjective: async function (req, res) {
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
    },

    addPlanningSubObjective: async function (req, res) {
        const records = req.body;
        const connection = await sql.getConnection();

        try {
            await connection.beginTransaction();

            const insertedRecords = [];
            const existingRecords = [];

            // Obtener todos los registros existentes en una sola consulta
            const id = records.map(record => record.id);
            const name = records.map(record => record.subObjective.toLowerCase());
            const [existingResults] = await connection.query('SELECT * FROM planning_subobjectives_objectives WHERE objective IN (?) AND LOWER(name) IN (?)', [id, name]);

            // Crear un objeto para buscar registros existentes más fácilmente
            const existingObjectives = existingResults.reduce((acc, result) => {
                acc[`${result.objective}-${result.name.toLowerCase()}`] = result;
                return acc;
            }, {});

            // Iterar sobre los registros y determinar cuáles deben insertarse y cuáles ya existen
            for (const record of records) {
                if (existingObjectives[`${record.id}-${record.subObjective.toLowerCase()}`]) {
                    existingRecords.push(existingObjectives[`${record.id}-${record.subObjective.toLowerCase()}`]);
                } else {
                    const [insertResult] = await connection.query('INSERT INTO planning_subobjectives_objectives (name, objective) VALUES (?, ?)', [record.subObjective, record.id]);
                    const [getResult] = await connection.query('SELECT * FROM planning_subobjectives_objectives WHERE id = ?', [insertResult.insertId]);
                    insertedRecords.push(getResult[0]);
                }
            }

            await connection.commit();

            const processedInsertedRecords = await getSelectSubObjectives(insertedRecords);
            const processedExistingRecords = await getSelectSubObjectives(existingRecords);

            res.json({
                status: 'success',
                result: { insertedRecords: processedInsertedRecords, existingRecords: processedExistingRecords }
            });
        } catch (error) {
            await connection.rollback();
            res.status(500).json({ error: error });
        } finally {
            connection.release();
        }
    },

    addPlanningObjectiveIndicator: async function (req, res) {
        const records = req.body;
        const connection = await sql.getConnection();

        try {
            await connection.beginTransaction();

            const insertedRecords = [];
            const existingRecords = [];

            // Obtener todos los registros existentes en una sola consulta
            const id = records.map(record => record.id);
            const unit = records.map(record => record.unit);
            let existingResults = [];
            if (id.length > 0 && unit.length > 0) {
                [existingResults] = await connection.query('SELECT * FROM planning_indicators_objectives WHERE objective IN (?) AND unit IN (?)', [id, unit]);
            }

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
                    const [insertResult] = await connection.query('INSERT INTO planning_indicators_objectives (name, objective, unit) VALUES (?, ?, ?)', [record.indicator, record.id, record.unit]);
                    const [getResult] = await connection.query('SELECT * FROM planning_indicators_objectives WHERE id = ?', [insertResult.insertId]);
                    insertedRecords.push(getResult[0]);
                }
            }

            await connection.commit();

            const processedInsertedRecords = await getSelectObjectiveIndicator(insertedRecords);
            const processedExistingRecords = await getSelectObjectiveIndicator(existingRecords);

            res.json({
                status: 'success',
                result: { insertedRecords: processedInsertedRecords, existingRecords: processedExistingRecords }
            });
        } catch (error) {
            await connection.rollback();
            res.status(500).json({ error: error });
        } finally {
            connection.release();
        }
    },

    addPlanningUnit: async function (req, res) {
        const { name, subject } = req.body;
        const lowerCaseName = name.toLowerCase();
        try {
            // Check if the unit already exists
            const [existingUnit] = await sql.query('SELECT * FROM units WHERE LOWER(name) = ?', [lowerCaseName]);

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
    },

    addPlanningUnitSkill: async function (req, res) {
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
    },

    addPlanningUnitAttitude: async function (req, res) {
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

            const processedInsertedRecords = await getSelectUnitsAttitudes(insertedRecords);
            const processedExistingRecords = await getSelectUnitsAttitudes(existingRecords);

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
    },

    addPlaningSubjectAxi: async function (req, res) {
        try {
            const { name, subject } = req.body;
            const lowerCaseName = name.toLowerCase();

            const [rows_founds] = await sql.query('SELECT * FROM axis WHERE LOWER(name) = ? AND subject IN (?)', [lowerCaseName, subject]);

            if (rows_founds.length === 0) {
                const [rows] = await sql.query('INSERT INTO axis (name,subject) VALUES (?,?)', [name, subject]);

                if (rows.affectedRows > 0) {

                    res.json({
                        status: 'success',
                        message: '¡La Eje creado con exito!',
                        result: {
                            id: rows.insertId,
                            name: name,
                            subject: subject
                        }
                    });

                } else {
                    res.json({
                        status: 'error',
                        message: '¡Error al crear el Eje!',
                    });
                }
            } else {
                res.json({
                    status: 'error',
                    message: '¡El Eje ya está creado!'
                });
            }

        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    addPlaningObjective: async function (req, res) {
        try {
            const { oa, name } = req.body;
            const lowerCaseName = name.toLowerCase();

            const [rows_founds] = await sql.query('SELECT * FROM objectives WHERE oa IN (?) AND LOWER(name) = ?', [oa, lowerCaseName]);

            if (rows_founds.length === 0) {
                const [rows] = await sql.query('INSERT INTO objectives (oa, name) VALUES (?,?)', [oa, name]);

                if (rows.affectedRows > 0) {

                    res.json({
                        status: 'success',
                        message: '¡El Objetivo creado con exito!',
                        result: {
                            id: rows.insertId,
                            name: name,
                            oa: oa
                        }
                    });

                } else {
                    res.json({
                        status: 'error',
                        message: '¡Error al crear el Objetivo!',
                    });
                }
            } else {
                res.json({
                    status: 'error',
                    message: '¡El Objetivo ya está creado!'
                });
            }

        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    addPlaningAttitude: async function (req, res) {
        try {
            const { oa, name } = req.body;
            const lowerCaseName = name.toLowerCase();

            const [rows_founds] = await sql.query('SELECT * FROM attitudes WHERE oa IN (?) AND LOWER(name) = ?', [oa, lowerCaseName]);

            if (rows_founds.length === 0) {
                const [rows] = await sql.query('INSERT INTO attitudes (oa, name) VALUES (?,?)', [oa, name]);

                if (rows.affectedRows > 0) {

                    res.json({
                        status: 'success',
                        message: '¡La Actitud creado con exito!',
                        result: {
                            id: rows.insertId,
                            name: name,
                            oa: oa
                        }
                    });

                } else {
                    res.json({
                        status: 'error',
                        message: '¡Error al crear la Actitud!',
                    });
                }
            } else {
                res.json({
                    status: 'error',
                    message: '¡La Actitud ya está creado!'
                });
            }

        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    addPlaningSkill: async function (req, res) {
        try {
            const { oa, name } = req.body;
            const lowerCaseName = name.toLowerCase();

            const [rows_founds] = await sql.query('SELECT * FROM skills WHERE oa IN (?) AND LOWER(name) = ?', [oa, lowerCaseName]);

            if (rows_founds.length === 0) {
                const [rows] = await sql.query('INSERT INTO skills (oa, name) VALUES (?,?)', [oa, name]);

                if (rows.affectedRows > 0) {

                    res.json({
                        status: 'success',
                        message: '¡La Habilidad creado con exito!',
                        result: {
                            id: rows.insertId,
                            name: name,
                            oa: oa
                        }
                    });

                } else {
                    res.json({
                        status: 'error',
                        message: '¡Error al crear la Habilidad!',
                    });
                }
            } else {
                res.json({
                    status: 'error',
                    message: '¡La Habilidad ya está creado!'
                });
            }

        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

}

