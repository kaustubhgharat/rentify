import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.'],
  },
  role: {
    type: String,
    enum: ['student', 'owner'],
    required: [true, 'Role is required.'],
    default: 'student',
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Listing' // This creates a reference to your Listing model
  }],
  favoriteRoommates: [{
  type: Schema.Types.ObjectId,
  ref: 'Roommate'
}],
}, { timestamps: true });

// Hash password before saving the user (no changes here)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = models.User || model('User', userSchema);

export default User;