const sql = require('../../../config/db.js');
const {
    getIdAttitude,
    getSelectAttitudes,
    getIdSelectAttitudes,
} = require('./get.js');

module.exports = {
    getIdAttitude,
    getSelectAttitudes,
    getIdSelectAttitudes,

    addPlaningAttitude: async function (req, res) {
        const { oa, name } = req.body;
        const lowerCaseName = name.toLowerCase();
        try {
            // Check if the unit already exists
            const [existingAttitude] = await sql.query('SELECT * FROM attitudes WHERE oa IN (?) AND LOWER(name) = ?', [oa, lowerCaseName]);

            if (existingAttitude.length > 0) {
                return res.json({ status: 'error', message: '¡La Actitud ya está creado!'});
            }
            // Add the unit if it doesn't exist
            const [newAttitude] = await sql.query('INSERT INTO attitudes (oa, name) VALUES (?,?)', [oa, name]);
            if (newAttitude.affectedRows > 0) {
                const result = await getIdSelectAttitudes(newAttitude.insertId);
                return res.json({ status: 'success', message: '¡La Actitud creado con exito!', result: result[0] });
            }
        } catch (error) {
            console.error(error);
        }
    },

    updatePlaningAttitude: async function (req, res) {
        const { id, oa, name } = req.body;
        const lowerCaseName = name.toLowerCase();
        try {
            // Check if the unit already exists
            const [existingAttitude] = await sql.query('SELECT * FROM attitudes WHERE LOWER(name) = ? AND oa = ?', [lowerCaseName, oa]);

            if (existingAttitude.length > 0) {
                return res.json({ status: 'error', message: '¡La Actitud ya está creado!' });
            }
            // Add the unit if it doesn't exist
            const [newAttitude] = await sql.query('UPDATE attitudes SET name = ?, oa = ? WHERE id = ?', [name, oa, id]);
            if (newAttitude.affectedRows > 0) {
                const result = await getIdSelectAttitudes(id);
                return res.json({ status: 'success', message: '¡La Actitud fue actualizada con éxito!', result: result[0] });
            }
        } catch (error) {
            console.error(error);
        }
    },
}