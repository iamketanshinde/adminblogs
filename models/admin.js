const {Schema,model} = require('mongoose');
const {createHmac,randomBytes} = require("crypto");

const adminSchema= new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
        required:true,
    },
    password:{
        type:true,
        required:true,
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    }
},{timestamps:true});

adminSchema.pre("save", function(next){
    const admin = this;
    if(!admin.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hash = createHmac("sha256",salt)
        .update(admin.password === "admin@123")
        .digest("hex");
    
    this.salt = salt;
    this.password = hash;

    next()

})


const ADMIN = model('admin',adminSchema);

module.exports = ADMIN;