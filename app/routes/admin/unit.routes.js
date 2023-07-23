module.exports = app => {
    const units = require('../../controllers/admin/units/units.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getSelectUnits', auth, units.getSelectUnits);
    router.get('/getSelectUnitsObjectives', auth, units.getSelectUnitsObjectives);
    router.get('/getSelectUnitsSkills', auth, units.getSelectUnitsSkills);
    router.get('/getSelectUnitsAttitudes', auth, units.getSelectUnitsAttitudes);
    router.post('/addPlanningUnit', auth , units.addPlanningUnit);
    router.put('/updatePlanningUnit', auth , units.updatePlanningUnit);
    router.post('/addPlanningUnitObjective', auth , units.addPlanningUnitObjective);
    router.post('/addPlanningUnitSkill', auth , units.addPlanningUnitSkill);
    router.post('/addPlanningUnitAttitude', auth , units.addPlanningUnitAttitude);
    router.put('/updatePlanningUnitObjective', auth , units.updatePlanningUnitObjective);
    router.put('/updatePlanningUnitSkill', auth , units.updatePlanningUnitSkill);
    router.put('/updatePlanningUnitAttitude', auth , units.updatePlanningUnitAttitude);
    app.use('/api/units', router);
};