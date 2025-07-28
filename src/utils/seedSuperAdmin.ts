import { envConfig } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface"
import User from "../modules/user/user.models"
import bcryptjs from "bcryptjs"

export const seedSuperAdmin = async ()=>{
    try {

        const isSuperAdminExist = await User.findOne({email:envConfig.SUPER_ADMIN_EMAIL})
        if (isSuperAdminExist) {
            console.log("Super Admin Already Exist")
            return
            
        }
        const hashedPassword = await bcryptjs.hash(envConfig.SUPER_ADMIN_PASSWORD,Number(envConfig.BCRYPT_SALT_ROUND))
           
        const authProvider : IAuthProvider ={
            provider:"credentials",
            providerId:envConfig.SUPER_ADMIN_EMAIL
        }

        const payload:IUser = {
            name:"Super Admin",
            role: Role.SUPER_ADMIN,
            email:envConfig.SUPER_ADMIN_EMAIL,
            password:hashedPassword,
            auths:[authProvider],
            isVerified: true,
        }

        const superAdmin = await User.create(payload)
        console.log(superAdmin,"super admin created")
        
    } catch (error) {
        console.log(error)
       
    }
}