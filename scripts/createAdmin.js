require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@opera.com',
            password: 'admin123',
            isAdmin: true
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();