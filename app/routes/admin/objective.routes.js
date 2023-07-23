module.exports = app => {
    const objectives = require('../../controllers/admin/objectives/objectives.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getSelectObjectives', auth, objectives.getSelectObjectives);
    router.get('/getIdObjective/:id', auth, objectives.getIdObjective);
    router.post('/addPlaningObjective', auth , objectives.addPlaningObjective);
    router.put('/updatePlaningObjective', auth , objectives.updatePlaningObjective);
    app.use('/api/objectives', router);
};