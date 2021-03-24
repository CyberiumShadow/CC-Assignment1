import '@styles/globals.css';
import React from 'react';

import type { NextPage } from 'next';
import type AppProps from 'next/app';

const app: NextPage<AppProps> = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default app;
