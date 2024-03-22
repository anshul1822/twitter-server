// import { CreateTweetPayload } from "../app/tweet/resolvers";
import { prismaClient } from "../client/db";

export interface CreateTweetPayload {
    content : string
    imageURL ?: string
    userId : string
}


class TweetService {

    public static async createTweet(payload : CreateTweetPayload) {
        const tweet =  await prismaClient.tweet.create({
            data : {
                content : payload.content,
                imageURL : payload.imageURL,
                author : {connect : {id : payload.userId}}
            }
        });

        return tweet;
    }

    public static async getAllTweets(){
        return await prismaClient.tweet.findMany({orderBy : {createdAt : 'desc'}});
    }

}

export default TweetService;