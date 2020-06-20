import { Service, Inject } from 'typedi'
import User from "../model/User"
import bcrypt from "bcrypt";
import { TokenService } from './encryption-token-service';
import { MailService } from './mail-service';
import { StripeService } from './stripe-service';

@Service()
export class AuthService {

    @Inject() private tokenService: TokenService

    @Inject() private mailService: MailService

    @Inject() private stripeService: StripeService

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
        const data = await this.tokenService.getTokenPayload(token)
        const userEmail = data.email
        const user = await User.findOne({ email: userEmail })
        user.isActive = true
        // TODO: Don't work like this
        user.numOfScans = 6

        const session = await User.startSession();
        session.startTransaction();
        try {
            const stripeCustomer = await this.stripeService.createCustomer(user.name, userEmail)
            user.stripeCustomerId = stripeCustomer.id

            await user.save()

            // Deleting inactive users with same email
            const res = await User.deleteMany({ email: userEmail, isActive: false })
            console.log(res.deletedCount)

            await session.commitTransaction()
        } catch (e) {
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

    resetPassword = async (email) => {
        const user = await User.findOne({ email: email, isActive: true })
        if (!user) {
            throw Error('Security issue. Trying to reset a non user')
        }

        await this.mailService.sendResetLink(email)
    }

    updatePassword = async (token, password, repeatedPassword) => {
        if (!token) {
            return {
                error: 'Token is empty',
                data: ''
            }
        }

        if (!password || !repeatedPassword) {
            return {
                error: 'Both fields are required',
                data: ''
            }
        }

        if (password != repeatedPassword) {
            return {
                error: 'Passwords do not match',
                data: ''
            }
        }

        try {
            const payload = await this.tokenService.getTokenPayload(token)
            console.log(`payload is ${payload.email}`)
            const user = await User.findOne({email: payload.email, isActive: true})
            
            if (!user) {
                throw new Error('Trying for an invalid user')
            }

            const passwordSalt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, passwordSalt)
            user.password = hashedPassword
            
            await user.save()

            return {
                error: false,
                data: 'Password has been updated'
            }
        } catch (e) {
            console.log(e)
            return {
                error: 'Token is invalid or expired',
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