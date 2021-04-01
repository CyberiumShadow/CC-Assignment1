import admin from 'firebase-admin';

if (admin.apps.length === 0) {
	admin.initializeApp({
		credential: admin.credential.applicationDefault()
	});
}

export const bucket = admin.storage().bucket('cyberiumdev-rmit-cc.appspot.com');

export const db = admin.firestore();
