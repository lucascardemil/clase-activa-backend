module.exports = app => {
    const plannigs = require('../../controllers/admin/plannings/get.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getAllPlanning/:id', auth , plannigs.getAllPlanning);
    router.get('/getIdPlanning/:id', auth , plannigs.getIdPlanning);
    router.get('/getSubjectForUnit/:id', auth, plannigs.getSubjectForUnit);
    app.use('/api/plannings', router);
};