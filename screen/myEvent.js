import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ImageBackground, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Container, Header, Left, Body, Right, Title, Subtitle, Button, Content, Footer, FooterTab, Icon, Thumbnail } from 'native-base';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

export default class myEvent extends Component {
	static navigationOptions = { header: null };
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			isLoading: true,
		};
	}

	componentDidMount() {
		this.getData();
	}

	getData = async () => {
		const url = global.ACCESS.BASE_URL + 'getMyEvent';
		const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({
				parent_id: savedID,
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
				//this.setState({ visible: false });
			});
	};

	// mySubmission = async () => {
	// 	const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
	// 	if (savedID > 0) {
	// 		this.props.navigation.navigate('mySubmission');
	// 	} else {
	// 		this.props.navigation.navigate('login');
	// 	}
	// };

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

	render() {
		return (
			<Container>
				<Header style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<ImageBackground source={require('../assets/images/header-bg.jpg')} style={{ width: '100%', flexDirection: 'row' }}>
						<Left style={{ flex: 0.2 }}>
							<Text></Text>
						</Left>
						<Body style={{ flex: 0.6, alignItem: 'center' }}>
							<Title style={{ color: '#000000', justifyContent: 'center', alignItems: 'stretch', alignSelf: 'center' }}>EventHome</Title>
						</Body>
						<Right style={{ flex: 0.2, paddingRight: 2 }}>
							<Thumbnail small source={{ uri: global.coreURL + 'upload/raj.jpg' }} />
						</Right>
					</ImageBackground>
				</Header>

				<Content>
					<LinearGradient colors={['#fccd15', '#f96305']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
						{this.state.data.map((item, index) => {
							return (
								<Card key={index}>
									<CardTitle
										title={item.title}
										titleStyle={{ fontSize: 16, alignSelf: 'center', textAlign: 'center' }}
										style={{ backgroundColor: 'transparent' }}
									/>
									<CardImage source={{ uri: global.coreURL + 'uploads/event/' + item.image_url }} />

									<CardContent style={{ backgroundColor: '#FF6433', alignItem: 'center' }}>
										<View
											style={{
												flex: 1,
												flexDirection: 'row',
												justifyContent: 'center',
												alignItem: 'center',
												alignSelf: 'center',
												paddingTop: 15,
											}}>
											<Text
												style={{
													flex: 0.2,
													height: 40,
													justifyContent: 'center',
													alignItems: 'stretch',
													alignSelf: 'center',
													borderColor: '#ffffff',
													padding: 10,
													borderWidth: 3,
													borderRadius: 10,
													textAlign: 'center',
												}}>
												{item.close_date}
											</Text>
											<Text
												style={{
													flex: 0.6,
													justifyContent: 'center',
													alignItems: 'stretch',
													alignSelf: 'center',
													textAlign: 'center',
												}}>
												{item.name}
											</Text>
											{item.status == '1' ? (
												<Text
													style={{
														flex: 0.2,
														height: 40,
														justifyContent: 'center',
														alignItems: 'stretch',
														alignSelf: 'center',
														borderColor: '#ffffff',
														padding: 10,
														borderWidth: 3,
														borderRadius: 10,
														textAlign: 'center',
													}}>
													Submitted
												</Text>
											) : null}
										</View>
									</CardContent>
									<CardAction separator={true} inColumn={false} style={{ borderBottomWidth: 1, justifyContent: 'space-between' }}>
										<CardButton
											onPress={() => {
												this.props.navigation.navigate('eventDetail', { eventId: item.event_id });
											}}
											title="Details"
											style={{ borderWidth: 3, borderRadius: 10, backgroundColor: '#A7F311', borderColor: '#64CE1F' }}
											titleStyle={{ color: '#7011DC' }}
										/>

										{item.status == '1' ? null : (
											<CardButton
												onPress={() => {
													this.props.navigation.navigate('mySubmission', {
														participantId: item.participant_id,
														eventId: item.event_id,
													});
												}}
												title="Submission"
												style={{ borderWidth: 3, borderRadius: 10, backgroundColor: '#A7F311', borderColor: '#64CE1F' }}
												titleStyle={{ color: '#7011DC' }}
											/>
										)}
									</CardAction>
								</Card>
							);
						})}
					</LinearGradient>
				</Content>

				<Footer style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<FooterTab style={{ backgroundColor: '#FFFFFF' }}>
						<Button vertical style={{ backgroundColor: '#e6ffff' }} onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="home" active />
							<Text>Event</Text>
						</Button>
						<Button vertical onPress={() => this.myEvent()}>
							<Icon type="FontAwesome" name="trophy" />
							<Text>Enrollment</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('notification')}>
							<Icon type="FontAwesome" name="eye" />
							<Text>Notification</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('contact')}>
							<Icon type="FontAwesome" name="paper-plane" />
							<Text>Contact</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
		);
	}
}
var styles = StyleSheet.create({});
