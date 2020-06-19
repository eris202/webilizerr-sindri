import { Express } from 'express'
import DbLoader from './dbloader'
import PassportLoader from './passportloader'
import RouteLoader from './routeloader'
import ExpressLoader from './expressloader'

export default class AppLoader {
    static async init(app : Express) {
        await DbLoader.init(app)
        await PassportLoader.init(app)
        await ExpressLoader.init(app)
        await RouteLoader.init(app)

        console.log(`All configs are loaded`);
    }
}