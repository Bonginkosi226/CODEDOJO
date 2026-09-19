// Grant or revoke the admin (teacher) role. This is the ONLY way to change a
// role — the API never accepts one from a request.
//
// Usage (from backend/):
//   node scripts/setRole.mjs teacher@school.edu admin
//   node scripts/setRole.mjs teacher@school.edu student

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const [email, role = 'admin'] = process.argv.slice(2);

if (!email || !['admin', 'student'].includes(role)) {
  console.error('Usage: node scripts/setRole.mjs <email> [admin|student]');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URL);

const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { $set: { role } }, { new: true });

if (!user) {
  console.error(`No user found with email ${email}`);
  await mongoose.disconnect();
  process.exit(1);
}

console.log(`${user.username} <${user.email}> is now: ${user.role}`);
await mongoose.disconnect();
