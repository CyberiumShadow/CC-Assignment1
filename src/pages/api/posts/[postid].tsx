import multer from 'multer';
import { db, bucket } from '@lib/firebase';
import initMiddleware from '@lib/init-middleware';

import type { NextApiRequest, NextApiResponse } from 'next';

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

interface ImagelessPostData extends RequestBody {
	id: string;
	timestamp: Date | number;
}

interface PostData extends ImagelessPostData {
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
		case 'PATCH': {
			await multerSingle(_, res);
			const postsCollection = db.collection('posts');
			const requestBody: RequestBody = _.body;
			const messageImage = _.file;
			const { postid: postID } = _.query as { postid: string };
			const currentPost = (await postsCollection.doc(postID).get()).data() as FirebaseFirestore.DocumentData;
			if (!messageImage) {
				const postData: ImagelessPostData = {
					id: postID,
					authorId: currentPost.authorId,
					subject: requestBody.subject,
					message: requestBody.message,
					timestamp: new Date()
				};
				await postsCollection.doc(postData.id).update(postData);
				return res.status(200).send({ message: 'Post Edited' });
			}
			const blob = bucket.file(currentPost.image);
			blob.setMetadata({
				cacheControl: 'no-store'
			});

			const postData: PostData = {
				id: postID,
				authorId: currentPost.authorId,
				subject: requestBody.subject,
				message: requestBody.message,
				image: blob.name,
				timestamp: new Date()
			};

			const blobStream = blob.createWriteStream();

			blobStream.on('finish', async () => {
				await postsCollection.doc(postData.id).update(postData);
			});

			blobStream.end(messageImage.buffer);
			return res.status(200).send({ message: 'Post Edited' });
		}
		default:
			res.setHeader('Allow', ['PATCH']);
			res.status(405).end(`Method ${_.method} Not Allowed`);
	}
};
