import axios from 'axios';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../../client/db';
import JWTService from '../../services/jwt';
import { GraphqlContext } from '../../interfaces';

interface GoogleTokenPayload {
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified?: string;
    nbf?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    locale?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

const queries = {

    verifyGoogleToken : async (parent: any, {token} : {token : string}) => {    
        // return token;

        const googleToken = token;
        const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOAuthURL.searchParams.set('id_token', googleToken);

        const {data} = await axios.get<GoogleTokenPayload>(googleOAuthURL.toString(), {
            responseType : 'json'
        })

        //console.log(data);

        const user = await prismaClient.user.findUnique({where : {email : data.email}});

        if(!user) { //user is not found -> so we need to create a new user
            await prismaClient.user.create({
                data :{
                    email : data.email,
                    firstName : data.given_name,
                    lastName : data.family_name,
                    profileImage : data.picture
                }
            });
        }

        const userInDb = await prismaClient.user.findUnique({where : {email : data.email}});
            
        if(!userInDb) throw new Error('User in Db not found');

        const userToken = await JWTService.generateTokenForUser(userInDb);

        return userToken;
    },

    getCurrentUser : async(parent: any, args:any, ctx : GraphqlContext) => {
        console.log(ctx);
        const id = ctx.user?.id;

        const userInDb = await prismaClient.user.findUnique({where : {id : id}});

        console.log('userInDb', userInDb);
       
        if(!userInDb) return null;
        // if(!) return null;

        return userInDb;
    }
}

const mutations = {

}

export const resolvers = {queries, mutations};