module.exports = app => {
    const levels = require('../../controllers/teacher/levels.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/', auth, levels.getAllLevels)
    router.get('/levelsWithoutCourses', auth, levels.getAllLevelsWithoutCourses)
    router.get('/:id', auth, levels.getIdLevel);
    router.post('/addLevel', auth ,levels.addLevel);
    router.put('/updateLevel', auth ,levels.updateLevel);
    router.delete('/deleteLevel/:id', auth, levels.deleteLevel);

    app.use('/api/levels', router);
};