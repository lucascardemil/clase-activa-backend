module.exports = app => {
    const axis = require('../../controllers/admin/axis/axis.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getIdAxisSubjects/:name/:subject', auth, axis.getIdAxisSubjects);
    router.get('/getSelectAxis', auth, axis.getSelectAxis);
    router.post('/addPlanningAxiObjective', auth , axis.addPlanningAxiObjective);
    router.post('/addPlaningSubjectAxi', auth , axis.addPlaningSubjectAxi);
    router.put('/updatePlaningSubjectAxi', auth , axis.updatePlaningSubjectAxi);
    app.use('/api/axis', router);
};