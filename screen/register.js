import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Image, ImageBackground, TextInput } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Content, Footer, FooterTab, Icon, Input, Item } from 'native-base';
import { CardButton } from 'react-native-material-cards';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Loader from './components/Loader';

const emailPattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;

export default class register extends Component {
	static navigationOptions = { header: null };
	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			email: '',
			password: '',
			addr1: '',
			addr2: '',
			city: '',
			stateName: '',
			zip: '',

			showPass: false,
			passIcon: 'visibility-off',
			isLoading: false,
		};
	}

	_showPassword = () => {
		let PassShow = this.state.showPass;
		PassShow ? this.setState({ passIcon: 'visibility-off' }) : this.setState({ passIcon: 'visibility' });
		this.setState({ showPass: !PassShow });
	};

	gotoScreen(screenName) {
		this.props.navigation.navigate(screenName);
	}

	_registration = () => {
		try {
			if (this.state.mobile == '') {
				Alert.alert('Error', 'Contact Number should not be blank!');
			} else if (this.state.email == '') {
				Alert.alert('Error', 'Email Id should not be blank!');
			} else if (!emailPattern.test(this.state.email)) {
				Alert.alert('Error', 'mail Should Be example@example.com Format !');
			} else if (this.state.password == '') {
				Alert.alert('Error', 'Password should not be blank!');
			} else {
				this.setState({ isLoading: true });
				const url = global.ACCESS.BASE_URL + 'register';
				// console.log(url);
				fetch(url, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						credentials: 'same-origin',
					},
					body: JSON.stringify({
						mobile: this.state.mobile,
						email: this.state.email,
						password: this.state.password,
						addr_1: this.state.addr1,
						addr_2: this.state.addr2,
						city: this.state.city,
						state: this.state.stateName,
						zip: this.state.zip,
					}),
				})
					.then((response) => {
						const status = response.status;
						const data = response.json();

						return Promise.all([status, data]);
					})
					.then((responseJson) => {
						if (responseJson[0] == 200) {
							Alert.alert(
								'Success Message !!',
								responseJson[1].msg + ' Please Login To Continue.',
								[{ text: 'OK', onPress: () => this.props.navigation.pop() }],
								{
									cancelable: false,
								},
							);
							this.setState({ isLoading: false });
						} else {
							Alert.alert('Error Message !!', responseJson[1].msg);
							this.setState({ isLoading: false });
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
		} catch (e) {
			console.log(e);
			this.setState({ isLoading: false });
		}
	};

	render() {
		const { isLoading } = this.state;
		return (
			<Container>
				<Header style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<ImageBackground source={require('../assets/images/header.png')} style={{ width: '100%', flexDirection: 'row' }}>
						<Left style={{ flex: 0.2 }}>
							<Text></Text>
						</Left>
						<Body style={{ flex: 0.6, alignItem: 'center' }}>
							<Title style={{ color: '#000000', justifyContent: 'center', alignItems: 'stretch', alignSelf: 'center' }}>EventHome</Title>
						</Body>
						<Right style={{ flex: 0.2, paddingRight: 2 }}></Right>
					</ImageBackground>
				</Header>

				<Content>
					<LinearGradient colors={['#58D68D', '#5DADE2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
						<View style={{ height: 100 }}>
							<Image style={{ width: '100%', height: 100 }} source={require('../assets/images/logo.png')} resizeMode="contain"></Image>
						</View>
						<View style={{ flex: 1, marginTop: 10 }}>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Your Mobile Number"
										keyboardType="phone-pad"
										value={this.state.mobile}
										onChangeText={(contact) => this.setState({ mobile: contact })}
									/>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Your E-mail Address"
										value={this.state.email}
										keyboardType="email-address"
										onChangeText={(ep) => this.setState({ email: ep })}
										autoCapitalize="none"
									/>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Your Password"
										autoCorrect={false}
										value={this.state.password}
										secureTextEntry={!this.state.showPass}
										onChangeText={(pass) => this.setState({ password: pass })}
										autoCapitalize="none"
									/>
									<MaterialIcon name={this.state.passIcon} onPress={() => this._showPassword()} color="#08546d" size={24} />
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Your Address Line One"
										multiline
										value={this.state.addr1}
										onChangeText={(addr1) => this.setState({ addr1 })}
									/>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Your Address Line Two"
										multiline
										value={this.state.addr2}
										onChangeText={(addr2) => this.setState({ addr2 })}
									/>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Your City Name"
										value={this.state.city}
										onChangeText={(city) => this.setState({ city })}
									/>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Your State Name"
										value={this.state.stateName}
										onChangeText={(state) => this.setState({ stateName: state })}
									/>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Your Zip Code"
										value={this.state.zip}
										onChangeText={(zip) => this.setState({ zip })}
									/>
								</Item>
							</View>

							<View style={{ padding: 5, paddingLeft: 40, paddingRight: 45 }}>
								<CardButton
									onPress={() => this._registration()}
									title="Register"
									style={{ borderWidth: 3, borderRadius: 10, backgroundColor: '#A7F311', borderColor: '#64CE1F' }}
									titleStyle={{ color: '#7011DC' }}
								/>
							</View>
							<View style={{ padding: 5, paddingLeft: 40, paddingRight: 45 }}>
								<CardButton
									onPress={() => {
										this.props.navigation.navigate('login');
									}}
									title="Login"
									titleStyle={{ color: '#7011DC' }}
								/>
							</View>
						</View>
					</LinearGradient>
				</Content>

				{/* <Footer style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<FooterTab style={{ backgroundColor: '#FFFFFF' }}>
						<Button vertical style={{ backgroundColor: '#e6ffff' }} onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="home" active />
							<Text>Event</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="trophy" />
							<Text>Enrollment</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="eye" />
							<Text>Notification</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="paper-plane" />
							<Text>Contact</Text>
						</Button>
					</FooterTab>
				</Footer> */}
				<Loader modalVisible={isLoading} animationType="fade" />
			</Container>
		);
	}
}

const style = StyleSheet.create({
	textInput: {
		flex: 1,
		padding: 0,
		paddingLeft: 10,
		marginHorizontal: 5,
	},
});
