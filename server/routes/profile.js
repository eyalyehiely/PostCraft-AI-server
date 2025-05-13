const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const editProfile = async (userId, params) => {
    const response = await axios.patch(`https://api.clerk.com/v1/users/${userId}`, {
        first_name: params.firstName,
        last_name: params.lastName
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
        }
    });
    return response;
}

router.patch('/edit-profile', ClerkExpressRequireAuth() , async (req, res) => {
    try {
        const userId = req.auth.userId;
        const params = req.body;
        const response = await editProfile(userId, params);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.get('/user-payments-data/:userId', ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findOne({ clerkId: userId });
    res.status(200).json(user);
});

module.exports = router;