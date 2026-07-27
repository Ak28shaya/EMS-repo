const Notice = require("../models/notice");

// Create Notice
const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);

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

module.exports = {
  createNotice,
  getNotices,
};