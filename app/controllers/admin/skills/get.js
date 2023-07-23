const sql = require('../../../config/db.js');

module.exports = {
    getSelectSkills: async function (req, res) {
        try {
            const [rows] = await sql.query(`SELECT * FROM skills`)
            res.json(rows)
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
    },

    getIdSelectSkills: async function (id) {
        try {
            const [rows] = await sql.query(`SELECT * FROM skills WHERE id = ?`, [id])
            return rows;
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        }
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
        res.setHeader('Cache-Control', 'no-store');
        res.json(rows)
    },
}