"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = void 0;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const user_1 = require("./user");
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_1 = __importDefault(require("../services/jwt"));
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        dotenv_1.default.config();
        const graphqlServer = new server_1.ApolloServer({
            typeDefs: `

            ${user_1.User.types}
        
            type Query{
                ${user_1.User.queries}
            }
        `,
            resolvers: {
                Query: Object.assign({}, user_1.User.resolvers.queries)
            },
        });
        yield graphqlServer.start();
        app.use("/graphql", (0, express4_1.expressMiddleware)(graphqlServer, {
            context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
                // console.log(req.headers);
                return {
                    user: req.headers.authorization ? jwt_1.default.decodeToken(req.headers.authorization) : 'undefined'
                };
            })
        }));
        // );
        return app;
    });
}
exports.initServer = initServer;