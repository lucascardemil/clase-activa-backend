module.exports = app => {
    const plannigs = require('../../controllers/teacher/plannings/plannings.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/:id', auth , plannigs.getAllPlanning);
    router.get('/getIdPlanning/:id', auth , plannigs.getIdPlanning);
    router.get('/getIdSubObjective/:id', auth, plannigs.getIdSubObjective);
    router.get('/getIdAttitude/:id', auth, plannigs.getIdAttitude);
    router.get('/getIdSkill/:id', auth, plannigs.getIdSkill);
    router.get('/getIdObjective/:id', auth, plannigs.getIdObjective);
    router.get('/getIdIndicator/:objective/:unit', auth, plannigs.getIdIndicator);
    router.get('/getIdAxisSubjects/:name/:subject', auth, plannigs.getIdAxisSubjects);
    router.get('/getSelectUnits', auth, plannigs.getSelectUnits);
    router.get('/getSelectAxis', auth, plannigs.getSelectAxis);
    router.get('/getSubjectForUnit/:id', auth, plannigs.getSubjectForUnit);
    router.post('/addPlanningUnit', auth , plannigs.addPlanningUnit);
    router.post('/addPlanningAxiObjective', auth , plannigs.addPlanningAxiObjective);
    router.post('/addPlanningUnitObjective', auth , plannigs.addPlanningUnitObjective);
    router.post('/addPlanningSubObjective', auth , plannigs.addPlanningSubObjective);
    router.post('/addPlanningUnitSkill', auth , plannigs.addPlanningUnitSkill);
    router.post('/addPlanningUnitAttitude', auth , plannigs.addPlanningUnitAttitude);
    router.post('/addPlanningObjectiveIndicator', auth , plannigs.addPlanningObjectiveIndicator);
    router.post('/addPlaningSubjectAxi', auth , plannigs.addPlaningSubjectAxi);
    router.post('/addPlaningObjective', auth , plannigs.addPlaningObjective);
    router.post('/addPlaningAttitude', auth , plannigs.addPlaningAttitude);
    router.post('/addPlaningSkill', auth , plannigs.addPlaningSkill);
    app.use('/api/plannings', router);
};