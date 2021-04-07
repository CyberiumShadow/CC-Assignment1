import 'bootstrap/dist/css/bootstrap.min.css';
import '@styles/global.scss';
import React from 'react';
import { NextCookieProvider } from 'next-universal-cookie';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<NextCookieProvider cookie={pageProps.cookie}>
			<Component {...pageProps} />;
		</NextCookieProvider>
	);
}
