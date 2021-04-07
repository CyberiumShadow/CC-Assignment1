import { db, bucket } from '@lib/firebase';

interface PostData {
	subject: string;
	message: string;
	timestamp: string;
	id: string;
	authorId: string;
	authorName: string;
	image: string;
	authorImage: string;
}

interface UserPostData {
	subject: string;
	message: string;
	timestamp: string;
	id: string;
	image: string;
}

export async function getNumPostData(amount: number) {
	const postCollection = db.collection('posts');
	const postArray = (await postCollection.orderBy('timestamp', 'desc').limit(amount).get()).docs;
	const postDataArray: PostData[] = await Promise.all(
		postArray.map(async (post) => {
			const data = post.data();
			const authorData = (await db.collection('users').where('id', '==', data.authorId).get()).docs[0].data();
			return {
				id: data.id as string,
				authorId: data.authorId as string,
				authorName: authorData.user_name,
				subject: data.subject as string,
				message: data.message as string,
				timestamp: data.timestamp.toDate().toJSON() as string,
				image: bucket.file(data.image).publicUrl() as string,
				authorImage: authorData.avatar as string
			};
		})
	);
	return postDataArray;
}

export async function getUserPostData(userid: string) {
	const postCollection = db.collection('posts');
	const postArray = (await postCollection.orderBy('timestamp', 'desc').where('authorId', '==', userid).get()).docs;
	const postDataArray: UserPostData[] = await Promise.all(
		postArray.map((post) => {
			const data = post.data();
			return {
				id: data.id as string,
				subject: data.subject as string,
				message: data.message as string,
				timestamp: data.timestamp.toDate().toJSON() as string,
				image: bucket.file(data.image).publicUrl() as string
			};
		})
	);
	return postDataArray;
}

export async function getPostDatabyID(postid: string) {
	const postCollection = db.collection('posts');
	const postArray = (await postCollection.where('id', '==', postid).get()).docs;
	const data = postArray[0].data();
	const postData = {
		id: data.id as string,
		subject: data.subject as string,
		message: data.message as string,
		timestamp: data.timestamp.toDate().toJSON() as string,
		image: bucket.file(data.image).publicUrl() as string
	};
	return postData;
}
