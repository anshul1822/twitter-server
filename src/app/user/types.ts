export const types = `#graphql

    type User{
        id : ID!
        firstName : String!
        lastName : String
        email : String!
        profileImage : String

        followers : [User]
        followings : [User]

        recommendedUsers : [User]

        tweets: [Tweet]
    }

    type Follows{
        id : ID!

        follower : User
        followerId : String
      
        following : User 
        followingId : String!  
    }

`