// import { CreateTweetPayload } from "../app/tweet/resolvers";
import { prismaClient } from "../client/db";
import { redisClient } from "../client/redis";

export interface CreateTweetPayload {
    content : string
    imageURL ?: string
    userId : string
}


class TweetService {

    public static async createTweet(payload : CreateTweetPayload) {

        const rateLimitFlag = await redisClient.get(`RATE_LIMIT:TWEET:${payload.userId}`);
        if(rateLimitFlag) throw new Error('Please wait......');

        const tweet =  await prismaClient.tweet.create({
            data : {
                content : payload.content,
                imageURL : payload.imageURL,
                author : {connect : {id : payload.userId}}
            }
        });
        await redisClient.setex(`RATE_LIMIT:TWEET:${payload.userId}`, 10, 1);
        await redisClient.del(`ALL_TWEETS`);
        return tweet;
    }

    public static async getAllTweets(){
        const cached_AllTweets = await redisClient.get(`ALL_TWEETS`);
        if(cached_AllTweets) return JSON.parse(cached_AllTweets);

        const allTweets =  await prismaClient.tweet.findMany({orderBy : {createdAt : 'desc'}});

        await redisClient.set('ALL_TWEETS' , JSON.stringify(allTweets));
        return allTweets;
    }

}

export default TweetService;