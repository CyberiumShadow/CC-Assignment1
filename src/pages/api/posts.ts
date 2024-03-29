import multer from 'multer';
import { db, bucket } from '@lib/firebase';
import initMiddleware from '@lib/init-middleware';

import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';

const upload = multer();
const multerSingle = initMiddleware(upload.single('message_image'));

type NextApiRequestWithFormData = NextApiRequest & {
	file: any;
};

interface RequestBody {
	authorId: string;
	subject: string;
	message: string;
}

interface PostData extends RequestBody {
	id: string;
	timestamp: Date | number;
	image: string;
}

// Next.JS Route-Specific Config
export const config = {
	api: {
		bodyParser: false
	}
};

export default async (_: NextApiRequestWithFormData, res: NextApiResponse) => {
	switch (_.method) {
		case 'GET': {
			break;
		}
		case 'POST': {
			await multerSingle(_, res);
			const postsCollection = db.collection('posts');
			const requestBody: RequestBody = _.body;
			const messageImage = _.file;
			const newPostID = nanoid(10);
			const blob = bucket.file(`uploads/${newPostID}.${messageImage.mimetype.split('/')[1]}`);
			blob.setMetadata({
				cacheControl: 'no-store'
			});

			const postData: PostData = {
				id: newPostID,
				authorId: requestBody.authorId,
				subject: requestBody.subject,
				message: requestBody.message,
				image: blob.name,
				timestamp: new Date()
			};

			const blobStream = blob.createWriteStream();

			blobStream.on('finish', async () => {
				await postsCollection.doc(postData.id).set(postData);
			});

			blobStream.end(messageImage.buffer);
			return res.status(200).send({ message: 'Post Created' });
		}
		default:
			res.setHeader('Allow', ['POST', 'GET']);
			res.status(405).end(`Method ${_.method} Not Allowed`);
	}
};
