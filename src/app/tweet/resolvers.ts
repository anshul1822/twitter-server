import { Tweet } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UserService from "../../services/user";
import TweetService, { CreateTweetPayload } from "../../services/tweet";



const s3Client = new S3Client({
    region : process.env.AWS_REGION,
    credentials : {
        accessKeyId : process.env.S3_ACCESS as string,
        secretAccessKey : process.env.AWS_SECRET_KEY as string
    }
});

const queries = {
    getAllTweets : async() => TweetService.getAllTweets(),
    getSignedURLForTweet: async(parent : any, {imageType, imageName} : { imageType : string, imageName : string}, ctx : GraphqlContext) => {
        console.log(imageName, imageType);
        if(!ctx.user) throw new Error('Unauthorised Access');

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if(!allowedTypes.includes(imageType)) throw new Error('Unsupported image type');

        const putObjectCommand = new PutObjectCommand({
            Bucket : 'twitter-dev-clone',
            ContentType : imageType,
            Key : `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now().toString()}.${imageType}`
        });

        const signedURL = await getSignedUrl(s3Client, putObjectCommand);
        return signedURL;
    }
 }

const mutations = {
    createTweet : async (parent : any, {payload} : { payload : CreateTweetPayload }, ctx : GraphqlContext) => {
        if(!ctx.user) throw new Error("You are not authenticated");
        const tweet = TweetService.createTweet({...payload, userId : ctx.user.id})
        return tweet;
    }
}

const extraResolvers = {
    Tweet : {
        author : async (parent : Tweet) => UserService.getUserById(parent.authorId)
    }
};

export const resolvers = {mutations, extraResolvers, queries};