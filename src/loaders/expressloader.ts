import { Express, urlencoded, static as staticMiddleware } from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'
import handlebars from 'handlebars'
import expressHb from 'express-handlebars'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import flash from 'connect-flash'

export default class ExpressViewLoader {

    public static async init(app: Express) {
        this.initRequestConfigs(app)
        this.initHandleBars(app)
    }

    static async initRequestConfigs(app: Express) {
        // Init request attribute configs
        app.use(urlencoded({ extended: false }))
        app.use(bodyParser.json())

        // Init static file paths
        app.use(staticMiddleware(path.join(__dirname, "../../src/js")))
        app.use(staticMiddleware(path.join(__dirname, "../../src/public")))

        // Enable flash messages
        app.use(flash())
    }

    static async initHandleBars(app: Express) {
        const hbs = expressHb.create({
            layoutsDir: path.join(__dirname, "../../src/views/"),
            partialsDir: path.join(__dirname, "../../src/views/partials"),
            defaultLayout: false,
            extname: "hbs",
            handlebars: allowInsecurePrototypeAccess(handlebars),
        })

        app.engine("hbs", hbs.engine)
        app.set("view engine", "hbs")
        app.set("views", path.join(__dirname, "../../src/views"))
    }
}