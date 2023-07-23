module.exports = app => {
    const attitudes = require('../../controllers/admin/attitudes/attitudes.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getSelectAttitudes', auth, attitudes.getSelectAttitudes);
    router.get('/getIdAttitude/:id', auth, attitudes.getIdAttitude);
    router.post('/addPlaningAttitude', auth , attitudes.addPlaningAttitude);
    router.put('/updatePlaningAttitude', auth , attitudes.updatePlaningAttitude);
    app.use('/api/attitudes', router);
};