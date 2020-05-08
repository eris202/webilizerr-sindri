import { Service, Inject } from 'typedi'
import User from "../model/User";
import bcrypt from "bcrypt";
import { TokenService } from './encryption-token-service';
import { MailService } from './mail-service';
import * as mongoose from 'mongoose'

@Service()
export class AuthService {

    @Inject() private tokenService: TokenService

    @Inject() private mailService: MailService

    registerUser = async (userInfo: UserInfo): Promise<RegistrationResult> => {
        const errors = await this.validateUserInfo(userInfo)

        if (errors.length > 0) {
            return {
                errors,
                data: ''
            }
        }

        return await this.registerNewUser(userInfo)
    }

    private validateUserInfo = async (userInfo: UserInfo): Promise<Array<{ msg: string }>> => {
        const errors = []

        if (!userInfo.name || !userInfo.email || !userInfo.password || !userInfo.password2) {
            errors.push({ msg: "Please fill in all the fields!" })
        }

        if (userInfo.password !== userInfo.password2) {
            errors.push({ msg: "Passwords do not match!" })
        }

        if (userInfo.password.length < 6) {
            errors.push({ msg: "Pass must be at least 6 characters" })
        }

        const re = /\S+@\S+\.\S+/;

        if (re.test(userInfo.email)) {
            const dbUser = User.findOne({
                email: userInfo.email,
                isActive: true
            })

            if (!dbUser) {
                errors.push({ msg: 'Email is already registered' })
            }
        } else {
            errors.push({ msg: 'Please enter a valid email address' })
        }

        return errors
    }

    verifyUserLink = async (token: string) => {
        const data = await this.tokenService.getRegistrationTokenPayload(token)
        const userEmail = data.email
        const user = await User.findOne({ email: userEmail, isActive: false })

        user.isActive = true

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            //Saving updated user
            await user.save()
            // Deleting inactive users with same email
            await User.deleteMany({ email: userEmail, isActive: false })

            await session.commitTransaction()
        } catch(e) {
            await session.abortTransaction()
            throw e
        } finally {
            session.endSession()
        }
        
    }

    private registerNewUser = async (userInfo: UserInfo) => {
        const newUser = new User({
            name: userInfo.name,
            email: userInfo.email,
            password: userInfo.password
        })

        try {
            const passwordSalt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newUser.password, passwordSalt)
            newUser.password = hashedPassword

            const savedUser = await newUser.save()

            await this.mailService.sendAccountConfirmationEmail(savedUser.email)

            return {
                errors: [],
                data: savedUser,
            }
        } catch (e) {
            console.log(e)
            return {
                errors: [
                    {
                        msg: "Sorry, the service failed. Please try again."
                    }
                ],
                data: ''
            }
        }
    }

}

interface UserInfo {
    name: string,
    email: string,
    password: string,
    password2: string
}

export interface RegistrationResult {
    errors: Array<any>,
    data: any
}