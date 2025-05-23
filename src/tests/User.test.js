const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('User Model Test', () => {
    const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'
    };

    it('should create a new user successfully', async () => {
        const user = await User.create(userData);
        expect(user.name).toBe(userData.name);
        expect(user.email).toBe(userData.email);
        expect(user.isAdmin).toBe(false);
    });

    it('should hash the password before saving', async () => {
        const user = await User.create(userData);
        expect(user.password).not.toBe(userData.password);
        const isMatch = await bcrypt.compare(userData.password, user.password);
        expect(isMatch).toBe(true);
    });

    it('should not save duplicate email', async () => {
        await User.create(userData);
        let err;
        try {
            await User.create(userData);
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
    });

    it('should correctly compare passwords', async () => {
        const user = await User.create(userData);
        const isMatch = await user.comparePassword(userData.password);
        expect(isMatch).toBe(true);
        const wrongMatch = await user.comparePassword('wrongpassword');
        expect(wrongMatch).toBe(false);
    });
});