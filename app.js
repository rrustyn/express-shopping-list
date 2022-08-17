"use strict";

const express = require("express");

const app = express();

const itemsRoutes = require("./itemsRoutes");

app.use('/items', itemsRoutes);

module.exports = app;