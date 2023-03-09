module.exports = app => {
    const subjects = require('../../controllers/teacher/subjects.controller.js');
    var router = require("express").Router();

    router.get('/', subjects.getAllSubjects)
    router.get('/:id', subjects.getIdSubject);
    router.get('/getSubjectForCourse/:id', subjects.getSubjectForCourse);
    router.post('/addSubject', subjects.addSubject);
    router.put('/updateSubject', subjects.updateSubject);
    router.delete('/deleteSubject/:id', subjects.deleteSubject);

    app.use('/api/subjects', router);
};