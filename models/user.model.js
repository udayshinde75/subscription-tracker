import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        minLength: [3, "Name cannot be less than 3 characters"],
        maxLength: [20, "Name cannot exceed 20 characters"]
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{1,}$/, "Please provide a valid email"]
    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
        minLength: [6, "Password cannot be less than 6 characters"]
    },
    role:{
        type:String,
        enum: ["Administrator","User"],
        default:"User",
    }
}, {timestamps: true});

// Middleware to update role if missing (for existing users)
userSchema.pre("init", function (doc) {
    if (!doc.role) {
        doc.role = "User";
    }
});

const User = mongoose.model("User", userSchema);

export default User;