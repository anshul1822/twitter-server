// import { prismaClient } from "../client/db";
import jwt from 'jsonwebtoken';
import { User } from "@prisma/client";
import { jwtUser } from "../interfaces";

const JWT_SECRET = '@wi@@er';

class JWTService{

    public static async generateTokenForUser(user : User){
        const payload : jwtUser = {
            id : user?.id,
            email : user?.email
        }
        const token = jwt.sign(payload, JWT_SECRET);
        return token;
    }

    public static decodeToken(token : string){
        // console.log('decodeToken', token);

        const jwtToken = token.split(' ')[1];
        console.log('jwtToekn', jwtToken);

        try {
            const payload = jwt.verify(jwtToken ,JWT_SECRET);
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
