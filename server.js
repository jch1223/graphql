import { ApolloServer, gql } from "apollo-server";

const tweets = [
  {
    id: "1",
    text: "Hello World",
    userId: "1",
  },
  {
    id: "2",
    text: "Bye World",
    userId: "1",
  },
  {
    id: "3",
    text: "Hello Again",
    userId: "2",
  },
];

const users = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
  },
];

const typeDefs = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    fullName: String
  }
  """
  A Tweet object
  """
  type Tweet {
    id: ID
    text: String
    author: User!
  }
  type Query {
    allTweets: [Tweet!]!
    allUsers: [User!]!
    tweet(id: ID): Tweet
    ping: String
  }
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const resolvers = {
  Query: {
    allTweets: (parent, args, context, info) => {
      return tweets;
    },
    tweet: (parent, args, context, info) => {
      return tweets.find((tweet) => tweet.id === args.id);
    },
    allUsers: (parent, args, context, info) => {
      return users;
    },
  },
  Mutation: {
    postTweet: (parent, args, context, info) => {
      const tweet = {
        id: String(tweets.length + 1),
        text: args.text,
        authorId: args.userId,
      };
      tweets.push(tweet);
      return tweet;
    },
    deleteTweet: (parent, args, context, info) => {
      tweets = tweets.filter((tweet) => tweet.id !== args.id);
      return true;
    },
  },
  User: {
    fullName: (parent, args, context, info) => {
      return `${parent.firstName} ${parent.lastName}`;
    },
  },
  Tweet: {
    author: (parent, args, context, info) => {
      return users.find((user) => user.id === parent.userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(url);
});
