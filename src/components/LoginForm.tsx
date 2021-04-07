import React from 'react';
import { useRouter } from 'next/router';
import { useCookie } from 'next-universal-cookie';
import useForm from '@lib/hooks/useForm';
import validate from '@lib/validationRules/LoginFormValidationRules';

interface UseFormHook {
	values: {
		[key: string]: any;
	};
	errors: {
		login?: string;
		userID?: string;
		password?: string;
	};
	setErrors: ({}) => void;
	handleChange: (event: any) => void;
	handleSubmit: (event: any) => void;
	handleFile: (event: any) => void;
}

const LoginForm = () => {
	const router = useRouter();
	const [_cookie, setCookie] = useCookie(['session']);
	const { values, errors, setErrors, handleChange, handleSubmit }: UseFormHook = useForm(postForm, validate);

	async function postForm() {
		const res = await fetch('/api/users/login', {
			body: JSON.stringify({
				id: values.userID,
				password: values.password
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});

		const result = await res.json();
		if (res.status === 401) {
			return setErrors({ login: result.message });
		}
		setCookie('session', JSON.stringify(result), {
			path: '/',
			maxAge: 6000,
			sameSite: true
		});
		// localStorage.setItem('session', JSON.stringify(result));
		return router.push('/forum');
	}

	return (
		<div className="inner-container">
			<div className="header">Login</div>
			<small className="danger-error">{errors.login ? errors.login : ''}</small>
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
				<button type="button" className="login-btn" onClick={handleSubmit}>
					Login
				</button>
			</div>
		</div>
	);
};

export default LoginForm;
