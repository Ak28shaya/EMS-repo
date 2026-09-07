const Notification = require("../models/notification");
const Employee = require("../models/employee");

// Get notifications for current user (Admin or Employee)
const getMyNotifications = async (req, res) => {
  try {
    const userRole = String(req.user?.role || "").toLowerCase();
    const tokenEmployeeId = req.user?.employeeId;

    let filter = {};

    if (userRole === "admin") {
      filter = { recipientType: "Admin" };
    } else {
      let resolvedEmpId = tokenEmployeeId;
      if (!resolvedEmpId && req.user?.email) {
        const emp = await Employee.findOne({
          email: { $regex: `^${req.user.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
        });
        if (emp) resolvedEmpId = emp._id;
      }

      filter = {
        recipientType: "Employee",
        employeeId: resolvedEmpId,
      };
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      ...filter,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark notification(s) as read
const markNotificationsRead = async (req, res) => {
  try {
    const { notificationIds, markAll } = req.body;
    const userRole = String(req.user?.role || "").toLowerCase();
    const tokenEmployeeId = req.user?.employeeId;

    let filter = {};
    if (userRole === "admin") {
      filter = { recipientType: "Admin" };
    } else {
      filter = { recipientType: "Employee", employeeId: tokenEmployeeId };
    }

    if (markAll) {
      await Notification.updateMany({ ...filter, isRead: false }, { isRead: true });
    } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { isRead: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationsRead,
};
