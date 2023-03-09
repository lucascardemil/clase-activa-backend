module.exports = app => {
    const users_educations = require('../../controllers/users/users_educations.controller.js');
    var multipart = require('connect-multiparty');

    var router = require("express").Router();
    var multipartMiddleware = multipart({ uploadDir: '../FRONTEND/src/assets/uploads' });

    router.get('/getUserEducationLevel/:id', users_educations.getUserEducationLevel);
    router.get('/getUserEducationCourse/:id', users_educations.getUserEducationCourse);
    router.get('/getUserEducation/:id', users_educations.getUserEducation);
    router.get('/getSchoolUser/:id', users_educations.getSchoolUser);
    router.post('/updateInfoEducation', users_educations.updateInfoEducation);
    router.post('/updateImageSchool', multipartMiddleware, users_educations.updateImageSchool);

    app.use('/api/users_educations', router);

};