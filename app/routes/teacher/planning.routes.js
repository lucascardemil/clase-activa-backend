module.exports = app => {
    const plannigs = require('../../controllers/teacher/plannings.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/', auth , plannigs.getAllPlanning);
    router.get('/:id', auth , plannigs.getIdPlanning);
    router.get('/getIdSubObjective/:id', auth, plannigs.getIdSubObjective);
    router.post('/addPlaningUnit', auth , plannigs.addPlaningUnit);
    router.post('/addPlanningObjective', auth , plannigs.addPlanningObjective);
    router.post('/addPlanningWithObjective', auth , plannigs.addPlanningWithObjective);
    router.post('/addPlanningWithUnit', auth , plannigs.addPlanningWithUnit);
    app.use('/api/plannings', router);
};