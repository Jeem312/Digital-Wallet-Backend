"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserValidation = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.registerUserValidation = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name is required and must be at least 3 characters."),
    email: zod_1.z.string().email("Invalid email format."),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters."),
    phone: zod_1.z.string().min(10, "Phone number is required."),
    address: zod_1.z.string().optional(),
    picture: zod_1.z.string().optional(),
    role: zod_1.z.enum([user_interface_1.Role.USER, user_interface_1.Role.AGENT]).optional(),
});
