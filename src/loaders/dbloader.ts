import { Express } from 'express'
import { mongoURI } from '../config/keys'
import MongoDbSessionConnector from 'connect-mongodb-session'
import expressSession from 'express-session'
import mongoose from 'mongoose'

// DB configs
export default class DbLoader {

    static async init(app: Express) {
        this.initializeMongoStore(app)
        await this.initializeMongooseConnection(app)
    }

    static initializeMongoStore(app: Express) {
        const MongoDBStore = MongoDbSessionConnector(expressSession)

        const store = new MongoDBStore({
            uri: mongoURI,
            mongooseConnection: mongoose.connection,
            collection: "mySessions",
        })

        app.use(
            expressSession({
                secret: "secret",
                resave: true,
                saveUninitialized: true,
                store: store,
            })
        )

        // Register error handler for mongo store
        store.on("error", (error) => {
            console.log("error in STORE")
            console.log(error)
        })
    }

    // Connect to MongoDB
    static async initializeMongooseConnection(app: Express) {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        
        console.log("MongoDB Connected....")
    }
}