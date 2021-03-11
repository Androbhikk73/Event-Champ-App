import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ImageBackground, FlatList } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Subtitle, Button, Content, Footer, FooterTab, Icon, Thumbnail } from 'native-base';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';

export default class eventDetail extends Component {
	static navigationOptions = { header: null };
	constructor(props) {
		super(props);
		/* 2. Get the param */
		const { eventId } = this.props.route.params;
		this.state = {
			event_id: eventId,
			isLoading: true,
		};
	}

	subscribe = async () => {
		const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
		if (savedID > 0) {
			this.props.navigation.navigate('participant', { eventId: this.state.event_id });
		} else {
			this.props.navigation.navigate('login');
		}
	};

	render() {
		return (
			<Container>
				<Header style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<ImageBackground source={require('../assets/images/header.png')} style={{ width: '100%', flexDirection: 'row' }}>
						<Left style={{ flex: 0.2 }}>
							<Button
								transparent
								onPress={() => {
									this.props.navigation.navigate('eventHome');
								}}>
								<Icon type="FontAwesome" name="reply" style={{ color: 'green' }} />
							</Button>
						</Left>
						<Body style={{ flex: 0.6, alignItem: 'center' }}>
							<Title style={{ color: '#000000', justifyContent: 'center', alignItems: 'stretch', alignSelf: 'center' }}>EventHome</Title>
						</Body>
						<Right style={{ flex: 0.2, paddingRight: 2 }}>
							<Thumbnail small source={{ uri: global.coreURL + 'upload/raj.jpg' }} />
							{/* <Button
								danger
								onPress={async () => {
									const keys = [ACCESS.USER_ID, ACCESS.USER_DETAIL];
									await AsyncStorage.multiRemove(keys);
								}}>
								<Icon type="FontAwesome" name="reply" style={{ color: 'green' }} />
							</Button> */}
						</Right>
					</ImageBackground>
				</Header>
				<Content>
					<View style={{ height: 500, flexDirection: 'column' }}>
						<WebView source={{ uri: global.ACCESS.CORE_URL + 'events/view/' + this.state.event_id }} style={{ marginTop: 5 }} />
					</View>
				</Content>
				<Footer style={{ backgroundColor: '#FFFFFF', paddingLeft: 0, paddingRight: 0 }}>
					<View style={{ padding: 5, paddingLeft: 10, paddingRight: 15 }}>
						<CardButton
							onPress={() => {
								this.subscribe();
							}}
							title="Subscribe"
							style={{ borderWidth: 3, borderRadius: 10, backgroundColor: '#A7F311', borderColor: '#64CE1F' }}
							titleStyle={{ color: '#7011DC' }}
						/>
					</View>
				</Footer>
			</Container>
		);
	}
}
var styles = StyleSheet.create({});
