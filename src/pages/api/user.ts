import db from '@lib/db';

import type { NextApiRequest, NextApiResponse } from 'next';

function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}

export default async (_: NextApiRequest, res: NextApiResponse) => {
	switch (_.method) {
		case 'POST': {
			const data = _.body;
			const usersCollection = db.collection('users');
			const userQuery = await usersCollection.where('id', '==', data.id).get();

			if (userQuery.empty) {
				await usersCollection.doc(data.id).set({
					id: data.id,
					user_name: data.username,
					password: data.password
				});
				return res.status(200).send({ message: 'Account Created' });
			}

			return res.status(409).send({ message: 'Account already exists' });
		}
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${_.method} Not Allowed`);
	}
};
