import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

const headerStyle = {};

const Header = () => (
	<header>
		<Navbar className="Header">
			<Container className="d-flex justify-content-between px-3">
				<a href="#" className="navbar-brand d-flex align-items-center py-2">
					CC Assignment 1 - s3720461
				</a>
			</Container>
		</Navbar>
	</header>
);

export default Header;
