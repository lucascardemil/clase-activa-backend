module.exports = app => {
    const plannigs = require('../../controllers/teacher/plannings.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/', auth , plannigs.getAllPlanning);
    router.get('/:id', auth , plannigs.getIdPlanning);
    router.get('/getIdSubObjective/:id', auth, plannigs.getIdSubObjective);
    router.get('/getUnitForSubject/:id', auth, plannigs.getUnitForSubject);
    router.get('/getAxiForUnit/:id', auth, plannigs.getAxiForUnit);
    router.post('/addPlaning', auth , plannigs.addPlaning);
    router.post('/addPlanningUnit', auth , plannigs.addPlanningUnit);
    router.post('/addPlanningAxi', auth , plannigs.addPlanningAxi);
    router.post('/addPlanningObjective', auth , plannigs.addPlanningObjective);
    router.post('/addPlanningSubObjective', auth , plannigs.addPlanningSubObjective);
    router.post('/addPlanningSkill', auth , plannigs.addPlanningSkill);
    router.post('/addPlanningAttitude', auth , plannigs.addPlanningAttitude);
    router.post('/addPlanningIndicator', auth , plannigs.addPlanningIndicator);
    app.use('/api/plannings', router);
};