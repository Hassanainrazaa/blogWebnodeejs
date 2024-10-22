const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");


const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png"
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

// Hash the password before saving the user
userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString('hex');  // Generate a random salt
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;  // Save the salt
    user.password = hashedPassword;  // Save the hashed password
    next();
});
const { createTokenForUser, validateToken } = require('../services/authentication');

userSchema.static("matchPasswords", async function (email, password) {
    const user = await this.findOne({ email });  // You need to await the result of findOne
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHashed = createHmac("sha256", salt)
        .update(password).digest("hex");

    // Check if the hashed password matches the stored hashed password
    if (hashedPassword !== userProvidedHashed)
        throw new Error("Incorrect password");

    const token = createTokenForUser(user);
    console.log("token: " + token);
    return token;

    //    return { ...user.toObject(), password: undefined, salt: undefined };  // Remove sensitive fields
});



const User = model('User', userSchema);

module.exports = User;
