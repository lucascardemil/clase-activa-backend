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
                                            objectives.name AS name,
                                            planning_subobjectives_objectives.name AS name_subobjective,
                                            planning_subobjectives_objectives.objective AS objective 
                                        FROM planning_subobjectives_objectives
                                        INNER JOIN objectives ON planning_subobjectives_objectives.objective = objectives.id 
                                        WHERE objective = ?`, [id]);
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

    getIdIndicator: async function (req, res) {
        const { objective, unit } = req.params;
        const [rows] = await sql.query(`SELECT *
                                        FROM planning_indicators_objectives 
                                        WHERE objective = ? AND unit = ?`, [objective, unit]);
        res.json(rows)
    },

    

    getAllPlanning: async function (req, res) {
        try {
            const id = req.params.id;
            let query = `
                SELECT (@row_number:=@row_number + 1) AS id_temporal, t.*
                FROM (
                    SELECT
                        courses.name AS course,
                        units_subjects.name AS subject,
                        units.id AS id_unit,
                        units.name AS unit,
                        axis.id AS id_axi,
                        axis.name AS axi,
                        objectives.id AS id_objective,
                        objectives.oa AS oa,
                        objectives.name AS objective
                    FROM
                        objectives
                    INNER JOIN planning_units_objectives ON objectives.id = planning_units_objectives.objective
                    INNER JOIN planning_axis_objectives ON objectives.id = planning_axis_objectives.objective
                    INNER JOIN units ON planning_units_objectives.unit = units.id
                    INNER JOIN axis ON planning_axis_objectives.axi = axis.id
                    INNER JOIN subjects AS units_subjects ON units.subject = units_subjects.id
                    INNER JOIN subjects AS axis_subjects ON axis.subject = axis_subjects.id
                    INNER JOIN courses ON units_subjects.course = courses.id
                ) t, (SELECT @row_number := 0) r`;

            if (id > 0) {
                query += ` WHERE t.id_unit = ${id}`;
            }

            const [rows] = await sql.query(query);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
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
    
    

    getSubjectForUnit: async function (req, res) {
        try {
            const id = req.params.id;
            const [rows] = await sql.query(`SELECT * FROM units WHERE subject = ?`, [id])
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
    },

}

