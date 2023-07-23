
const sql = require('../../../config/db.js');
const {
    getIdObjective,
    getSelectObjectives,
    getIdSelectObjectives,
} = require('./get.js');

module.exports = {
    getIdObjective,
    getSelectObjectives,
    getIdSelectObjectives,

    addPlaningObjective: async function (req, res) {
        const { oa, name } = req.body;
        const lowerCaseName = name.toLowerCase();
        try {
            // Check if the unit already exists
            const [existingObjective] = await sql.query('SELECT * FROM objectives WHERE oa IN (?) AND LOWER(name) = ?', [oa, lowerCaseName]);

            if (existingObjective.length > 0) {
                return res.json({ status: 'error', message: '¡El Objetivo ya está creado!'});
            }
            // Add the unit if it doesn't exist
            const [newObjective] = await sql.query('INSERT INTO objectives (oa, name) VALUES (?,?)', [oa, name]);
            if (newObjective.affectedRows > 0) {
                const result = await getIdSelectObjectives(newObjective.insertId);
                return res.json({ status: 'success', message: '¡El Objetivo creado con exito!', result: result[0] });
            }
        } catch (error) {
            console.error(error);
        }
    },

    updatePlaningObjective: async function (req, res) {
        const { id, oa, name } = req.body;
        const lowerCaseName = name.toLowerCase();
        try {
            // Check if the unit already exists
            const [existingAxi] = await sql.query('SELECT * FROM objectives WHERE LOWER(name) = ? AND oa = ?', [lowerCaseName, oa]);

            if (existingAxi.length > 0) {
                return res.json({ status: 'error', message: '¡El objetivo ya está creada!' });
            }
            // Add the unit if it doesn't exist
            const [newAxi] = await sql.query('UPDATE objectives SET name = ?, oa = ? WHERE id = ?', [name, oa, id]);
            if (newAxi.affectedRows > 0) {
                const result = await getIdSelectObjectives(id);
                return res.json({ status: 'success', message: '¡El objetivo fue actualizado con éxito!', result: result[0] });
            }
        } catch (error) {
            console.error(error);
        }
    },
}