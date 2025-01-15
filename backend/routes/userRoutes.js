const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const userModel = require("../models/userModel");


// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
            .select('-password')  // Exclude password from response
            .populate('followers', 'name email profilePic')
            .populate('following', 'name email profilePic');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get public profile
router.get('/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
            .select('-password -email')  // Exclude sensitive information
            .populate('followers', 'name profilePic')
            .populate('following', 'name profilePic');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user followers
router.get('/:id/followers', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
            .populate('followers', 'name email profilePic bio');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.followers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get users being followed
router.get('/:id/following', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
            .populate('following', 'name email profilePic bio');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.following);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Follow a user
router.post('/follow/:id', auth, async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }

    try {
        const userToFollow = await userModel.findById(req.params.id);
        const currentUser = await userModel.findById(req.user.id);

        if (!userToFollow) {
            return res.status(404).json({ message: "User to follow not found" });
        }

        if (currentUser.following.includes(req.params.id)) {
            return res.status(400).json({ message: "You already follow this user" });
        }

        await currentUser.updateOne({ $push: { following: req.params.id } });
        await userToFollow.updateOne({ $push: { followers: req.user.id } });

        res.json({ message: "User followed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unfollow a user
router.delete('/unfollow/:id', auth, async(req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    try {
        const userToUnfollow = await userModel.findById(req.params.id);
        const currentUser = await userModel.findById(req.user.id);

        if (!userToUnfollow) {
            return res.status(404).json({ message: "User to unfollow not found" });
        }

        if (!currentUser.following.includes(req.params.id)) {
            return res.status(400).json({ message: "You don't follow this user" });
        }

        await currentUser.updateOne({ $pull: { following: req.params.id } });
        await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });

        res.json({ message: "User unfollowed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update profile
router.put('/update', auth, upload.single('profilePic'), async (req, res) => {
    try {
        const updateFields = {};
        const allowedUpdates = ['name', 'bio', 'website', 'location', 'socialLinks'];
        
        // Check which fields are being updated
        Object.keys(req.body).forEach(field => {
            if (allowedUpdates.includes(field)) {
                if (field === 'socialLinks') {
                    updateFields[field] = JSON.parse(req.body[field]);
                } else {
                    updateFields[field] = req.body[field];
                }
            }
        });

        // Handle profile picture upload
        if (req.file) {
            updateFields.profilePic = req.file.path;
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Block or unblock a user
router.put('/block/:id', auth, async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        //Toggle status between blocked and unblocked
        user.status = user.status === 'active' ? 'blocked' : 'active';
        await user.save();

        res.status(200).json({message: `User ${user.status} successfully`});
    }
    catch (err){
        res.status(500).json({message: err.message})
    }
    });

module.exports = router;