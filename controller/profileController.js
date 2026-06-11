const Profile = require("../models/Profile");

// Create Profile
const createProfile = async (req, res) => {
  try {
    const { name, rollNumber, class: className, department, teacher, phoneNumber } = req.body;

    // 1. Validation: check if all fields are provided
    if (!name || !rollNumber || !className || !department || !teacher || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, rollNumber, class, department, teacher, phoneNumber)",
      });
    }

    // 2. Check if profile already exists for the logged-in user
    const profileExists = await Profile.findOne({ user: req.user.id });
    if (profileExists) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user",
      });
    }

    // 3. Create profile
    const newProfile = new Profile({
      name,
      rollNumber,
      class: className,
      department,
      teacher,
      phoneNumber,
      user: req.user.id,
    });

    await newProfile.save();

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (err) {
    console.error("Error in profile creation:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("Error in fetching profile:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, rollNumber, class: className, department, teacher, phoneNumber } = req.body;

    const updateData = {};

    // Validate and build update object
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Name must be a non-empty string",
        });
      }
      updateData.name = name.trim();
    }

    if (rollNumber !== undefined) {
      if (typeof rollNumber !== "string" || rollNumber.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Roll number must be a non-empty string",
        });
      }
      updateData.rollNumber = rollNumber.trim();
    }

    if (className !== undefined) {
      if (typeof className !== "string" || className.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Class must be a non-empty string",
        });
      }
      updateData.class = className.trim();
    }

    if (department !== undefined) {
      if (typeof department !== "string" || department.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Department must be a non-empty string",
        });
      }
      updateData.department = department.trim();
    }

    if (teacher !== undefined) {
      if (typeof teacher !== "string" || teacher.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Teacher must be a non-empty string",
        });
      }
      updateData.teacher = teacher.trim();
    }

    if (phoneNumber !== undefined) {
      if (typeof phoneNumber !== "string" || phoneNumber.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Phone number must be a non-empty string",
        });
      }
      updateData.phoneNumber = phoneNumber.trim();
    }

    // Check if at least one field was provided
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update (name, rollNumber, class, department, teacher, phoneNumber)",
      });
    }

    // Find profile by user ID and update it
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (err) {
    console.error("Error in updating profile:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Delete Profile
const deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await Profile.findOneAndDelete({ user: req.user.id });

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      profile: deletedProfile,
    });
  } catch (err) {
    console.error("Error in deleting profile:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
};
