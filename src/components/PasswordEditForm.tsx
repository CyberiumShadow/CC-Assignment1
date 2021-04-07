import React from 'react';
import { useRouter } from 'next/router';
import { useCookie } from 'next-universal-cookie';
import useForm from '@lib/hooks/useForm';
import validate from '@lib/validationRules/PasswordChangeValidationRules';

interface UseFormHook {
	values: {
		[key: string]: any;
	};
	errors: {
		oldPassword?: string;
		newPassword?: string;
		passwordMatch?: string;
	};
	setErrors: ({}) => void;
	handleChange: (event: any) => void;
	handleSubmit: (event: any) => void;
}

const PasswordEditForm = (props: any) => {
	const router = useRouter();
	const [_cookie, _setCookie, removeCookie] = useCookie(['session']);
	const { values, errors, setErrors, handleChange, handleSubmit }: UseFormHook = useForm(postForm, validate);

	async function postForm() {
		const res = await fetch(`/api/users/${props.session.id}`, {
			body: JSON.stringify({
				oldPassword: values.oldPassword,
				newPassword: values.newPassword
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'PATCH'
		});

		const result = await res.json();
		if (res.status === 401) {
			return setErrors({ passwordMatch: result.message });
		}
		removeCookie('session', {
			path: '/'
		});
		return router.push('/login');
	}

	return (
		<div className="inner-container">
			<div className="header">Password Edit</div>
			<small className="danger-error">{errors.passwordMatch ? errors.passwordMatch : ''}</small>
			<div className="box">
				<div className="input-group">
					<label htmlFor="oldPassword">Current Password</label>
					<input
						type="password"
						name="oldPassword"
						className="login-input"
						onChange={handleChange}
						value={values.oldPassword || ''}
						required
					/>
					<small className="danger-error">{errors.oldPassword ? errors.oldPassword : ''}</small>
				</div>

				<div className="input-group">
					<label htmlFor="newPassword">New Password</label>
					<input
						type="password"
						name="newPassword"
						className="login-input"
						onChange={handleChange}
						value={values.newPassword || ''}
						required
					/>
					<small className="danger-error">{errors.newPassword ? errors.newPassword : ''}</small>
				</div>
				<button type="button" className="login-btn" onClick={handleSubmit}>
					Change Password
				</button>
			</div>
		</div>
	);
};

export default PasswordEditForm;
