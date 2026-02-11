import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (_, __, profile, done) => {
  let user = await User.findOne({ email: profile.emails[0].value })
  if (!user) user = await User.create({ name: profile.displayName, email: profile.emails[0].value, password: '' })
  return done(null, user)
}))

passport.serializeUser((u, d) => d(null, u._id))
passport.deserializeUser(async (id, d) => d(null, await User.findById(id)))