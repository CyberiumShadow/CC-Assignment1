import React from 'react';
import { useRouter } from 'next/router';
import useForm from '@lib/hooks/useForm';
import validate from '@lib/validationRules/PostValidationRules';

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

const ForumPostForm = (props: any) => {
	const router = useRouter();
	const { values, errors, handleChange, handleSubmit, handleFile }: UseFormHook = useForm(postForm, validate);

	async function postForm() {
		const formData = new FormData();
		formData.append('message_image', values.fileBlob);
		formData.append('authorId', props.session.id);
		formData.append('subject', values.subject);
		formData.append('message', values.message);

		await fetch('/api/posts', {
			body: formData,
			method: 'POST'
		});
		setTimeout(() => {
			return router.reload();
		}, 1500);
	}

	return (
		<div className="inner-container">
			<div className="header">New Post</div>
			<div className="box">
				<div className="input-group">
					<label htmlFor="subject">Subject</label>
					<input
						type="text"
						name="subject"
						className="login-input"
						placeholder="New Subject"
						onChange={handleChange}
						value={values.subject || ''}
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
						value={values.message || ''}
						required
					/>
					<small className="danger-error">{errors.message ? errors.message : ''}</small>
				</div>

				<div className="input-group">
					<label htmlFor="messageImage">Image Upload</label>
					<input type="file" name="messageImage" onChange={handleFile} required />
					{values.filePreview ? <img src={values.filePreview} width="120" height="120" /> : <img />}
					<small className="danger-error">{errors.filePreview ? errors.filePreview : ''}</small>
				</div>
				<button type="button" className="login-btn" onClick={handleSubmit}>
					Submit Post
				</button>
			</div>
		</div>
	);
};

export default ForumPostForm;
