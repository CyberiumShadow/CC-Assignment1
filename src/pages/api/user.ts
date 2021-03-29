import multer from 'multer';
import db from '@lib/db';
import bucket from '@lib/storage';
import initMiddleware from '@lib/init-middleware';

import type { NextApiRequest, NextApiResponse } from 'next';

const upload = multer();
const multerNone = initMiddleware(upload.none());
const multerSingle = initMiddleware(upload.single('avatar'));

const usersCollection = db.collection('users');

type NextApiRequestWithFormData = NextApiRequest & {
	file: any;
};

interface UserData {
	id: string;
	user_name: string;
	password: string;
}

// Next.JS Route-Specific Config
export const config = {
	api: {
		bodyParser: false
	}
};

export default async (_: NextApiRequestWithFormData, res: NextApiResponse) => {
	switch (_.method) {
		case 'POST': {
			await multerSingle(_, res);
			const userData = _.body;
			const avatarImage = _.file;
			const userIdQuery = await usersCollection.where('id', '==', userData.id).get();

			if (userIdQuery.empty) {
				const usernameQuery = await usersCollection.where('user_name', '==', userData.username).get();
				if (usernameQuery.empty) {
					const blob = bucket.file(`profile_images/${userData.id}.${avatarImage.mimetype.slice(-3)}`);
					const blobStream = blob.createWriteStream();

					blobStream.on('finish', async () => {
						await usersCollection.doc(userData.id).set({
							id: userData.id,
							user_name: userData.username,
							password: userData.password
						});
					});

					blobStream.end(avatarImage.buffer);
					return res.status(200).send({ message: 'Account Created' });
				}
				return res.status(409).send({ message: 'Username already exists.' });
			}
			return res.status(409).send({ message: 'ID already exists.' });
		}

		case 'PATCH': {
			await multerNone(_, res);
			const { id, current_password: currentPassword, new_password: newPassword } = _.body;
			const userQuery = await usersCollection.where('id', '==', id).get();

			if (!userQuery.empty) {
				const userData: UserData = userQuery.docs[0].data() as UserData;
				if (currentPassword === userData.password) {
					await userQuery.docs[0].ref.update({ password: newPassword });
					return res.status(200).send({ message: 'Password updated' });
				}
				return res.status(401).send({ message: 'The old password is incorrect' });
			}
			return res.status(404).send({ message: 'User not found' });
		}

		default:
			res.setHeader('Allow', ['POST', 'PATCH']);
			res.status(405).end(`Method ${_.method} Not Allowed`);
	}
};
