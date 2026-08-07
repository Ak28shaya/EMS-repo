const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Employee = require('./models/Employee');

(async () => {
  try {
    dotenv.config();
    await connectDB();
    const users = await User.find({ permissions: { $exists: true, $ne: [] } }).limit(20).lean();
    console.log('USERS', JSON.stringify(users.map(u => ({ email: u.email, permissions: u.permissions, role: u.role })), null, 2));
    const emps = await Employee.find({ permissions: { $exists: true, $ne: [] } }).limit(20).lean();
    console.log('EMPS', JSON.stringify(emps.map(e => ({ email: e.email, permissions: e.permissions, role: e.role })), null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();