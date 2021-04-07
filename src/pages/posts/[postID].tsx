import React from 'react';
import Head from 'next/head';
import { applyServerSidePropsCookie } from 'next-universal-cookie';
import Layout from '@components/loginLayout';
import parseCookies from '@lib/parseCookie';
import { getPostDatabyID } from '@lib/posts';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import useForm from '@lib/hooks/useForm';
import validate from '@lib/validationRules/PostEditValidationRules';

interface Props {
	session: string;
	postData: {
		id: string;
		authorId: string;
		subject: string;
		message: string;
		timestamp: string;
		image: string;
	};
}

interface UseFormHook {
	values: {
		[key: string]: any;
	};
	errors: {
		fileBlob?: string;
		filePreview?: string;
		subject?: string;
		message?: string;
	};
	handleChange: (event: any) => void;
	handleSubmit: (event: any) => void;
	handleFile: (event: any) => void;
}

const Post = ({ session, postData }: Props) => {
	const router = useRouter();
	const { values, errors, handleChange, handleSubmit, handleFile }: UseFormHook = useForm(postForm, validate);
	const sessionObject = JSON.parse(session);
	const { postID } = router.query;

	async function postForm() {
		const formData = new FormData();
		formData.append('message_image', values.fileBlob);
		formData.append('authorId', sessionObject.id);
		formData.append('subject', values.subject || postData.subject);
		formData.append('message', values.message || postData.subject);

		await fetch(`/api/posts/${postID}`, {
			body: formData,
			method: 'PATCH'
		});
		setTimeout(() => {
			return router.push('/forum');
		}, 2000);
	}

	return (
		<>
			<Head>
				<title>Edit Post</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<div className="inner-container">
					<div className="header">Edit Post</div>
					<div className="box">
						<div className="input-group">
							<label htmlFor="subject">Subject</label>
							<input
								type="text"
								name="subject"
								className="login-input"
								placeholder="New Subject"
								onChange={handleChange}
								value={values.subject || postData.subject}
								required
							/>
							<small className="danger-error">{errors.subject ? errors.subject : ''}</small>
						</div>

						<div className="input-group">
							<label htmlFor="message">Message</label>
							<textarea
								rows={10}
								name="message"
								className="message-input"
								placeholder="Message Text"
								onChange={handleChange}
								value={values.message || postData.message}
								required
							/>
							<small className="danger-error">{errors.message ? errors.message : ''}</small>
						</div>

						<div className="input-group">
							<label htmlFor="messageImage">Image Upload</label>
							<input type="file" name="messageImage" onChange={handleFile} required />
							{values.filePreview ? (
								<img src={values.filePreview} width="120" height="120" />
							) : (
								<img src={postData.image} width="120" height="120" />
							)}
							<small className="danger-error">{errors.filePreview ? errors.filePreview : ''}</small>
						</div>
						<button type="button" className="login-btn" onClick={handleSubmit}>
							Update Post
						</button>
					</div>
				</div>
			</Layout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
	applyServerSidePropsCookie(req, res);
	const cookies = parseCookies(req);
	const { postID } = params as { postID: string };
	if (!cookies.session) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}
	const postData = await getPostDatabyID(postID);
	return {
		props: {
			session: cookies.session,
			postData
		}
	};
};

export default Post;
