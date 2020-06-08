import * as admin from 'firebase-admin'
import serviceAccount from './webilizer-service-account'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webilizerr.firebaseio.com"
})

export default admin