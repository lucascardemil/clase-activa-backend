module.exports = app => {
    const subjects = require('../../controllers/teacher/subjects.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/', auth, subjects.getAllSubjects)
    router.get('/:id', auth, subjects.getIdSubject);
    router.get('/getSubjectForCourse/:id', auth, subjects.getSubjectForCourse);
    router.post('/addSubject', auth, subjects.addSubject);
    router.put('/updateSubject', auth, subjects.updateSubject);
    router.delete('/deleteSubject/:id', auth, subjects.deleteSubject);

    app.use('/api/subjects', router);
};