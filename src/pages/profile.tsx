import React from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import { applyServerSidePropsCookie } from 'next-universal-cookie';
import Layout from '@components/loginLayout';
import PasswordEditForm from '@components/PasswordEditForm';
import parseCookies from '@lib/parseCookie';
import utilStyles from '@styles/utils.module.css';
import type { GetServerSideProps } from 'next';
import { getUserPostData } from '@lib/posts';
import Date from '@components/date';
import Link from 'next/link';

interface Props {
	session: string;
	allUserPostData: any[];
}

export default function Profile({ session, allUserPostData }: Props) {
	return (
		<>
			<Head>
				<title>Profile Page</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Container>
					<Row>
						<Col>
							<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
								<h2 className={utilStyles.headingXl}>Your Messages</h2>
								<ul className={utilStyles.list}>
									{allUserPostData.map((post: any) => (
										<li className={utilStyles.listItem} key={post.id}>
											<p>
												<b>{post.subject}</b>
											</p>
											<p>
												<img src={post.image} width={120} height={120} /> {post.message}
											</p>
											<br />
											<small className={utilStyles.lightText}>
												<Date dateString={post.timestamp} /> -{' '}
												<Link href={`/posts/${encodeURIComponent(post.id)}`}>
													<a>Edit Post</a>
												</Link>
											</small>
										</li>
									))}
								</ul>
							</section>
						</Col>
						<Col>
							<PasswordEditForm session={JSON.parse(session)} />
						</Col>
					</Row>
				</Container>
			</Layout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	applyServerSidePropsCookie(req, res);
	const cookies = parseCookies(req);
	if (!cookies.session) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}
	const postDataArray = await getUserPostData(JSON.parse(cookies.session).id);
	return {
		props: {
			session: cookies.session,
			allUserPostData: postDataArray
		}
	};
};
