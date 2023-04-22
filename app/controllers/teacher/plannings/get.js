const sql = require('../../../config/db.js');

module.exports = {

    getIdPlanning: async function (req, res) {
        const table = req.params.id;
        const [rows] = await sql.query('SELECT * FROM ' + table + '')
        res.json(rows)
    },

    getIdSubObjective: async function (req, res) {
        const id = req.params.id;
        // const [rows] = await sql.query('SELECT * FROM planning_subobjectives_objectives WHERE objective = ?', [id])
        const [rows] = await sql.query(`SELECT
                                            objectives.oa AS oa,
                                            planning_subobjectives_objectives.name AS name 
                                        FROM planning_subobjectives_objectives
                                        INNER JOIN objectives ON planning_subobjectives_objectives.objective = objectives.id 
                                        WHERE objective = ?`, [id])
        res.json(rows)
    },

    getIdAttitude: async function (req, res) {
        const id = req.params.id;
        const [rows] = await sql.query(`SELECT
                                            attitudes.oa AS oa,
                                            attitudes.name AS name,
                                            planning_units_attitudes.unit AS unit    
                                        FROM planning_units_attitudes
                                        INNER JOIN attitudes ON planning_units_attitudes.attitude = attitudes.id 
                                        WHERE unit = ?`, [id])
        res.json(rows)
    },

    getIdSkill: async function (req, res) {
        const id = req.params.id;
        const [rows] = await sql.query(`SELECT
                                            skills.oa AS oa,
                                            skills.name AS name,
                                            planning_units_skills.unit AS unit  
                                        FROM planning_units_skills
                                        INNER JOIN skills ON planning_units_skills.skill = skills.id 
                                        WHERE unit = ?`, [id])
        res.json(rows)
    },

    getIdObjective: async function (req, res) {
        const id = req.params.id;
        const [rows] = await sql.query(`SELECT 
                                        objectives.id AS id,
                                        objectives.oa AS oa,
                                        objectives.name AS name
                                        FROM planning_units_objectives 
                                        INNER JOIN objectives ON planning_units_objectives.objective = objectives.id
                                        WHERE planning_units_objectives.unit = ?`, [id])
        res.json(rows)
    },

    getSelectUnits: async function (req, res) {
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
            res.json(rows)
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
    },

    getSelectAxis: async function (req, res) {
        try {
            const [rows] = await sql.query(`SELECT 
                                            axis.id AS id,
                                            axis.name AS name,
                                            subjects.name AS subject 
                                            FROM axis
                                            INNER JOIN subjects ON axis.subject = subjects.id`)
            res.json(rows)
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
    },

    getAllPlanning: async function (req, res) {
        const [rows] = await sql.query(`SELECT
                                            courses.name AS course,
                                            subjects.name AS subject,
                                            units.id AS id_unit,
                                            units.name AS unit,
                                            axis.name AS axi,
                                            objectives.id AS id_objective,
                                            objectives.oa AS oa,
                                            objectives.name AS objective,
                                            planning_indicators_objectives.name AS indicator
                                        FROM
                                            objectives
                                        INNER JOIN planning_axis_objectives ON objectives.id = planning_axis_objectives.objective
                                        INNER JOIN axis ON planning_axis_objectives.axi = axis.id
                                        INNER JOIN planning_indicators_objectives ON objectives.id = planning_indicators_objectives.objective
                                        INNER JOIN planning_units_objectives ON objectives.id = planning_units_objectives.objective
                                        INNER JOIN units ON planning_units_objectives.unit = units.id
                                        INNER JOIN subjects ON units.subject = subjects.id
                                        INNER JOIN courses ON subjects.course = courses.id`);
        res.json(rows)
    },

    getSelectIdAxisObjectives: async function (data) {
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
    },

    getSelectIdUnitsObjectives: async function (data) {
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
    },

    getSelectIdUnitsSkills: async function (data) {
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
    },

    getSelectSubObjectives: async function (data) {
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
                                                                    objectives.oa AS name_oa,
                                                                    planning_subobjectives_objectives.objective AS objective,
                                                                    planning_subobjectives_objectives.id AS id
                                                                FROM
                                                                planning_subobjectives_objectives
                                                                INNER JOIN objectives ON planning_subobjectives_objectives.objective = objectives.id
                                                                WHERE planning_subobjectives_objectives.id IN (?)`, [id]);

            //Crear un objeto para buscar registros existentes más fácilmente
            const existingSubObjective = existingResults.reduce((acc, result) => {
                acc[result.id] = result;
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
    },

    getSelectUnitsAttitudes: async function (data) {
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
    },

    getSelectObjectiveIndicator: async function (data) {
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
                                                                    units.id AS id_unit,
                                                                    objectives.id AS id_objective,
                                                                    objectives.oa AS oa,
                                                                    units.name AS name
                                                                FROM
                                                                    planning_indicators_objectives
                                                                INNER JOIN units ON planning_indicators_objectives.unit = units.id
                                                                INNER JOIN objectives ON planning_indicators_objectives.objective = objectives.id
                                                                WHERE planning_indicators_objectives.unit IN (?) AND planning_indicators_objectives.objective IN (?)`, [unit, objective]);

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
    },

    loadSelectAxis: async function (id) {
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
    },

    handleResponse: async function (rows, message, table, oa) {
        if (rows.affectedRows > 0) {
            return {
                status: 'success',
                message: rows.insertId ? '¡La ' + message + ' creado con exito!' : '¡La ' + message + ' ya está creado!',
                result: {
                    id: rows.insertId,
                    table: table,
                    oa: oa
                }
            };
        } else {
            return {
                status: 'error',
                message: '¡Error al crear la ' + message + '!',
            };
        }
    },
}

