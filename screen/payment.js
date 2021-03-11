import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Container, Header, Left, Body, Right, Title, Button, Content, Footer, FooterTab, Icon, Input, Item, Toast, Root } from 'native-base';
import { CardTitle, CardButton } from 'react-native-material-cards';
import LinearGradient from 'react-native-linear-gradient';
import stripe from 'react-native-stripe-payments';
import Loader from './components/Loader';

export default class payment extends Component {
	static navigationOptions = { header: null };
	constructor(props) {
		super(props);
		/* 2. Get the param */
		const { eventId, participantId } = this.props.route.params;
		this.state = {
			event_id: eventId,
			participant_id: participantId,
			isLoading: false,
			c_number: '',
			c_year: '',
			c_month: '',
			c_cvv: '',
			c_name: '',
			c_amount: '',
			c_currency: 'INR',
			c_desc: '',
		};

		this.getData();
	}

	componentDidMount() {
		this._getData = this.props.navigation.addListener('focus', () => {
			stripe.setOptions({ publishingKey: global.ACCESS.stripePK });
			this.getData();
		});
	}

	componentWillUnmount() {
		this._getData();
	}

	getData() {
		const url = ACCESS.BASE_URL + 'singleEventData';
		const { eventId } = this.props.route.params;
		this.setState({ isLoading: true });
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				event_id: eventId,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				// console.log(res);
				this.setState({
					c_amount: res.data.entry_fees,
					c_desc: res.data.title,
					isLoading: false,
				});
			})
			.catch((error) => {
				console.log(error);
				this.setState({ isLoading: false });
			});
	}

	gotoScreen(screenName) {
		this.props.navigation.navigate(screenName);
	}

	makePayment() {
		const isCardValid = stripe.isCardValid({
			number: this.state.c_number,
			expMonth: parseInt(this.state.c_month),
			expYear: parseInt(this.state.c_year),
			cvc: this.state.c_cvv,
		});

		// console.log('DATA=', this.state.c_number, parseInt(this.state.c_month), parseInt(this.state.c_year), this.state.c_cvv);
		if (isCardValid) {
			// const card = {
			// 	'card[number]': '4242424242424242',
			// 	'card[exp_month]': 10,
			// 	'card[exp_year]': 21,
			// 	'card[cvc]': '888',
			// };

			const card = {
				'card[number]': this.state.c_number,
				'card[exp_month]': parseInt(this.state.c_month),
				'card[exp_year]': parseInt(this.state.c_year),
				'card[cvc]': this.state.c_cvv,
			};

			this.setState({ isLoading: true });

			fetch('https://api.stripe.com/v1/tokens', {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: 'Bearer ' + global.ACCESS.stripeSK,
				},
				method: 'post',
				body: Object.keys(card)
					.map((key) => key + '=' + card[key])
					.join('&'),
			})
				.then((res) => res.json())
				.then((res) => {
					// Make payment
					// console.log('ID', res.id); // ID tok_1IJZAvGZuMnpPMeI33XgTc6k
					// console.log('amount=' + parseInt(this.state.c_amount) + '&currency=' + this.state.c_currency + '&description=' + this.state.c_desc + '&source=' + res.id);

					fetch('https://api.stripe.com/v1/charges', {
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/x-www-form-urlencoded',
							Authorization: 'Bearer ' + global.ACCESS.stripeSK,
						},
						method: 'post',
						body: 'amount=' + parseInt(this.state.c_amount) + '&currency=' + this.state.c_currency + '&description=' + this.state.c_desc + '&source=' + res.id,
					})
						.then((res2) => res2.json())
						.then((res2) => {
							// console.log('Result', res2);
							if (res2.status == 'succeeded') {
								let amount = parseInt(this.state.c_amount);
								let event_id = this.state.event_id;
								let participant_id = this.state.participant_id;
								let transact_id = res2.id;
								let middleman = res2.calculated_statement_descriptor;
								let currency = res2.currency;
								let payment_on = res2.created;

								const url = ACCESS.BASE_URL + 'savePayment';

								fetch(url, {
									method: 'POST',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
										credentials: 'same-origin',
									},
									body: JSON.stringify({
										amount,
										event_id,
										participant_id,
										transact_id,
										middleman,
										currency,
										payment_on,
									}),
								})
									.then((response) => {
										const status = response.status;
										const data = response.json();

										return Promise.all([status, data]);
									})
									.then((responseJson) => {
										if (responseJson[0] == 200) {
											// Toast.show({
											// 	text: 'Payment Successfull.',
											// 	textStyle: { textAlign: 'center' },
											// 	position: 'top',
											// 	type: 'success',
											// });

											Alert.alert(
												'Success Message !!',
												'Payment Successfull.',
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
							} else {
								Toast.show({
									text: 'Payment Failed.',
									textStyle: { textAlign: 'center' },
									position: 'top',
									type: 'danger',
								});
							}
						});
				});
		} else {
			Toast.show({
				text: 'Invalid Credit Card.',
				textStyle: { textAlign: 'center' },
				position: 'top',
				type: 'danger',
			});
		}
	}

	setSelectedValue(itemValue, type) {
		if (type == 'M') {
			this.setState({
				c_month: itemValue,
			});
		} else {
			this.setState({
				c_year: itemValue,
			});
		}
	}

	render() {
		const { isLoading } = this.state;
		return (
			<Root>
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
						<LinearGradient colors={['#fccd15', '#f96305']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
							<View style={{ flex: 1 }}>
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<View style={{ flex: 0.8, alignItem: 'center', paddingLeft: 5 }}>
										<CardTitle title={'PAYMENT'} />
									</View>
								</View>
								<View style={{ alignItems: 'stretch', alignSelf: 'center' }}>
									<Text style={{ fontSize: 18 }}>{this.state.c_desc}</Text>
									<Text style={{}}>Amount: INR {this.state.c_amount}</Text>
								</View>
								<View style={{ flex: 1, marginTop: 50 }}>
									<View style={{ padding: 5 }}>
										<Item rounded style={{ padding: 10 }}>
											<Icon active name="home" />
											<TextInput
												style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
												placeholder="Enter Your Card Number"
												keyboardType="phone-pad"
												value={this.state.c_number}
												onChangeText={(cNum) => this.setState({ c_number: cNum })}
											/>
										</Item>
									</View>

									<View style={{ padding: 5, flexDirection: 'row' }}>
										<Item rounded>
											<Icon active name="home" />

											<Picker
												selectedValue={this.state.c_month}
												style={{ height: 50, width: 100 }}
												onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue, 'M')}>
												<Picker.Item label="01" value="1" />
												<Picker.Item label="02" value="2" />
												<Picker.Item label="03" value="3" />
												<Picker.Item label="04" value="4" />
												<Picker.Item label="05" value="5" />
												<Picker.Item label="06" value="6" />
												<Picker.Item label="07" value="7" />
												<Picker.Item label="08" value="8" />
												<Picker.Item label="09" value="9" />
												<Picker.Item label="10" value="10" />
												<Picker.Item label="11" value="11" />
												<Picker.Item label="12" value="12" />
											</Picker>
											<Picker
												selectedValue={this.state.c_year}
												style={{ height: 50, width: 100 }}
												onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue, 'Y')}>
												<Picker.Item label="2020" value="20" />
												<Picker.Item label="2021" value="21" />
												<Picker.Item label="2022" value="22" />
												<Picker.Item label="2023" value="23" />
												<Picker.Item label="2024" value="24" />
												<Picker.Item label="2025" value="25" />
												<Picker.Item label="2026" value="26" />
												<Picker.Item label="2027" value="27" />
											</Picker>
										</Item>
										<Item rounded style={{ height: 50, width: 150 }}>
											<TextInput
												style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
												placeholder="Enter Your CVV"
												keyboardType="phone-pad"
												value={this.state.c_cvv}
												onChangeText={(c_cvv) => this.setState({ c_cvv })}
											/>
										</Item>
									</View>
									<View style={{ padding: 5 }}>
										<Item rounded style={{ padding: 10 }}>
											<Icon active name="home" />
											<TextInput
												style={[style.textInput, { paddingLeft: 0, marginLeft: 20 }]}
												placeholder="Name on Card"
												value={this.state.c_name}
												onChangeText={(c_name) => this.setState({ c_name })}
											/>
										</Item>
									</View>
									<View style={{ padding: 5, paddingLeft: 40, paddingRight: 45 }}>
										<CardButton
											onPress={() => {
												this.makePayment();
											}}
											title="Confirm Payment"
											style={{ borderWidth: 3, borderRadius: 10, backgroundColor: '#A7F311', borderColor: '#64CE1F', height: 50 }}
											titleStyle={{ color: '#7011DC' }}
										/>
									</View>
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
				</Container>
				<Loader modalVisible={isLoading} animationType="fade" />
			</Root>
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
