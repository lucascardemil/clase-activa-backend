const sql = require('../../../config/db.js');

module.exports = {
    getSelectObjectives: async function (req, res) {
        try {
            const [rows] = await sql.query(`SELECT * FROM objectives`)
            res.json(rows)
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
    },
    getIdSelectObjectives: async function (id) {
        try {
            const [rows] = await sql.query(`SELECT * FROM objectives WHERE id = ?`, [id])
            return rows;
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
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
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    },
}