import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@styles/layout.module.css';
import utilStyles from '@styles/utils.module.css';

const name = 's3720461 - CC Assignment 1';
export const siteTitle = 's3720461 - CC Assignment 1';

export default function Layout({ children, home }: { children: React.ReactNode; home?: boolean }) {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="RMIT Cloud Computing Assignment 1" />
				<meta name="og:title" content={siteTitle} />
			</Head>
			<header className={styles.header}>
				{home ? (
					<>
						<h1 className={utilStyles.heading2Xl}>{name}</h1>
					</>
				) : (
					<>
						<h2 className={utilStyles.headingLg}>
							<Link href="/forum">
								<a className={utilStyles.colorInherit}>{name}</a>
							</Link>
						</h2>
					</>
				)}
			</header>
			<main>{children}</main>
			{!home && (
				<div className={styles.backToHome}>
					<Link href="/forum">
						<a>← Back to home</a>
					</Link>
				</div>
			)}
		</>
	);
}
