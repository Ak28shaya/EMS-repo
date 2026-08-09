const express = require("express");
const authRoutes = require("./routes/authroutes");
const app = express();
app.use("/auth", authRoutes);
const routes = app._router.stack
  .filter(r => r.name === 'router')
  .flatMap(r => r.handle.stack)
  .filter(r => r.route)
  .map(r => ({ path: r.route.path, methods: r.route.methods }));
console.log(JSON.stringify(routes, null, 2));
