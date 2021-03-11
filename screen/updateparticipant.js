import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Content, Footer, FooterTab, Icon, Input, Item } from 'native-base';
import { CardButton } from 'react-native-material-cards';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-community/picker';
import Loader from './components/Loader';
import AsyncStorage from '@react-native-community/async-storage';

export default class updateparticipant extends Component {
	static navigationOptions = { header: null };
	constructor(props) {
		super(props);
		/* 2. Get the param */
		const { participant } = this.props.route.params;
		this.state = {
			isLoading: false,
			name: participant.name,
			gender: participant.gender,
			school_name: participant.school_name,
			className: participant.class,
			participant_id: participant.id,
		};
	}

	gotoScreen(screenName) {
		this.props.navigation.navigate(screenName);
	}

	updateParticipant = async () => {
		try {
			if (this.state.name == '') {
				Alert.alert('Error', 'Participant Name should not be blank!');
			} else if (this.state.gender == '') {
				Alert.alert('Error', 'Gender should not be blank!');
			} else if (this.state.school_name == '') {
				Alert.alert('Error', 'School should not be blank!');
			} else if (this.state.className == '') {
				Alert.alert('Error', 'Class should not be blank!');
			} else {
				this.setState({ isLoading: true });
				const url = global.ACCESS.BASE_URL + 'registerParticipant';
				var parId = await AsyncStorage.getItem(ACCESS.USER_ID);
				// console.log(url);
				fetch(url, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						credentials: 'same-origin',
					},
					body: JSON.stringify({
						name: this.state.name,
						gender: this.state.gender,
						school_name: this.state.school_name,
						class: this.state.className,
						parent_id: parId,
						participant_id: this.state.participant_id,
					}),
				})
					.then((response) => {
						const status = response.status;
						const data = response.json();

						return Promise.all([status, data]);
					})
					.then((responseJson) => {
						// console.log(responseJson);
						if (responseJson[0] == 200) {
							Alert.alert('Success Message !!', responseJson[1].msg, [{ text: 'OK', onPress: () => this.props.navigation.pop() }], {
								cancelable: false,
							});
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
							<Button
								transparent
								onPress={() => {
									this.props.navigation.pop();
								}}>
								<Icon type="FontAwesome" name="reply" style={{ color: 'green' }} />
							</Button>
						</Left>
						<Body style={{ flex: 0.6, alignItem: 'center' }}>
							<Title style={{ color: '#000000', justifyContent: 'center', alignItems: 'stretch', alignSelf: 'center' }}>EventHome</Title>
						</Body>
						<Right style={{ flex: 0.2, paddingRight: 2 }}></Right>
					</ImageBackground>
				</Header>

				<Content>
					<LinearGradient colors={['#58D68D', '#5DADE2']} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
						<View style={{ flex: 1, marginTop: 10 }}>
							<View style={{ padding: 5 }}>
								<Item rounded rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Participant Name"
										value={this.state.name}
										onChangeText={(name) => this.setState({ name })}
									/>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded rounded style={{ padding: 3 }}>
									<Icon active name="home" />
									<Picker
										selectedValue={this.state.gender}
										style={{ height: 50, width: '90%' }}
										onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
										<Picker.Item label="-- select gender --" value="" />
										<Picker.Item label="Male" value="M" />
										<Picker.Item label="Female" value="F" />
										<Picker.Item label="Other" value="O" />
									</Picker>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter School Name"
										value={this.state.school_name}
										autoCapitalize="words"
										onChangeText={(school_name) => this.setState({ school_name })}
									/>
								</Item>
							</View>
							<View style={{ padding: 5 }}>
								<Item rounded rounded style={{ padding: 10 }}>
									<Icon active name="home" />
									<TextInput
										style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
										placeholder="Enter Class"
										keyboardType="numeric"
										value={this.state.className}
										onChangeText={(className) => this.setState({ className })}
									/>
								</Item>
							</View>
							<View style={{ padding: 5, paddingLeft: 40, paddingRight: 45 }}>
								<CardButton
									onPress={() => this.updateParticipant()}
									title="Update Participant"
									style={{ borderWidth: 3, borderRadius: 10, backgroundColor: '#A7F311', borderColor: '#64CE1F' }}
									titleStyle={{ color: '#7011DC' }}
								/>
							</View>
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
						<Button vertical onPress={() => this.gotoScreen('eventHome')}>
							<Icon type="FontAwesome" name="eye" />
							<Text>Notification</Text>
						</Button>
						<Button vertical onPress={() => this.gotoScreen('eventHome')}>
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

const style = StyleSheet.create({
	textInput: {
		flex: 1,
		padding: 0,
		paddingLeft: 10,
		marginHorizontal: 5,
	},
});
