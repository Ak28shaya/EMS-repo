const jwt = require("jsonwebtoken");
// import the jsonwebtoken library so we can create and check tokens

const generateToken = (user) => {
    // function that creates a new token for a given user

    return jwt.sign(
        {
            userId: user._id,        // store the user's database ID inside the token
            employeeId: user.employeeId, // store the user's employee ID inside the token
            email: user.email,       // store the user's email inside the token
            role: user.role          // store the user's role (like admin/employee) inside the token
        },
        process.env.JWT_SECRET,      // secret key used to sign/encrypt the token (kept safe in env file)
        {
            expiresIn: process.env.JWT_EXPIRES_IN  // how long the token stays valid before expiring
        }
    );
    // jwt.sign() creates and returns the actual token string

};

const verifyToken = (token) => {
    // function that checks if a given token is valid

    return jwt.verify(token, process.env.JWT_SECRET);
    // checks the token using the same secret key
    // if valid -> returns the original data (userId, email, etc.)
    // if invalid/expired -> throws an error
};

module.exports = {
    generateToken,   // make generateToken available to other files
    verifyToken      // make verifyToken available to other files
};