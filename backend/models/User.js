const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { bufferCommands: false });

// Hash password before saving
UserSchema.pre('save', function() {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
});

// Compare password method
UserSchema.methods.comparePassword = function(password) {
    console.log('DEBUG: comparing password...');
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
