const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// const typeDefs = gql`
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     title: String
//     author: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//   }
// `;
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    post(url: String!, description: String!): Link!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`
// const books = [
//     {
//       title: 'The Awakening',
//       author: 'Kate Chopin',
//     },
//     {
//       title: 'City of Glass',
//       author: 'Paul Auster',
//     },
//   ];

// 1
// let links = [{
//     id: 'link-0',
//     url: 'www.howtographql.com',
//     description: 'Fullstack tutorial for GraphQL'
//   }]
  
// const resolvers = {
//     Query: {
//       info: () => `This is the API of a Hackernews Clone`,
//       feed: async (parent, args, context) => {
//         return context.prisma.link.findMany()
//       },
//     },
//     Mutation: {
//       post: (parent, args, context, info) => {
//         const newLink = context.prisma.link.create({
//           data: {
//             url: args.url,
//             description: args.description,
//           },
//         })
//         return newLink
//       },
//     },
//   }



const resolvers = {
    Query,
    Mutation,
    User,
    Link
  }
  

//   // Resolvers define the technique for fetching the types defined in the
// // schema. This resolver retrieves books from the "books" array above.
// const resolvers = {
//     Query: {
//       books: () => books,
//     },
//   };

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const { getUserId } = require('./utils');

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });