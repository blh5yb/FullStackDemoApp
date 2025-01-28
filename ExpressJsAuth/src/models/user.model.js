import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

const userSchema = new Schema({
    password: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true}
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default model('User', userSchema);