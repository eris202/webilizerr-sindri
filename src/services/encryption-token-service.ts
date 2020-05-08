import { Service } from "typedi";
import {sign, verify} from 'jsonwebtoken'

const SECRET = 's3cr3t'

@Service()
export class TokenService {

    createEmailConfirmationToken = (email: string) => {
        return sign({ email: email }, SECRET, {
            expiresIn: 1800 // expires in 24 hours
        })
    }

    getRegistrationTokenPayload = async (token): Promise<{email:string}> => {
        const decodedToken: any = await verify(token, SECRET)
        
        return {
            email: decodedToken.email
        }
    }
}