import React from 'react';
import Head from 'next/head';
import Layout from '@components/loginLayout';
import LoginBox from '@components/LoginForm';
import RegisterBox from '@components/RegisterForm';

interface LocalState {
	isLoginOpen: boolean;
	isRegisterOpen: boolean;
}

export default class App extends React.Component<Record<string, unknown>, LocalState> {
	public constructor(props: any) {
		super(props);
		this.state = {
			isLoginOpen: true,
			isRegisterOpen: false
		};
	}

	public render() {
		return (
			<>
				<Head>
					<title>Login Page</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Layout>
					<div className="root-container">
						<div className="box-controller">
							<div
								className={`controller ${this.state.isLoginOpen ? 'selected-controller' : ''}`}
								onClick={this.showLoginBox.bind(this)}
							>
								Login
							</div>
							<div
								className={`controller ${this.state.isRegisterOpen ? 'selected-controller' : ''}`}
								onClick={this.showRegisterBox.bind(this)}
							>
								Register
							</div>
						</div>
						<div className="box-container">
							{this.state.isLoginOpen && <LoginBox />}
							{this.state.isRegisterOpen && <RegisterBox />}
						</div>
					</div>
				</Layout>
			</>
		);
	}

	private showLoginBox() {
		this.setState({ isLoginOpen: true, isRegisterOpen: false });
	}

	private showRegisterBox() {
		this.setState({ isRegisterOpen: true, isLoginOpen: false });
	}
}
