import React from 'react';
import { useCookie } from 'next-universal-cookie';
import { Container, Col, Row, Card } from 'react-bootstrap';

const UserPanel = ({ userSession }: { userSession: any }) => {
	const [_cookie, _setCookie, removeCookie] = useCookie(['session']);
	return (
		<Container>
			<Row>
				<Col></Col>
				<Col sm={6}>
					<Card>
						<Card.Img variant="top" src={userSession.avatar}></Card.Img>
						<Card.Body>
							<Card.Title>{userSession.userName}</Card.Title>
							<Card.Link href="/profile">User Profile</Card.Link>
							<Card.Link href="/" onClick={() => removeCookie('session', { path: '/' })}>
								Logout
							</Card.Link>
						</Card.Body>
					</Card>
				</Col>
				<Col></Col>
			</Row>
		</Container>
	);
};

export default UserPanel;
