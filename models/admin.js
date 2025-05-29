const {Schema,model} = require('mongoose');
const {createHmac,randomBytes} = require("crypto");

const adminSchema= new Schema({
        fullname: {
            type: String, required: true 
        },
        email: { 
            type: String,
            required: true, 
            unique: true 
        },
        salt: { 
            type: String 
        },
        password: { 
            type: String, 
            required: true 
        },
        role: { 
            type: String, 
            enum: ["USER", "ADMIN"], 
            default: "USER" 
        }
},
    { timestamps: true }
);

adminSchema.pre("save", function(next){
    const admin = this;
    if(!admin.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hash = createHmac("sha256",salt)
        .update(admin.password)
        .digest("hex");
    
    admin.salt = salt;
    admin.password = hash;

    next();

})

adminSchema.static("matchedhash", function (email, password){
    const admin = this.findOne({email});
    if(!admin) return false;

    const salt = admin.salt;
    const hash = admin.password;

    const adminHashPass = createHmac("sha256",salt)
        .update(password)
        .digest("hex");

    return hash === adminHashPass;
})

const User = model('user',adminSchema);

module.exports = User;