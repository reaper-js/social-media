import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(401).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
        });
        const token = await user.generateAuthToken();
        if (user) { 
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
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