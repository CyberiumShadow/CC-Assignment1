import React from 'react';
import { parseISO, format } from 'date-fns';

export default function Date({ dateString }: { dateString: string }) {
	const date = parseISO(dateString);
	return <time dateTime={dateString}>{format(date, 'hh:mm:ss a LLLL d, yyyy')}</time>;
}
