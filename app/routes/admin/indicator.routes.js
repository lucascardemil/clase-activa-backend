module.exports = app => {
    const indicators = require('../../controllers/admin/indicators/indicators.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.post('/addIndicator', auth , indicators.addIndicator);
    router.get('/getSelectIndicators', auth, indicators.getSelectIndicators);
    router.get('/getSelectIndicatorsObjectives', auth, indicators.getSelectIndicatorsObjectives);
    router.put('/updateIndicator', auth, indicators.updateIndicator);
    router.post('/addPlanningIndicator', auth , indicators.addPlanningIndicator);
    router.get('/getPreviewIndicator/:id', auth , indicators.getPreviewIndicator);
    router.put('/updatePlanningIndicator', auth, indicators.updatePlanningIndicator);
    app.use('/api/indicators', router);
};