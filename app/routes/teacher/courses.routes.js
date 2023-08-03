module.exports = app => {
    const courses = require('../../controllers/teacher/courses.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/', auth, courses.getAllCourses)
    router.get('/:id', auth, courses.getIdCourse);
    router.get('/getCourseForLevel/:id', auth, courses.getCourseForLevel);
    router.get('/getCourseForSubject/:name', auth, courses.getCourseForSubject);
    router.post('/addCourse', auth, courses.addCourse);
    router.put('/updateCourse', auth, courses.updateCourse);
    router.delete('/deleteCourse/:id', auth, courses.deleteCourse);

    app.use('/api/courses', router);
};