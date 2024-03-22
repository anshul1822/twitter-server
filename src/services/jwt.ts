// import { prismaClient } from "../client/db";
import jwt from 'jsonwebtoken';
import { User } from "@prisma/client";
import { jwtUser } from "../interfaces";

// console.log(process.env.JWT_SECRET);

class JWTService{

    public static async generateTokenForUser(user : User){
        const payload : jwtUser = {
            id : user?.id,
            email : user?.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET as string);
        return token;
    }

    public static decodeToken(token : string){
        // console.log('decodeToken', token);

        const jwtToken = token.split(' ')[1];
        console.log('jwtToekn', jwtToken);

        try {
            const payload = jwt.verify(jwtToken ,process.env.JWT_SECRET as string);
            // console.log(payload);
            return payload as jwtUser;
        } catch (error) {
            console.error('JWT verification failed:', error);
            // throw error;
        }   

        return null;
    }
}

export default JWTService;
