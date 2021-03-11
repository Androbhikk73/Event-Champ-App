import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Subtitle, Button, Content, Footer, FooterTab, Icon } from 'native-base';
import { CardTitle, CardButton } from 'react-native-material-cards';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

export default class participant extends Component {
	static navigationOptions = { header: null };
	constructor(props) {
		super(props);
		/* 2. Get the param */
		const { eventId } = this.props.route.params;
		this.getData();
		this.state = {
			event_id: eventId,
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
		const url = ACCESS.BASE_URL + 'getParticipantList';
		var parId = await AsyncStorage.getItem(ACCESS.USER_ID);
		// console.log(url, parId);
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				parent_id: parId,
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

	selectParticipant(partId) {
		// console.log(partId);
		this.props.navigation.navigate('payment', { eventId: this.state.event_id, participantId: partId });
	}

	gotoScreen(screenName) {
		this.props.navigation.navigate(screenName);
	}

	renderHeader() {
		return (
			<View style={styles.listItemSeparator}>
				<View style={{ flex: 1, flexDirection: 'row', margin: 1, borderColor: 'lightgrey', fontSize: 16 }}>
					<Text style={{ flex: 0.6, color: '#e6efe6' }}>Partipants</Text>
					<Text style={{ flex: 0.4, color: '#e6efe6' }}>Action</Text>
				</View>
			</View>
		);
	}

	onAddNew() {
		this.props.navigation.navigate('newparticipant');
	}

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
						<Right style={{ flex: 0.2, paddingRight: 2 }}></Right>
					</ImageBackground>
				</Header>

				<Content style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
					<LinearGradient colors={['#fccd15', '#f96305']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
						<View>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<View style={{ flex: 0.8, alignItem: 'center', paddingLeft: 5 }}>
									<CardTitle title={'PARTICIPANTS'} />
								</View>
								<View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }}>
									<Button info onPress={() => this.onAddNew()}>
										{/* <Text> </Text> */}
										<Icon name="add" type="Ionicons" />
									</Button>
								</View>
							</View>

							{this.state.data.map((item, index) => {
								return (
									<View style={styles.listItemSeparator2} key={index}>
										<View
											style={{
												flex: 1,
												flexDirection: 'row',
												fontSize: 16,
												margin: 1,
												borderColor: 'lightgrey',
												padding: 3,
												paddingTop: 6,
												paddingBottom: 6,
												backgroundColor: colors[index % 2],
											}}>
											<View style={{ flex: 0.6, flexDirection: 'column' }}>
												<Text style={{ flexWrap: 'wrap' }}>{`${item.name}`}</Text>
												<Text style={{ flexWrap: 'wrap' }}>{`${item.gender}`}</Text>
												<Text style={{ flexWrap: 'wrap' }}>{`${item.school_name}`}</Text>
												<Text style={{ flexWrap: 'wrap' }}>Class - {`${item.class}`}</Text>
											</View>
											<View style={{ flex: 0.4 }}>
												{item.status == '0' ? null : (
													<CardButton
														onPress={() => {
															this.selectParticipant(item.id);
														}}
														title="Select"
														style={{
															borderWidth: 3,
															borderRadius: 10,
															backgroundColor: '#A7F311',
															borderColor: '#64CE1F',
														}}
														titleStyle={{ color: '#7011DC' }}
													/>
												)}

												<CardButton
													onPress={() => {
														// console.log(item);
														this.props.navigation.navigate('updateparticipant', { participant: item });
													}}
													title="Edit"
													style={{ borderWidth: 3, borderRadius: 10, backgroundColor: '#A7F311', borderColor: '#64CE1F' }}
													titleStyle={{ color: '#7011DC' }}
												/>
											</View>
										</View>
									</View>
								);
							})}
						</View>
					</LinearGradient>
				</Content>

				<Footer style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<FooterTab style={{ backgroundColor: '#FFFFFF' }}>
						<Button vertical style={{ backgroundColor: '#e6ffff' }} onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="home" active />
							<Text>Event</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('eventHome')}>
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
let colors = ['#ffffff', '#e8f1f7', '#fdecba', '#abcdef'];
var styles = StyleSheet.create({
	listItemSeparator: {
		borderWidth: 0.5,
		borderColor: 'lightgrey',
		padding: 5,
		color: 'blue',
		backgroundColor: '#4262f4',
	},
	listItemSeparator2: {
		borderWidth: 0.5,
		borderColor: 'lightgrey',
		paddingVertical: 1,
		//height: 90,
		fontSize: 16,
		//flex:1
		padding: 5,
	},
});
