export default function validate(values: Record<string, unknown>) {
	const errors: Record<string, unknown> = {};
	if (!values.userID) {
		errors.userID = 'User ID is required';
	}
	if (!values.username) {
		errors.username = 'Username is required';
	}
	if (!values.password) {
		errors.password = 'Password is required';
	}
	if (!values.filePreview) {
		errors.filePreview = 'File is required';
	}
	return errors;
}
