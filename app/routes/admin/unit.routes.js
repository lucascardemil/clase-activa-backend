module.exports = app => {
    const units = require('../../controllers/admin/units/units.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getSelectUnits', auth, units.getSelectUnits);
    router.post('/addPlanningUnit', auth , units.addPlanningUnit);
    router.put('/updatePlanningUnit', auth , units.updatePlanningUnit);
    router.post('/addPlanningUnitObjective', auth , units.addPlanningUnitObjective);
    router.post('/addPlanningUnitSkill', auth , units.addPlanningUnitSkill);
    router.post('/addPlanningUnitAttitude', auth , units.addPlanningUnitAttitude);
    app.use('/api/units', router);
};