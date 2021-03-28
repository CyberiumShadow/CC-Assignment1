import db from '@lib/db';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async (_: NextApiRequest, res: NextApiResponse) => {
	switch (_.method) {
		case 'POST': {
			const data = _.body;
			const usersCollection = db.collection('users');
			const user = await usersCollection.doc(data.id).get();

			if (user.exists) {
				const userData = user.data()!;
				if (data.password !== userData!.password) return res.status(401).send({ message: 'Username/Password is incorrect' });
				return res.status(200).send({ message: 'Logged in' });
			}

			return res.status(401).send({ message: 'Username/Password is incorrect' });
		}
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${_.method} Not Allowed`);
	}
};
