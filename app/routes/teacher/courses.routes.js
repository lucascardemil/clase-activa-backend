module.exports = app => {
    const courses = require('../../controllers/teacher/courses.controller.js');
    var router = require("express").Router();

    router.get('/', courses.getAllCourses)
    router.get('/:id', courses.getIdCourse);
    router.get('/getCourseForLevel/:id', courses.getCourseForLevel);
    router.post('/addCourse', courses.addCourse);
    router.put('/updateCourse', courses.updateCourse);
    router.delete('/deleteCourse/:id', courses.deleteCourse);

    app.use('/api/courses', router);
};