export default function validate(values: Record<string, unknown>) {
	const errors: Record<string, unknown> = {};
	if (!values.subject) {
		errors.subject = 'Subject is required';
	}
	if (!values.message) {
		errors.message = 'Message is required';
	}
	if (!values.filePreview) {
		errors.filePreview = 'File is required';
	}
	// If One or more values exist, allow edit
	if (Object.keys(values).some((r) => ['subject', 'message', 'filePreview'].includes(r))) return {};
	return errors;
}
