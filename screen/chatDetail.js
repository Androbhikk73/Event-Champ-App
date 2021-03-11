import React, { Component } from 'react';
import { View, Text, Platform, ImageBackground, TextInput, FlatList, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Content, Footer, FooterTab, Icon, Thumbnail } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

export default class chatDetail extends Component {
	static navigationOptions = { header: null };

	constructor(props) {
		super(props);
		/* 2. Get the param */
		const { noteId } = this.props.route.params;
		this.state = {
			note_id: noteId,
			message: '',
			subs_id: '',
			items: [],
			isLoading: true,
		};

		this.getData();
	}

	componentDidMount() {
		this._getData = this.props.navigation.addListener('focus', () => {
			this.getId();
			this.getData();
		});
	}

	componentWillUnmount() {
		this._getData();
	}

	getId = async () => {
		try {
			const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
			this.setState({ subs_id: savedID });
		} catch (e) {
			console.log(e);
		}
	};

	getData = async () => {
		const url = global.ACCESS.BASE_URL + 'getNoteById';
		// console.log(savedID, url);
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				credentials: 'same-origin',
			},
			body: JSON.stringify({
				noteid: this.state.note_id,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				// console.log(res);
				this.setState({
					items: res.data,
					isLoading: false,
				});
			})
			.catch((error) => {
				console.log(error);
				//this.setState({ visible: false });
			});
	};

	render() {
		// this.getData();
		const { subs_id } = this.state;
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

				{/* <Content> */}
				{/* <LinearGradient colors={['#fccd15', '#f96305']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}> */}
				<View style={{ flex: 1 }}>
					<View style={{ flex: 0.9, flexDirection: 'column', backgroundColor: '#D0D3D4' }}>
						<FlatList
							ref={(ref) => (this.flatList = ref)}
							onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
							onLayout={() => this.flatList.scrollToEnd({ animated: true })}
							data={this.state.items}
							keyExtractor={(item) => item.key}
							renderItem={({ item, i }) => {
								if (item.from_member === subs_id) {
									return (
										<View
											style={{
												flexDirection: 'column',
												width: '60%',
												alignSelf: 'flex-end',
											}}
											key={i}>
											<View
												style={{
													backgroundColor: '#4285f4',
													padding: 8,
													margin: 5,
													borderRadius: 10,
													flexDirection: 'row',
													justifyContent: 'space-between',
													flex: 1,
												}}>
												<View style={{ flexDirection: 'column', padding: 5, flex: 1 }}>
													{/* <Text style={{ color: '#FFF', textAlign: 'left' }}>{item.from_member}</Text> */}
													<Text style={{ color: '#FFF', textAlign: 'left' }}>You</Text>
													<Text style={{ color: '#FFF', textAlign: 'left' }}>{item.message}</Text>
													<Text style={{ color: '#FFF', textAlign: 'right' }}>{item.time}</Text>
												</View>
											</View>
										</View>
									);
								} else {
									return (
										<View
											style={{
												flexDirection: 'column',
												width: '60%',
												alignSelf: 'flex-start',
											}}>
											<View
												style={{
													backgroundColor: '#FFF',
													padding: 10,
													margin: 5,
													borderRadius: 10,
													flexDirection: 'row',
													flex: 1,
												}}>
												<View style={{ flexDirection: 'column', paddingLeft: 15, flex: 1 }}>
													{/* <Text>{item.to_member}</Text> */}
													<Text>Admin</Text>
													<Text>{item.message}</Text>
													<Text style={{ textAlign: 'right' }}>{item.time}</Text>
												</View>
											</View>
										</View>
									);
								}
							}}
						/>
					</View>

					<KeyboardAvoidingView
						behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
						style={{
							flex: 0.07,
							width: '100%',
							flexDirection: 'row',
							justifyContent: 'space-between',
							bottom: 0,
							backgroundColor: '#ebebeb',
							padding: 5,
							paddingLeft: 10,
							paddingRight: 10,
						}}>
						<View
							style={{
								flex: 0.9,
								flexDirection: 'row',
							}}>
							<TextInput
								style={styles.textInput}
								placeholder="Type Text Message Here"
								onChangeText={(message) => this.setState({ message })}
								value={this.state.message}
							/>
						</View>

						<FontAwesome size={38} color="#4285f4" name="telegram" onPress={() => this.dosend()} />
					</KeyboardAvoidingView>
				</View>
				{/* </LinearGradient>
				</Content> */}
			</Container>
		);
	}

	dosend = () => {
		if (this.state.message != '') {
			const url = global.ACCESS.BASE_URL + 'pushReply';
			// console.log(savedID, url);
			fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					credentials: 'same-origin',
				},
				body: JSON.stringify({
					note_id: this.state.note_id,
					from_id: this.state.subs_id,
					message: this.state.message,
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					console.log(res);
					this.setState({
						message: '',
					});
					this.getData();
				})
				.catch((error) => {
					console.log(error);
					//this.setState({ visible: false });
				});
		}
	};
}

const styles = StyleSheet.create({
	textInput: {
		flex: 1,
		padding: 0,
		paddingLeft: 20,
		backgroundColor: '#D5D8DC',
	},
});
