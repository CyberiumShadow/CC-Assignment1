export default function validate(values: Record<string, unknown>) {
	const errors: Record<string, unknown> = {};
	if (!values.oldPassword) {
		errors.oldPassword = 'Current Password is required';
	}
	if (!values.newPassword) {
		errors.newPassword = 'New Password is required';
	}
	return errors;
}
