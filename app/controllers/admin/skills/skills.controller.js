const sql = require('../../../config/db.js');
const {
    getIdSkill,
    getSelectSkills,
    getIdSelectSkills,
} = require('./get.js');


module.exports = {
    getIdSkill,
    getSelectSkills,
    getIdSelectSkills,

    addPlaningSkill: async function (req, res) {
        const { oa, name } = req.body;
        const lowerCaseName = name.toLowerCase();
        try {
            // Check if the unit already exists
            const [existingSkill] = await sql.query('SELECT * FROM skills WHERE oa IN (?) AND LOWER(name) = ?', [oa, lowerCaseName]);

            if (existingSkill.length > 0) {
                return res.json({ status: 'error', message: '¡La Habilidad ya está creado!'});
            }
            // Add the unit if it doesn't exist
            const [newSkill] = await sql.query('INSERT INTO skills (oa, name) VALUES (?,?)', [oa, name]);
            if (newSkill.affectedRows > 0) {
                const result = await getIdSelectSkills(newSkill.insertId);
                return res.json({ status: 'success', message: '¡La Habilidad creado con exito!', result: result[0] });
            }
        } catch (error) {
            console.error(error);
        }
    },

    updatePlaningSkill: async function (req, res) {
        const { id, oa, name } = req.body;
        const lowerCaseName = name.toLowerCase();
        try {
            // Check if the unit already exists
            const [existingSkill] = await sql.query('SELECT * FROM skills WHERE LOWER(name) = ? AND oa = ?', [lowerCaseName, oa]);

            if (existingSkill.length > 0) {
                return res.json({ status: 'error', message: '¡La Habilidad ya está creado!' });
            }
            // Add the unit if it doesn't exist
            const [newSkill] = await sql.query('UPDATE skills SET name = ?, oa = ? WHERE id = ?', [name, oa, id]);
            if (newSkill.affectedRows > 0) {
                const result = await getIdSelectSkills(id);
                return res.json({ status: 'success', message: '¡La Habilidad fue actualizada con éxito!', result: result[0] });
            }
        } catch (error) {
            console.error(error);
        }
    },
}