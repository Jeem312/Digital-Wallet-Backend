import { z } from "zod";
import { Role } from "./user.interface";

export const registerUserValidation = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters."),
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string().min(10, "Phone number is required."),
  address: z.string().optional(),
  picture: z.string().optional(),
  role: z.enum([Role.USER, Role.AGENT]).optional(),
});
