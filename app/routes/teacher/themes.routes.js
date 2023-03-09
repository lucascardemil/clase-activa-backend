module.exports = app => {
    const themes = require('../../controllers/teacher/themes.controller.js');
    var router = require("express").Router();

    router.get('/', themes.getAllThemes)
    router.get('/:id', themes.getIdTheme);
    router.get('/getThemeForSubject/:id', themes.getThemeForSubject);
    router.post('/addTheme', themes.addTheme);
    router.put('/updateTheme', themes.updateTheme);
    router.delete('/deleteTheme/:id', themes.deleteTheme);

    app.use('/api/themes', router);
};