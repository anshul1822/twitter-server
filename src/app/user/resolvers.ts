import axios from 'axios';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../../client/db';
import JWTService from '../../services/jwt';
import { GraphqlContext } from '../../interfaces';
import { User } from '@prisma/client';
import UserService from '../../services/user';


const queries = {

    verifyGoogleToken : async (parent: any, {token} : {token : string}) => {    
        // return token;
        const authtoken = await UserService.verifyGoogleToken(token);
        return authtoken;
    },

    getCurrentUser : async(parent: any, args:any, ctx : GraphqlContext) => {
        // console.log(ctx);
        const id = ctx.user?.id;
        const userInDb = await UserService.getCurrentUser(id as string);
        return userInDb;
    },

    getUserById : async(parent : any, {id} : {id : string}, ctx : GraphqlContext) => {

        const userInDb = await UserService.getUserById(id as string);
        return userInDb;
    }
}

const mutations = {

}

const extraResolvers = {
    User : {
        tweets : async (parent : User) => await prismaClient.tweet.findMany({where : {authorId : parent.id}, orderBy : {createdAt : 'desc'}}) 
    }
}

export const resolvers = {queries, mutations, extraResolvers};