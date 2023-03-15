module.exports = app => {
    const tests = require('../../controllers/teacher/tests.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/', auth, tests.getAllTest)
    router.get('/:id', auth, tests.getIdTest);
    router.post('/addTest', auth, tests.addTest);
    router.put('/updateTest', auth, tests.updateTest);
    router.delete('/deleteTest/:id', auth, tests.deleteTest);

    app.use('/api/tests', router);
};