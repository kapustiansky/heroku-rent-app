const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const availableRouter = require('./routers/available');
const rentRouter = require('./routers/rent');
require('./db/db');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(availableRouter);
app.use(rentRouter);

app.use(express.static('./'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});