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


const User = model('user',adminSchema);

module.exports = User;