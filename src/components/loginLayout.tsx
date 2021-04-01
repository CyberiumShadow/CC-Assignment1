import React from 'react';
import Header from './header';
import Footer from './footer';
import { Container } from 'react-bootstrap';

const layoutStyle = {};

const contentStyle = {};

const Layout = (props: any) => (
	<div className="Layout" style={layoutStyle}>
		<Header />
		<Container className="Content container" style={contentStyle}>
			{props.children}
		</Container>
		<Footer />
	</div>
);

export default Layout;
