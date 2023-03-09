module.exports = app => {
    const levels = require('../../controllers/teacher/levels.controller.js');
    var router = require("express").Router();

    router.get('/', levels.getAllLevels)
    router.get('/:id', levels.getIdLevel);
    router.post('/addLevel', levels.addLevel);
    router.put('/updateLevel', levels.updateLevel);
    router.delete('/deleteLevel/:id', levels.deleteLevel);

    app.use('/api/levels', router);
};