import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: [3, "Subscription name cannot be less than 3 characters"],
        maxLength: [100, "Subscription name cannot exceed 100 characters"]
    },
    price:{
        type:Number,
        required: [true, "Subscription price is required"],
        min: [0, "Subscription price must be greater than 0"]
    },
    currency:{
        type: String,
        required: [true, "Currency is required"],
        enum: ["USD", "EUR", "GBP","INR"],
        default:"INR"
    },
    frequency:{
        type: String,
        required: [true, "Frequency is required"],
        enum: ["daily", "weekly", "monthly", "yearly"],
        default:"monthly"
    },
    category:{
        type:String,
        enum: ["food", "clothing", "electronics", "books", "health", "beauty", "sports", "other","entertainment","education"],
        default:"other",
        required: [true, "Category is required"]
    },
    paymentMethod:{
        type: String,
        enum: ["credit card", "debit card", "net banking", "upi", "wallet"],
        default:"credit card",
        required: [true, "Payment method is required"]
    },
    status:{
        type: String,
        enum: ["active", "cancelled","expired"],
        default:"active"
    },
    startDate:{
        type: Date,
        required: [true, "Start date is required"],
        validate:{
            validator:function(value){ value <= new Date()},
            message: "Start date cannot be a future date"
        }
    },
    renewalDate:{
        type: Date,
        validate:{
            validator: function (value){
                return value > this.startDate
            },
            message: "Renewal date must be greater than start date"
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true
    } 
}, {timestamps: true});


subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365
        }
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if(this.renewalDate < new Date()){
        this.status = "expired";
    }

    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;