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
    followUser : (parent : any, {to} : {to : string}, ctx : GraphqlContext) =>{
        if(!ctx.user || !ctx.user.id) throw Error ('Unauthorised')
        return UserService.followUser(ctx.user.id, to);
    },
    unfollowUser : (parent : any, {to} : {to : string}, ctx : GraphqlContext) =>{
        if(!ctx.user || !ctx.user.id) throw Error ('Unauthorised')
        return UserService.unfollowUser(ctx.user.id, to);
    }
}

const extraResolvers = {
    User : {
        tweets : async (parent : User) => await prismaClient.tweet.findMany({where : {authorId : parent.id}, orderBy : {createdAt : 'desc'}}) ,
        followers : async (parent : User) => {
            const result =  await prismaClient.follows.findMany({
                where : {
                    following : {id : parent.id}
                },
                include : {
                    follower : true
                }
            })

            // console.log('Followers', result);
            const res = result.map(r => r.follower); 
            return res;
        },
        
        followings : async (parent : User) => {
            const result =  await prismaClient.follows.findMany({
                where : {
                    follower : {id : parent.id}
                },
                include : {
                    following : true
                }
            })

            // console.log('Followings', result);
            const res = result.map(r => r.following); 
            // console.log(res);
            return res;
        },

        recommendedUsers : async(parent : User, _ : any, ctx : GraphqlContext) => {
            if(!ctx.user) return [];

            const myFollowings = await prismaClient.follows.findMany({
                where : {
                    followerId : ctx.user.id
                },
                include : {
                    following : { include : {followers : {include : {following : true} } } } 
                    // I want to get followers of my followings
                }
            });

            const users : User[] = [];

            for(const followings of myFollowings){
                //I want to get followers of my followings
                for(const followingOfFollowedUser of followings.following.followers){

                    if(followingOfFollowedUser.following.id !== ctx.user.id && //should not be logged in user
                        myFollowings.findIndex((e) => e?.followingId === followingOfFollowedUser.following.id) < 0){ //

                            users.push(followingOfFollowedUser.following);

                        }                        
                }
            }

            return users;
        }
    }
}

export const resolvers = {queries, mutations, extraResolvers};