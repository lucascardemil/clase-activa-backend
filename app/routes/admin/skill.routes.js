module.exports = app => {
    const skills = require('../../controllers/admin/skills/skills.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getSelectSkills', auth, skills.getSelectSkills);
    router.get('/getIdSkill/:id', auth, skills.getIdSkill);
    router.post('/addPlaningSkill', auth , skills.addPlaningSkill);
    router.put('/updatePlaningSkill', auth , skills.updatePlaningSkill);
    app.use('/api/skills', router);
};