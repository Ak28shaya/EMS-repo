const Notice = require("../models/Notice");

// Create Notice
const createNotice = async (req, res) => {
  try {
    const { title, description, postedBy } = req.body;

    // Required Field Validations
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    if (!postedBy) {
      return res.status(400).json({
        message: "Posted By is required",
      });
    }
    // Create Notice
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

// Get All Notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate(
      "postedBy",
      "employeeId firstName lastName"
    );

    const result = notices.map((notice) => ({
      _id: notice._id,
      title: notice.title,
      description: notice.description,
      postedBy: notice.postedBy
        ? {
            _id: notice.postedBy._id,
            employeeId: notice.postedBy.employeeId,
            employeeName: `${notice.postedBy.firstName} ${notice.postedBy.lastName}`,
          }
        : null,
      createdAt: notice.createdAt,
    }));

    res.status(200).json({
      message: "Notice List",
      count: result.length,
      notices: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Notice By ID
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate(
      "postedBy",
      "employeeId firstName lastName"
    );

    if (!notice) {
      return res.status(404).json({
        message: "Notice Not Found",
      });
    }

    res.status(200).json({
      message: "Notice Found",
      notice,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Notice
const updateNotice = async (req, res) => {
  try {
    const { title, description, postedBy } = req.body;

    // Check if Notice Exists
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice Not Found",
      });
    }

    // Required Field Validations
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    if (!postedBy) {
      return res.status(400).json({
        message: "Posted By is required",
      });
    }

    // Check Duplicate Notice
    const existingNotice = await Notice.findOne({
      title,
      description,
      _id: { $ne: req.params.id },
    });

    if (existingNotice) {
      return res.status(409).json({
        message: "Notice already exists",
      });
    }

    // Update Notice
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        postedBy,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("postedBy", "employeeId firstName lastName");

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

// Delete Notice
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice Not Found",
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Notice Deleted Successfully",
    });
  } catch (error) {
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