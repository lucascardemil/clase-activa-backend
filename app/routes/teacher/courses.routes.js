module.exports = app => {
    const courses = require('../../controllers/teacher/courses.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/getAllCourses', auth, courses.getAllCourses)
    router.get('/getIdCourse/:id', auth, courses.getIdCourse);
    router.get('/getCourseForLevel/:id', auth, courses.getCourseForLevel);
    router.get('/getCourseForSubjectName/:name', auth, courses.getCourseForSubjectName);
    router.get('/getAllCourseForSubject', auth, courses.getAllCourseForSubject);
    router.post('/addCourse', auth, courses.addCourse);
    router.put('/updateCourse', auth, courses.updateCourse);
    router.delete('/deleteCourse/:id', auth, courses.deleteCourse);

    app.use('/api/courses', router);
};