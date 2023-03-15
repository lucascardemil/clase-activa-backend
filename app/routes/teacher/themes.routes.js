module.exports = app => {
    const themes = require('../../controllers/teacher/themes.controller.js');
    const router = require("express").Router();
    const auth = require("../../middleware/auth.js");

    router.get('/', auth,themes.getAllThemes)
    router.get('/:id', auth, themes.getIdTheme);
    router.get('/getThemeForSubject/:id', auth, themes.getThemeForSubject);
    router.post('/addTheme', auth, themes.addTheme);
    router.put('/updateTheme', auth, themes.updateTheme);
    router.delete('/deleteTheme/:id', auth, themes.deleteTheme);

    app.use('/api/themes', router);
};