import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TextInput, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Content, Footer, FooterTab, Icon, Input, Item } from 'native-base';
import { CardButton } from 'react-native-material-cards';
import LinearGradient from 'react-native-linear-gradient';
import Loader from './components/Loader';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

const emailPattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;

export default class forgotPassword extends Component {
	static navigationOptions = { header: null };
	constructor(props) {
		super(props);
		this.state = {
			showPass: false,
			showCPass: false,
			passIcon: 'visibility-off',
			cPassIcon: 'visibility-off',
			email: '',
			password: '',
			cPassword: '',
			isLoading: false,
		};
	}

	gotoScreen(screenName) {
		this.props.navigation.navigate(screenName);
	}

	_showPassword = () => {
		let PassShow = this.state.showPass;
		PassShow ? this.setState({ passIcon: 'visibility-off' }) : this.setState({ passIcon: 'visibility' });
		this.setState({ showPass: !PassShow });
	};

	_showCPassword = () => {
		let CPassShow = this.state.showCPass;
		CPassShow ? this.setState({ cPassIcon: 'visibility-off' }) : this.setState({ cPassIcon: 'visibility' });
		this.setState({ showCPass: !CPassShow });
	};

	_forgotPass = () => {
		if (this.state.email == '') {
			Alert.alert('Error', 'Email Id should not be blank!');
		} else if (!emailPattern.test(this.state.email)) {
			Alert.alert('Error', 'mail Should Be example@example.com Format !');
		} else if (this.state.password == '') {
			Alert.alert('Error', 'Password should not Blank!');
		} else if (this.state.cPassword == '') {
			Alert.alert('Error', 'Confirm Password should not Blank!');
		} else if (this.state.cPassword != this.state.password) {
			Alert.alert('Error', "Password Doesn't Matched !");
		} else {
			const url = global.ACCESS.BASE_URL + 'doChangePass';
			this.setState({ isLoading: true });
			fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					credentials: 'same-origin',
				},
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password,
					confirm_password: this.state.cPassword,
				}),
			})
				.then((response) => {
					const status = response.status;
					const data = response.json();

					return Promise.all([status, data]);
				})
				.then((responseJson) => {
					if (responseJson[0] == 200) {
						this.setState({ email: '', password: '', cPassword: '', isLoading: false });
						Alert.alert('Success Message !!', responseJson[1].msg, [{ text: 'OK', onPress: () => this.props.navigation.pop() }], {
							cancelable: false,
						});
					} else {
						Alert.alert('Error Message !!', responseJson[1].msg);
						this.setState({ isLoading: false });
					}
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	// myEvent = async () => {
	// 	const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
	// 	if (savedID > 0) {
	// 		this.props.navigation.navigate('myEvent');
	// 	} else {
	// 		this.props.navigation.navigate('login');
	// 	}
	// };

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
							<Title style={{ color: '#000000', justifyContent: 'center', alignItems: 'stretch', alignSelf: 'center' }}>Forgot Password</Title>
						</Body>
						<Right style={{ flex: 0.2, paddingRight: 2 }}></Right>
					</ImageBackground>
				</Header>

				<Content>
					<LinearGradient colors={['#58D68D', '#5DADE2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
						<View style={{ height: 100 }}>
							<Image style={{ width: '100%', height: 100 }} source={require('../assets/images/logo.png')} resizeMode="contain"></Image>
						</View>
						<View style={{ flex: 1, marginTop: 100 }}>
							<View style={{ padding: 5 }}>
								<Item rounded style={{ padding: 10 }}>
									<MaterialIcon name="email" color="#08546d" size={24} />
									<TextInput
										style={style.textInput}
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
									<MaterialIcon name="lock" color="#08546d" size={24} />
									<TextInput
										style={style.textInput}
										placeholder="Enter Your New Password"
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
									<MaterialIcon name="lock" color="#08546d" size={24} />
									<TextInput
										style={style.textInput}
										placeholder="Confirm Your Password"
										autoCorrect={false}
										value={this.state.cPassword}
										secureTextEntry={!this.state.showCPass}
										onChangeText={(pass) => this.setState({ cPassword: pass })}
										autoCapitalize="none"
									/>
									<MaterialIcon name={this.state.cPassIcon} onPress={() => this._showCPassword()} color="#08546d" size={24} />
								</Item>
							</View>
							<View style={{ padding: 5, paddingLeft: 40, paddingRight: 45 }}>
								<CardButton
									onPress={() => this._forgotPass()}
									title="Forgot Password"
									style={{ borderWidth: 3, borderRadius: 10, backgroundColor: '#A7F311', borderColor: '#64CE1F' }}
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
						<Button vertical onPress={() => this.myEvent()}>
							<Icon type="FontAwesome" name="trophy" />
							<Text>Enrollment</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="eye" />
							<Text>Notification</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('contact')}>
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
