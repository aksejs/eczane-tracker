import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions
  .region('europe-west1')
  .pubsub.schedule('0 1 * * *')
  .timeZone('Europe/Istanbul')
  .onRun(async () => {
    const CUT_OFF_TIME = 24 * 60 * 60 * 1000
    const date = Date.now() - CUT_OFF_TIME
    const timestamp = admin.firestore.Timestamp.fromMillis(date)
    const query = admin
      .firestore()
      .collection('pharmacies')
      .where('timestamp', '<=', timestamp)

    const pharmacies = await query.get()
    pharmacies.forEach((snapshot) => {
      snapshot.ref.delete()
    })
    console.log('pharmacies deleted')
  })
