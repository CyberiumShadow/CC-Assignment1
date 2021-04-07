import React from 'react';
import { useRouter } from 'next/router';
import useForm from '@lib/hooks/useForm';
import validate from '@lib/validationRules/RegisterFormValidationRules';

interface UseFormHook {
	values: {
		[key: string]: any;
	};
	errors: {
		fileBlob?: string;
		filePreview?: string;
		userID?: string;
		username?: string;
		password?: string;
	};
	setErrors: ({}) => void;
	handleChange: (event: any) => void;
	handleSubmit: (event: any) => void;
	handleFile: (event: any) => void;
}

const RegisterForm = () => {
	const router = useRouter();
	const { values, errors, setErrors, handleChange, handleSubmit, handleFile }: UseFormHook = useForm(postForm, validate);

	async function postForm() {
		const formData = new FormData();
		formData.append('avatar', values.fileBlob);
		formData.append('id', values.userID);
		formData.append('username', values.username);
		formData.append('password', values.password);

		const res = await fetch('/api/users', {
			body: formData,
			method: 'POST'
		});

		const result = await res.json();

		if (res.status === 409) {
			return setErrors({ login: result.message });
		}
		return router.reload();
	}

	return (
		<div className="inner-container">
			<div className="header">Register</div>
			<div className="box">
				<div className="input-group">
					<label htmlFor="userID">User ID</label>
					<input
						type="text"
						name="userID"
						className="login-input"
						placeholder="s3720461"
						onChange={handleChange}
						value={values.userID || ''}
						required
					/>
					<small className="danger-error">{errors.userID ? errors.userID : ''}</small>
				</div>

				<div className="input-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						className="login-input"
						placeholder="JohnsonChen"
						onChange={handleChange}
						value={values.username || ''}
						required
					/>
					<small className="danger-error">{errors.username ? errors.username : ''}</small>
				</div>

				<div className="input-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						className="login-input"
						placeholder="Password"
						onChange={handleChange}
						value={values.password || ''}
						required
					/>
					<small className="danger-error">{errors.password ? errors.password : ''}</small>
				</div>

				<div className="input-group">
					<label htmlFor="accountAvatar">Avatar Upload</label>
					<input type="file" name="avatar" onChange={handleFile} required />
					{values.filePreview ? <img src={values.filePreview} width="120" height="120" /> : <img />}
					<small className="danger-error">{errors.filePreview ? errors.filePreview : ''}</small>
				</div>
				<button type="button" className="login-btn" onClick={handleSubmit}>
					Register
				</button>
			</div>
		</div>
	);
};

export default RegisterForm;
