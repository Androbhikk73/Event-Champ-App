import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Content, Footer, FooterTab, Icon, Thumbnail } from 'native-base';
import { Card, CardContent, CardAction } from 'react-native-material-cards';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './components/Loader';

export default class notification extends Component {
	static navigationOptions = { header: null };

	constructor(props) {
		super(props);
		this.getData();
		this.state = {
			data: [],
			isLoading: true,
		};
	}

	componentDidMount() {
		this._getData = this.props.navigation.addListener('focus', () => {
			this.getData();
		});
	}

	componentWillUnmount() {
		this._getData();
	}

	getData = async () => {
		const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
		const url = global.ACCESS.BASE_URL + 'getNotification';
		// console.log(savedID, url);
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				credentials: 'same-origin',
			},
			body: JSON.stringify({
				subscriber: savedID,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				// console.log(res);
				this.setState({
					data: res.data,
					isLoading: false,
				});
			})
			.catch((error) => {
				console.log(error);
				this.setState({ isLoading: false });
			});
	};

	gotoScreen(screenName) {
		this.props.navigation.navigate(screenName);
	}

	myEvent = async () => {
		const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
		if (savedID > 0) {
			this.props.navigation.navigate('myEvent');
		} else {
			this.props.navigation.navigate('login');
		}
	};

	myNote = async () => {
		const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
		if (savedID > 0) {
			this.props.navigation.navigate('notification');
		} else {
			this.props.navigation.navigate('login');
		}
	};

	render() {
		const { isLoading } = this.state;
		return (
			<Container>
				<Header style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<ImageBackground source={require('../assets/images/header-bg.jpg')} style={{ width: '100%', flexDirection: 'row' }}>
						<Left style={{ flex: 0.2 }}>
							<Text></Text>
						</Left>
						<Body style={{ flex: 0.6, alignItem: 'center' }}>
							<Title style={{ color: '#000000', justifyContent: 'center', alignItems: 'stretch', alignSelf: 'center' }}>Notification</Title>
						</Body>
						<Right style={{ flex: 0.2, paddingRight: 2 }}>
							<Thumbnail small source={{ uri: global.coreURL + 'upload/raj.jpg' }} />
						</Right>
					</ImageBackground>
				</Header>

				<Content>
					<LinearGradient colors={['#fccd15', '#f96305']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
						{this.state.data.map((item, i) => {
							return (
								<Card onPress={() => this.props.navigation.push('chatDetail', { noteId: item.id })} key={i}>
									<CardContent style={{ backgroundColor: '#FFFF' }}>
										<View
											style={{
												flex: 1,
												flexDirection: 'row',
												paddingTop: 10,
											}}>
											<Text style={{ fontSize: 18 }}>{item.message}</Text>
										</View>
									</CardContent>
									<CardAction
										separator={true}
										inColumn={false}
										style={{
											borderBottomWidth: 0,
											justifyContent: 'space-between',
											marginLeft: 10,
											marginRight: 10,
										}}>
										<Text style={{ fontSize: 18 }}>{item.date}</Text>
										<Text style={{ fontSize: 18 }}>{item.time}</Text>
									</CardAction>
								</Card>
							);
						})}
					</LinearGradient>
				</Content>

				<Footer style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<FooterTab style={{ backgroundColor: '#FFFFFF' }}>
						<Button vertical style={{ backgroundColor: '#e6ffff' }} onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="home" />
							<Text>Event</Text>
						</Button>
						<Button vertical onPress={() => this.myEvent()}>
							<Icon type="FontAwesome" name="trophy" />
							<Text>Enrollment</Text>
						</Button>
						<Button vertical onPress={() => this.myNote()}>
							<Icon type="FontAwesome" name="eye" active />
							<Text>Notification</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('contact')}>
							<Icon type="FontAwesome" name="paper-plane" />
							<Text>Contact</Text>
						</Button>
					</FooterTab>
				</Footer>

				<Loader modalVisible={isLoading} animationType="fade" />
			</Container>
		);
	}
}
var styles = StyleSheet.create({});
