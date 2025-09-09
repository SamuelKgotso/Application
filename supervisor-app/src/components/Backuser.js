const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.listUsers = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Authentication required'
    );
  }

  // Optional: Verify user role/permissions
  // const userDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  // if (!userDoc.exists || userDoc.data().role !== 'admin') {
  //   throw new functions.https.HttpsError(
  //     'permission-denied', 
  //     'Insufficient permissions'
  //   );
  // }

  try {
    const userRecords = await admin.auth().listUsers();
    return userRecords.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      },
      // Add other properties you need
    }));
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});