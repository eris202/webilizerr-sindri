import { Express } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import User from "../model/User"
import bcrypt from 'bcrypt'

export default class PassportLoader {

  public static async init(app: Express) {
    // Replacing passportConfigurer(passport) with separate function
    this.initLocalStrategy(app)

    // Init serializers
    this.initUserSerializers(app)

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Utility to pass user session to handle bar view
    app.use((req, res, next) => {
      if (req.isAuthenticated()) {
        res.locals.loggedIn = true
      } else {
        res.locals.loggedIn = false
      }

      next()
    })
  }

  static initLocalStrategy(app: Express) {

    const strategyOptions = {
      usernameField: "login",
      passwordField: "password"
    }

    const verificationCallback = async (email, password, done) => {

      const user = await User.findOne({ email: email, isActive: true })

      if (!user) {
        done(null, false, {
          message: "That email is not registered",
        })

        return
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (isMatch) {
        done(null, user)
      } else {
        done(null, false, {
          message: "Password incorrect"
        })
      }
    }

    passport.use(
      new Strategy(
        strategyOptions,
        verificationCallback
      )
    )
  }

  static initUserSerializers(app: Express) {

    passport.serializeUser((user: any, done) => {
      done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user)
      });
    })
  }
}