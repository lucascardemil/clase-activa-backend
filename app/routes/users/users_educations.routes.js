module.exports = app => {
    const users_educations = require('../../controllers/users/users_educations.controller.js');
    const multipart = require('connect-multiparty');

    const router = require("express").Router();
    const multipartMiddleware = multipart({ uploadDir: 'C:/Users/Lucas/Desktop/proyecto-clase-activa-frontend/src/assets/uploads' });
    // const multipartMiddleware = multipart({ uploadDir: '/home/claseac2/public_html/2023/assets/uploads' });
    const auth = require("../../middleware/auth.js");

    router.get('/getUserEducationLevel/:id', auth, users_educations.getUserEducationLevel);
    router.get('/getUserEducationCourse/:id', auth, users_educations.getUserEducationCourse);
    router.get('/getUserEducation/:id', auth, users_educations.getUserEducation);
    router.get('/getSchoolUser/:id', auth, users_educations.getSchoolUser);
    router.post('/updateInfoEducation', auth, users_educations.updateInfoEducation);
    router.post('/updateImageSchool', auth, multipartMiddleware, users_educations.updateImageSchool);

    app.use('/api/users_educations', router);

};