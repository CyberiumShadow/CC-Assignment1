export default function validate(values: Record<string, unknown>) {
	const errors: Record<string, unknown> = {};
	if (!values.userID) {
		errors.userID = 'User ID is required';
	}
	if (!values.password) {
		errors.password = 'Password is required';
	}
	return errors;
}
