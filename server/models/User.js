const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Only 10 digits (normalized by setter)
const PHONE_REGEX = /^\d{10}$/;
// Standard email pattern; allow empty
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Salt rounds from env or default to 12
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    index: true,
    validate: {
      validator: v => PHONE_REGEX.test(v),
      message: 'Invalid phone number format'
    },
    set: v => v.replace(/\D/g, '') // Store only digits
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => !v || EMAIL_REGEX.test(v),
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(v) {
        return /[A-Z]/.test(v) && /\d/.test(v) && /[\W_]/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, number, and special character'
    }
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison with error handling
userSchema.methods.comparePassword = async function(candidate) {
  try {
    return await bcrypt.compare(candidate, this.password);
  } catch (err) {
    console.error('Password comparison error:', err);
    return false;
  }
};

// Virtual for formatted phone number
userSchema.virtual('formattedPhone').get(function() {
  const num = this.phone;
  return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
});

module.exports = mongoose.model('User', userSchema);
