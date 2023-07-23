module.exports = app => {
    const subobjectives = require('../../controllers/admin/subobjectives/subobjectives.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.post('/addSubObjective', auth , subobjectives.addSubObjective);
    router.get('/getSelectSubObjectives', auth, subobjectives.getSelectSubObjectives);
    router.get('/getSelectSubObjectivesObjectives', auth, subobjectives.getSelectSubObjectivesObjectives);
    router.put('/updateSubObjective', auth, subobjectives.updateSubObjective);
    router.post('/addPlanningSubObjective', auth , subobjectives.addPlanningSubObjective);
    router.get('/getPreviewSubObjective/:id', auth , subobjectives.getPreviewSubObjective);
    router.put('/updatePlanningSubObjective', auth, subobjectives.updatePlanningSubObjective);
    app.use('/api/subobjectives', router);
};