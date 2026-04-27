const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require("crypto");

const adminSchema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: String,
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
}, { timestamps: true });

adminSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");

    const hash = createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");

    this.salt = salt;
    this.password = hash;

    next();
});

adminSchema.statics.matchedhash = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const hash = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    if (hash !== user.password) throw new Error("Wrong password");

    return {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
    };
};

module.exports = model("User", adminSchema);