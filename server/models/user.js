import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    role: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    registeredClubs: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    registeredEvents: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
