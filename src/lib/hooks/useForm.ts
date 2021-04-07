import { useState, useEffect } from 'react';

const useForm = (callback: any, validate: any) => {
	const [values, setValues] = useState({});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (Object.keys(errors).length === 0 && isSubmitting) {
			callback();
		}
	}, [errors]);

	const handleSubmit = (event: any) => {
		if (event) event.preventDefault();
		setErrors(validate(values));
		setIsSubmitting(true);
	};

	const handleFile = (event: any) => {
		setValues((values) => ({ ...values, filePreview: URL.createObjectURL(event.target.files[0]), fileBlob: event.target.files[0] }));
	};

	const handleChange = (event: any) => {
		event.persist();
		setValues((values) => ({ ...values, [event.target.name]: event.target.value }));
	};

	return {
		handleChange,
		handleSubmit,
		handleFile,
		setValues,
		setErrors,
		values,
		errors
	};
};

export default useForm;
