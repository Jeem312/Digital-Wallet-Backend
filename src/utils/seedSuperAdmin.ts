import { envVars } from "../config/envConfig";
import bcryptjs from "bcryptjs";
import { User } from "../app/modules/user/user.model";
import { Role } from "../app/modules/user/user.interface";

export const seedSuperAdmin = async () => {
  try {
    // Check if Super Admin already exists
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("✅ Super Admin already exists.");
      return;
    }


    if (!envVars.SUPER_ADMIN_PASSWORD) {
      throw new Error("SUPER_ADMIN_PASSWORD is not defined in environment variables.");
    }

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

 
    const payload = {
      name: "Super Admin",
      phone: "1234567890",
      role: Role.ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      isDeleted: false,
      status: "active",
    };

    // Create Super Admin
    const superAdmin = await User.create(payload);
    console.log("🎉 Super Admin Created Successfully:", superAdmin.email);
  } catch (error) {
    console.error("❌ Super Admin Seeding Error:", error);
  }
};
