const { sendEmail } = require("../middleware/sendEmail");
const Post = require("../models/Post");
const UserModel = require("../models/User");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    let user = await UserModel.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User already Exist" });

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    user = await UserModel.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    const token = await user.generateToken();

    return res
      .status(201)
      .cookie("token", token, options)
      .json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
      .select("+password")
      .populate("posts followers following");
    if (!user) {
      res.status(400).json({ success: false, message: "User does not exist" });
    }
    const isMatch = await user.matchPassword(password);

    const token = await user.generateToken();

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
    }

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    return res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, user, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await UserModel.findById(req.params.id);
    const loggedInUser = await UserModel.findById(req.user._id);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexFollowers = userToFollow.following.indexOf(userToFollow._id);

      loggedInUser.following.splice(indexFollowing, 1);
      userToFollow.followers.splice(indexFollowers, 1);
      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);
      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.logoutUser = (req, res) => {
  ("logout user called");
  try {
    return res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Old And New Password",
      });
    }
    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({
      success: false,
      message: "Password Updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const { name, email, avatar } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (avatar) {
      let uploadImage = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user.avatar.public_id = uploadImage.public_id;
      user.avatar.url = uploadImage.secure_url;
    }

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMyProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    //delete avatar from cloudinary
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.remove();
    // logout user after deleting profile
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    //Deleting all posts of the user
    posts.map(async (singlePostId) => {
      const post = await Post.findById(singlePostId);
      await cloudinary.v2.uploader.destroy(post.image.public_id);
      await post.remove();
    });

    //Removing User from Followers Following
    followers.map(async (singleFollowerId) => {
      const follower = await UserModel.findById(singleFollowerId);
      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    });
    //Removing User from Following's followers
    following.map(async (singleFollowingId) => {
      const following = await UserModel.findById(singleFollowingId);
      const index = following.followers.indexOf(userId);
      following.followers.splice(index, 1);
      await following.save();
    });

    //Removing all comments of user from all Posts
    const allPosts = await Post.find();

    for (let i = 0; i < allPosts.length; i++) {
      const singlePost = await Post.findById(allPosts[i]._id);
      for (let j = 0; j < singlePost.comments.length; j++) {
        if (singlePost.comments[j].user === userId) {
          singlePost.comments.splice(j, 1);
        }
      }
      await singlePost.save();
    }

    //Removing all likes of user from all Posts

    for (let i = 0; i < allPosts.length; i++) {
      const singlePost = await Post.findById(allPosts[i]._id);
      for (let j = 0; j < singlePost.likes.length; j++) {
        if (singlePost.likes[j] === userId) {
          singlePost.likes.splice(j, 1);
        }
      }
      await singlePost.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Deleted",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate(
      "posts followers following"
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate(
      "followers following"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getUserPosts = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const posts = [];
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments comments.user"
      );
      posts.push(post);
    }

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      name: {
        $regex: req.query.name,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetPasswordToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset/password/${resetPasswordToken}`;
    const message = `Reset Your Password by clicking on the Link ${resetUrl}`;
    const html = `Reset Your Password by clicking on the Link <a href=${resetUrl}>${resetUrl}</a>`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid or has expired" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyPosts = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments comments.user"
      );
      posts.push(post);
    }

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
