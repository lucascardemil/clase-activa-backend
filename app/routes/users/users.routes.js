module.exports = app =>{
    const users = require("../../controllers/users/users.controller.js");
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/', auth, users.getAllUsers)
    router.get('/:id', auth, users.getUserId); 
    router.post('/signIn', users.signIn); 
    router.post('/signUp', users.signUp); 
    router.put('/updateInfoPerson', auth, users.updateInfoPerson); 
    router.put('/changePasswordUser', auth, users.changePasswordUser);

    app.use('/api/users', router);
};