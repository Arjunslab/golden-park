import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  sn: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    
  },
  area: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  
  },
  maint: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
   
  },
  role: {
    type: String,
    enum: ["Admin", "Shop Owner"],
    
  }
});

const installmentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    paymentId: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

const responseSchema = new mongoose.Schema({
  shopnumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Shop Owner"],
    required: true,
    default: "Shop Owner",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  remainingAmount: {
    type: Number,
    required: true,
  },
  installments: [installmentSchema],
});

const User = mongoose.model("User", userSchema);
const Response = mongoose.model("Response", responseSchema);

export { User, Response };
export default User;
