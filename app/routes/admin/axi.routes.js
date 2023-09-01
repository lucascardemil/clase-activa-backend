module.exports = app => {
    const axis = require('../../controllers/admin/axis/axis.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getIdAxisSubjects/:name/:subject', auth, axis.getIdAxisSubjects);
    router.get('/getSelectAxis', auth, axis.getSelectAxis);
    router.get('/getSelectAxisObjectives', auth, axis.getSelectAxisObjectives);
    router.get('/getAxiForSubjectAndCourse/:id', auth, axis.getAxiForSubjectAndCourse);
    router.post('/addPlanningAxiObjective', auth , axis.addPlanningAxiObjective);
    router.put('/updatePlanningAxiObjective', auth , axis.updatePlanningAxiObjective);
    router.post('/addPlaningSubjectAxi', auth , axis.addPlaningSubjectAxi);
    app.use('/api/axis', router);
};