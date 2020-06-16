import { Express, urlencoded, static as staticMiddleware } from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'
import handlebars from 'handlebars'
import multer from 'multer'
import User from "../model/User"
import expressHb from 'express-handlebars'
import {capitalCase} from 'change-case'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import flash from 'connect-flash'
import * as paginateHelper from 'handlebars-paginate'

export default class ExpressViewLoader {

    public static async init(app: Express) {
        this.initRequestConfigs(app)
        this.initHandleBars(app)
    }

    static async initRequestConfigs(app: Express) {
        // Init request attribute configs
        const callbackBasePath = process.env.BASE_HOOK
        if (!callbackBasePath) {
          throw new Error('Base hook not defined')
        } 

        console.log(callbackBasePath)

        app.use(urlencoded({ extended: false }))
        app.use(bodyParser.json())

        app.use(multer().array()); 

        // Init static file paths
        app.use(staticMiddleware(path.join(__dirname, "../../src/js")))
        app.use(staticMiddleware(path.join(__dirname, "../../src/public")))

        // Enable flash messages
        app.use(flash())

        app.use('*', (req, res, next) => {
            res.locals.absoluteUrl = `${req.protocol}://${req.get('Host')}`
            return next()
        })

        app.use('*', async (req, res, next) => {
            if (!req.isAuthenticated()) {
                console.log('not auth')
                return next()
            }

            const dbUser = await User.findOne({
                email: req.user['email'],
                isActive: true
            })

            res.locals.numOfScans = dbUser.numOfScans

            return next()
        })
    }

    static async initHandleBars(app: Express) {
        const hbs = expressHb.create({
            layoutsDir: path.join(__dirname, "../../src/views/"),
            partialsDir: path.join(__dirname, "../../src/views/partials"),
            defaultLayout: "",
            extname: "hbs",
            handlebars: allowInsecurePrototypeAccess(handlebars),
            helpers: {
                ifeq: function(a, b, options) {
                    if(a === b) {
                        return options.fn(this)
                    }

                    return options.inverse(this)
                },
                ifObject: function(a, options) {
                    if (!Array.isArray(a) && typeof a === 'object') {
                        
                        return options.fn(this)
                    }

                    return options.inverse(this)
                },
                ifArray: function(a, options) {
                    if (Array.isArray(a)) {
                        return options.fn(this)
                    }
                    return options.inverse(this)
                },
                numeric: function(a, options) {
                    return a? new handlebars.SafeString(a) : 0
                },
                ifString: function(a, options) {
                    if (typeof a === "string") {
                        return options.fn(this)
                    }

                    return options.inverse(this)
                },
                friendlyText: function(val, options) {
                    if (val) {
                        return capitalCase(val)
                    }

                    return ""
                },
                paginateHelper: paginateHelper,
                times: function(n, block) {
                    var accum = '';
                    for(var i = 0; i < n; ++i) {
                        block.data.index = i;
                        block.data.loopCount = i + 1;
                        block.data.first = i === 0;
                        block.data.last = i === (n - 1);
                        accum += block.fn(this);
                    }
                    return accum;
                },
            }
        })

        app.engine("hbs", hbs.engine)
        app.set("view engine", "hbs")
        app.set("views", path.join(__dirname, "../../src/views"))
    }
}