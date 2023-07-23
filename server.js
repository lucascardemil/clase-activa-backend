require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./app/routes/users/users.routes.js')(app);
require('./app/routes/teacher/courses.routes.js')(app);
require('./app/routes/teacher/levels.routes.js')(app);
require('./app/routes/teacher/subjects.routes.js')(app);
require('./app/routes/users/users_educations.routes.js')(app);
require('./app/routes/teacher/themes.routes.js')(app);
require('./app/routes/teacher/tests.routes.js')(app);
require('./app/routes/admin/planning.routes.js')(app);
require('./app/routes/admin/unit.routes.js')(app);
require('./app/routes/admin/axi.routes.js')(app);
require('./app/routes/admin/objective.routes.js')(app);
require('./app/routes/admin/attitude.routes.js')(app);
require('./app/routes/admin/skill.routes.js')(app);
require('./app/routes/admin/subobjective.routes.js')(app);
require('./app/routes/admin/indicator.routes.js')(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

