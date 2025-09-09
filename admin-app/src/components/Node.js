const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setUserClaims = functions.https.onCall(async (data, context) => {
  // Verify admin user
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }

  try {
    await admin.auth().setCustomUserClaims(data.uid, {
      role: data.role,
      department: data.department
    });
    
    // Force token refresh
    await admin.auth().revokeRefreshTokens(data.uid);
    
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Claims update failed');
  }
});