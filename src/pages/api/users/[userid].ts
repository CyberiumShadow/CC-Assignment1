import { db } from '@lib/firebase';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async (_: NextApiRequest, res: NextApiResponse) => {
	switch (_.method) {
		case 'PATCH': {
			const data = _.body;
			const userid = _.query.userid as string;
			const usersCollection = db.collection('users');
			const user = await usersCollection.doc(userid).get();

			if (user.exists) {
				const userData = user.data()!;
				if (data.oldPassword !== userData!.password) return res.status(401).send({ message: 'Current Password is incorrect' });
				return res.status(200).send({ id: userData.id });
			}

			return res.status(401).send({ message: 'ID or Password is incorrect' });
		}
		default:
			res.setHeader('Allow', ['PATCH']);
			res.status(405).end(`Method ${_.method} Not Allowed`);
	}
};
