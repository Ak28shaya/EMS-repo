const Notice = require("../models/notice");

// ==============================
// Create Notice
// ==============================
const createNotice = async (req, res) => {
  try {
    const { title, description, postedBy } = req.body;

    if (!title || !description || !postedBy) {
      return res.status(400).json({
        message: "Title, Description and Posted By are required",
      });
    }

    const notice = await Notice.create({
      title,
      description,
      postedBy,
    });

    res.status(201).json({
      message: "Notice Created Successfully",
      notice,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get All Active Notices
// ==============================
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({
      isDeleted: false,
    })
      .populate("postedBy")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Notice List",
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get Notice By ID
// ==============================
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("postedBy");

    if (!notice) {
      return res.status(404).json({
        message: "Notice Not Found",
      });
    }

    res.status(200).json({
      notice,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Notice
// ==============================
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!notice) {
      return res.status(404).json({
        message: "Notice Not Found",
      });
    }

    const updatedNotice = await Notice.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("postedBy");

    res.status(200).json({
      message: "Notice Updated Successfully",
      notice: updatedNotice,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Soft Delete Notice
// ==============================
const deleteNotice = async (req, res) => {
  try {
    console.log("🔥 SOFT DELETE NOTICE CALLED");

    const notice = await Notice.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!notice) {
      return res.status(404).json({
        message: "Notice Not Found",
      });
    }

    // Soft delete instead of permanently deleting
    await Notice.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      }
    );

    res.status(200).json({
      message: "Notice Deleted Successfully",
    });
  } catch (error) {
    console.error("Soft Delete Notice Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
};