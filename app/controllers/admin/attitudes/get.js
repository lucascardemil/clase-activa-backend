
const sql = require('../../../config/db.js');

module.exports = {

    getSelectAttitudes: async function (req, res) {
        try {
            const [rows] = await sql.query(`SELECT * FROM attitudes`)
            res.json(rows)
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
    },
    
    getIdSelectAttitudes: async function (id) {
        try {
            const [rows] = await sql.query(`SELECT * FROM attitudes WHERE id = ?`, [id])
            return rows;
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
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
}