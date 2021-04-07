import cookie from 'cookie';

export default function parseCookies(req: any) {
	return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}
