const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Webhook } = require('svix');
// const { sendWelcomeEmail, sendEmailToOwner } = require('./mailing');
const { verifyWebhook } = require('@clerk/express/webhooks');

// Webhook route for handling user creation
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('======Webhook received======');
    try {
        const evt = await verifyWebhook(req);
        if (!evt) {
            return res.status(400).json({ error: 'Invalid webhook signature' });
        }

        console.log('Webhook event type:', evt.type);
        console.log('Webhook event data:', evt.data);

        switch (evt.type) {
            case 'user.created':
                console.log('======User created event received======');
                const { id, email_addresses, first_name, last_name, image_url } = evt.data;
                console.log('Webhook payload:', {
                    id,
                    email_addresses,
                    first_name,
                    last_name,
                    image_url
                });
                const email = email_addresses?.[0]?.email_address;
                
                if (!id || !email) {
                    console.log('Missing required fields:', {
                        id: !id,
                        email: !email
                    });
                    throw new Error('Missing required user data: id and email are required');
                }

                const user = await User.create({
                    clerkId: id,
                    email,
                    first_name: first_name || '',
                    last_name: last_name || '',
                    image_url,
                    isRegistrationComplete: false,
                    isPay: false,
                    subscriptionId: null,
                    subscriptionStatus: 'none',
                    paymentUpdatedAt: null,
                    lastCheckoutAttempt: {
                        url: null,
                        timestamp: null
                    },
                    lastSignInAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                
                // await sendWelcomeEmail(email, first_name);
                // await sendEmailToOwner(email, first_name);
                console.log('Created user:', user);
                break;

            case 'user.updated':
                console.log('======User updated event received======');
                const { id: updateId, email_addresses: updateEmails, first_name: updateFirstName, 
                    last_name: updateLastName, image_url: updateImageUrl } = evt.data;
                const updateEmail = updateEmails?.[0]?.email_address;
                
                if (!updateId) {
                    throw new Error('Missing user ID in update webhook');
                }

                const updatedUser = await User.findOneAndUpdate(
                    { clerkId: updateId },
                    {
                        email: updateEmail,
                        first_name: updateFirstName,
                        last_name: updateLastName,
                        image_url: updateImageUrl,
                        updatedAt: new Date()
                    },
                    { new: true }
                );
                console.log('Updated user:', updatedUser);
                break;

            case 'user.deleted':
                console.log('======User deleted event received======');
                const { id: deleteId } = evt.data;
                
                if (!deleteId) {
                    throw new Error('Missing user ID in deletion webhook');
                }

                const deletedUser = await User.findOneAndDelete({ clerkId: deleteId });
                console.log('Deleted user:', deletedUser);
                break;

            case 'session.created':
                console.log('======Session created event received======');
                const { user_id, last_active_at } = evt.data;
                
                if (!user_id) {
                    console.error('Missing user_id in session webhook');
                    throw new Error('Missing user_id in session webhook');
                }

                console.log('Updating user:', user_id, 'with last_active_at:', last_active_at);
                const sessionUser = await User.findOneAndUpdate(
                    { clerkId: user_id },
                    { 
                        lastSignInAt: new Date(last_active_at),
                        updatedAt: new Date()
                    },
                    { new: true }
                );

                if (!sessionUser) {
                    console.error('User not found for session:', user_id);
                    // Don't throw error here as this might be a valid case where user exists in Clerk but not in our DB yet
                } else {
                    console.log('Updated user last sign in:', sessionUser);
                }
                break;

            default:
                console.log('Unknown event type received:', evt.type);
                break;
        }
        
        res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process webhook', 
            details: error.message 
        });
    }
});

module.exports = router;
