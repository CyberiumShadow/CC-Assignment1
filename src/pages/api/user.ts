import multer from 'multer';
import db from '@lib/db';
import bucket from '@lib/storage';
import initMiddleware from '@lib/init-middleware';

import type { NextApiRequest, NextApiResponse } from 'next';

const upload = multer();
const multerSingle = initMiddleware(upload.single('avatar'));

type NextApiRequestWithFormData = NextApiRequest & {
	file: any;
};

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
			const usersCollection = db.collection('users');
			const userQuery = await usersCollection.where('id', '==', userData.id).get();

			if (userQuery.empty) {
				const blob = bucket.file(`profile_images/${userData.id}.${avatarImage.mimetype.slice(-3)}`);
				const blobStream = blob.createWriteStream();

				blobStream.on('finish', async () => {
					// The public URL can be used to directly access the file via HTTP.
					await usersCollection.doc(userData.id).set({
						id: userData.id,
						user_name: userData.username,
						password: userData.password
					});
				});

				blobStream.end(avatarImage.buffer);
				return res.status(200).send({ message: 'Account Created' });
			}

			return res.status(409).send({ message: 'Account already exists' });
		}
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${_.method} Not Allowed`);
	}
};
