import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    const { name, email, password, username} = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(401).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            username,
            avatar: req.file.path
        });
        const token = await user.generateAuthToken();
        if (user) { 
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                token
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {

            const token = await user.generateAuthToken();
            res.json({
                name: user.name,
                email: user.email,
                token
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -tokens');
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};

export const checkUsername = async (req, res) => {
    try{
        const { username } = req.query;
        const user = await User.findOne({ username });
        res.json({available: !user});
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).select('username name avatar');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
