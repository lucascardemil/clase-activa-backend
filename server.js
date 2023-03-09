const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8080"
    // origin: "http://claseactiva.cl"
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


require('./app/routes/users/users.routes.js')(app);
require('./app/routes/teacher/courses.routes.js')(app);
require('./app/routes/teacher/levels.routes.js')(app);
require('./app/routes/teacher/subjects.routes.js')(app);
require('./app/routes/users/users_educations.routes.js')(app);
require('./app/routes/teacher/themes.routes.js')(app);
require('./app/routes/teacher/tests.routes.js')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);;
});

