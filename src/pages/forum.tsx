import React from 'react';
import Head from 'next/head';
import { applyServerSidePropsCookie } from 'next-universal-cookie';
import MessageForm from '@components/NewPostForm';
import Date from '@components/date';
import Layout, { siteTitle } from '@components/layout';
import utilStyles from '@styles/utils.module.css';
import { getNumPostData } from '../lib/posts';
import parseCookies from '@lib/parseCookie';
import { Container, Row, Col } from 'react-bootstrap';
import UserPanel from '@components/UserPanel';

import type { GetServerSideProps } from 'next';

interface Props {
	session: string;
	allPostData: any[];
}

export default function Home({ session, allPostData }: Props) {
	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<Container>
				<Row>
					<Col>
						<UserPanel userSession={JSON.parse(session)} />
					</Col>
					<Col>
						<div className="root-container">
							<MessageForm session={JSON.parse(session)} />
						</div>
					</Col>
				</Row>
				<Row>
					<Col></Col>
					<Col>
						<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
							<h2 className={utilStyles.headingXl}>Message Board</h2>
							<ul className={utilStyles.list}>
								{allPostData.map((post) => (
									<li className={utilStyles.listItem} key={post.id}>
										<p>
											<b>{post.subject}</b>
										</p>
										<p>
											<img src={post.image} width={120} height={120} /> {post.message}
										</p>
										<br />
										<small className={utilStyles.lightText}>
											<img src={post.authorImage} width={60} height={60} /> Author: {post.authorName} <br />
											<Date dateString={post.timestamp} />
										</small>
									</li>
								))}
							</ul>
						</section>
					</Col>
					<Col></Col>
				</Row>
			</Container>
		</Layout>
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
	const postDataArray = await getNumPostData(10);
	return {
		props: {
			session: cookies.session,
			allPostData: postDataArray
		}
	};
};
