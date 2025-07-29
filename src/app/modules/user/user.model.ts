import { Schema, model } from "mongoose";
import { IUser, Role, AccountStatus } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
    picture: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    status: { type: String, enum: Object.values(AccountStatus), default: AccountStatus.ACTIVE },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
   
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
