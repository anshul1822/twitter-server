import axios from "axios";
import { prismaClient } from "../client/db";
import JWTService from "./jwt";

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


class UserService {
    public static async verifyGoogleToken(token : string){

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
     }

     public static async getCurrentUser (id : string){
        const userInDb = await prismaClient.user.findUnique({where : {id : id}});
        // console.log('userInDb', userInDb);
       
        if(!userInDb) return null;
        return userInDb;
     }

     public static async getUserById (id : string){
        const userInDb = await prismaClient.user.findUnique({where : {id : id}});
        if(!userInDb) return null;
        return userInDb;
     }

     public static async followUser(from : string, to : string){
        await prismaClient.follows.create({
            data : {
                follower : {connect : {id : from}},
                following : {connect : {id : to}}
            }
        })
        return true;
     }

     public static async unfollowUser (from :string, to : string){
        await prismaClient.follows.delete({
            where : {
                followerId_followingId : {
                    followerId : from ,
                    followingId : to
              } 
            }          
        })
        return true;
     }
}

export default UserService;