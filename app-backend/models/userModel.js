import mongoose from "mongoose";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
        trim: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    uploads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Media",
        },
    ],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    }],
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ]
}, {
    timestamps: true,
});


userSchema.methods.follow = async function(userIdToFollow) {
    if (!this.following.includes(userIdToFollow)) {
        this.following.push(userIdToFollow);
        await this.save();
        // Add to other user's followers
        const userToFollow = await this.model('User').findById(userIdToFollow);
        if (!userToFollow.followers.includes(this._id)) {
            userToFollow.followers.push(this._id);
            await userToFollow.save();
        }
    }
    return this;
};

userSchema.methods.unfollow = async function(userIdToUnfollow) {
    this.following = this.following.filter(id => id.toString() !== userIdToUnfollow.toString());
    await this.save();
    
    const userToUnfollow = await this.model('User').findById(userIdToUnfollow);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== this._id.toString());
    await userToUnfollow.save();
    
    return this;
};

// Get follower count
userSchema.virtual('followerCount').get(function() {
    return this.followers.length;
});

// Get following count
userSchema.virtual('followingCount').get(function() {
    return this.following.length;
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);