module.exports = app => {
    const tests = require('../../controllers/teacher/tests.controller.js');
    var router = require("express").Router();

    router.get('/', tests.getAllTest)
    router.get('/:id', tests.getIdTest);
    router.post('/addTest', tests.addTest);
    router.put('/updateTest', tests.updateTest);
    router.delete('/deleteTest/:id', tests.deleteTest);

    app.use('/api/tests', router);
};