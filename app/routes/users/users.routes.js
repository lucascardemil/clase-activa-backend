

module.exports = app =>{
    const users = require("../../controllers/users/users.controller.js");
    var router = require("express").Router();

    router.get('/', users.getAllUsers)
    router.get('/:id', users.getUserId); 
    router.post('/signIn', users.signIn); 
    router.post('/signUp', users.signUp); 
    router.put('/updateInfoPerson', users.updateInfoPerson); 
    router.put('/changePasswordUser', users.changePasswordUser);

    app.use('/api/users', router);
};