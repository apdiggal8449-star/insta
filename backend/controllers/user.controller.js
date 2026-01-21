import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
/*export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use, try a different one",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Optional: send JWT cookie on register
        // const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        // res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Register error:", error);

        // **SEND RESPONSE ALWAYS**
        return res.status(500).json({
            message: "Server error, please try again later",
            success: false
        });
    }
};*/


export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const file = req.file; // multer se aane wali file

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required", success: false });
    }

    // Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use", success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary if exists
    let imageUrl = "";
    if (file) {
      const cloudResponse = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "instaclone/users",
          quality: "auto:good",
          fetch_format: "auto",
          transformation: [{ width: 1080, crop: "limit" }]
        }
      );
      imageUrl = cloudResponse.secure_url;
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword, // hashed password
      profilePicture: imageUrl
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required", success: false });
    }

    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24*60*60*1000 });
    res.status(200).json({
      message: `Welcome back ${user.username}`,
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
/*export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
*/ 
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId)
            .select('-password')
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 } }
            })
            .populate('bookmarks');

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });

    } catch (error) {
        console.log("Get profile error:", error);
        return res.status(500).json({ success: false });
    }
};

/*export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};*/

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    let profilePhotoUrl;

    // if profile image uploaded
    if (req.file) {
      // 1️⃣ Compress / resize
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize({ width: 400, height: 400, fit: "inside" })
        .jpeg({ quality: 60 })
        .toBuffer();

      // 2️⃣ Convert to data URI
      const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;

      // 3️⃣ Upload to Cloudinary
      const cloudRes = await cloudinary.uploader.upload(fileUri, {
        folder: "profile",
      });

      profilePhotoUrl = cloudRes.secure_url;
    }

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio,
        gender,
        ...(profilePhotoUrl && { profilePicture: profilePhotoUrl }),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // patel
        const jiskoFollowKrunga = req.params.id; // shivani
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}