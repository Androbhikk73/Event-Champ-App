import React, { Component } from 'react';
import { Platform, PermissionsAndroid, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Content, Footer, FooterTab, Icon, Thumbnail, Textarea } from 'native-base';
import { CardButton } from 'react-native-material-cards';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from './components/Loader';

export default class mySubmission extends Component {
	static navigationOptions = { header: null };
	constructor(props) {
		super(props);
		/* 2. Get the param */
		// const { participantId, eventId } = this.props.route.params;
		this.state = {
			// participant_id: participantId,
			// event_id: eventId,
			isLoading: false,
			filePath: '',
			comment: '',
		};
	}

	componentDidMount() {}

	gotoScreen(screenName) {
		this.props.navigation.navigate(screenName);
	}

	requestCameraPermission = async () => {
		if (Platform.OS === 'android') {
			try {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
					title: 'Camera Permission',
					message: 'App needs camera permission',
				});
				// If CAMERA Permission is granted
				return granted === PermissionsAndroid.RESULTS.GRANTED;
			} catch (err) {
				console.warn(err);
				return false;
			}
		} else return true;
	};

	requestExternalWritePermission = async () => {
		if (Platform.OS === 'android') {
			try {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
					title: 'External Storage Write Permission',
					message: 'App needs write permission',
				});
				// If WRITE_EXTERNAL_STORAGE Permission is granted
				return granted === PermissionsAndroid.RESULTS.GRANTED;
			} catch (err) {
				console.warn(err);
				alert('Write permission err', err);
			}
			return false;
		} else return true;
	};

	captureImage = async (type) => {
		let options = {
			mediaType: type,
			maxWidth: 300,
			maxHeight: 550,
			quality: 1,
			videoQuality: 'low',
			durationLimit: 30, //Video max duration in seconds
			saveToPhotos: true,
		};
		let isCameraPermitted = await this.requestCameraPermission();
		let isStoragePermitted = await this.requestExternalWritePermission();
		if (isCameraPermitted && isStoragePermitted) {
			launchCamera(options, (response) => {
				console.log('Response = ', response);

				if (response.didCancel) {
					alert('User cancelled camera picker');
					return;
				} else if (response.errorCode == 'camera_unavailable') {
					alert('Camera not available on device');
					return;
				} else if (response.errorCode == 'permission') {
					alert('Permission not satisfied');
					return;
				} else if (response.errorCode == 'others') {
					alert(response.errorMessage);
					return;
				}
				// console.log('base64 -> ', response.base64);
				// console.log('uri -> ', response.uri);
				// console.log('width -> ', response.width);
				// console.log('height -> ', response.height);
				// console.log('fileSize -> ', response.fileSize);
				// console.log('type -> ', response.type);
				// console.log('fileName -> ', response.fileName);
				this.setState({
					filePath: response,
				});
			});
		}
	};

	chooseFile = async (type) => {
		let options = {
			mediaType: type,
			maxWidth: 300,
			maxHeight: 550,
			quality: 1,
			path: 'images',
		};
		launchImageLibrary(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				alert('User cancelled camera picker');
				return;
			} else if (response.errorCode == 'camera_unavailable') {
				alert('Camera not available on device');
				return;
			} else if (response.errorCode == 'permission') {
				alert('Permission not satisfied');
				return;
			} else if (response.errorCode == 'others') {
				alert(response.errorMessage);
				return;
			}
			// console.log('base64 -> ', response.base64);
			// console.log('uri -> ', response.uri);
			// console.log('width -> ', response.width);
			// console.log('height -> ', response.height);
			// console.log('fileSize -> ', response.fileSize);
			// console.log('type -> ', response.type);
			// console.log('fileName -> ', response.fileName);
			this.setState({
				filePath: response,
			});
		});
	};

	uploadMedia = async () => {
		const { participantId, eventId } = this.props.route.params;
		const parentID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
		const photoData = this.state.filePath;
		// console.log(photoData);
		if (photoData != '') {
			this.setState({ isLoading: true });
			RNFetchBlob.fetch(
				'POST',
				`${ACCESS.BASE_URL}uploadsubscriptionmedia`,
				{
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data',
				},
				[
					{
						name: 'image',
						filename: photoData.fileName,
						type: photoData.type,
						tmp_name: Platform.OS === 'android' ? photoData.uri : photoData.uri.replace('file://', ''),
						size: photoData.fileSize,
						data: RNFetchBlob.wrap(Platform.OS === 'android' ? photoData.uri : photoData.uri.replace('file://', '')),
						// data: photoData.data,
					},
					{ name: 'event_id', data: eventId },
					{ name: 'participant_id', data: participantId },
					{ name: 'description', data: this.state.comment },
				],
			)
				.then((response) => {
					const status = response.respInfo.status;
					const data = response.json();

					return Promise.all([status, data]);
				})
				.then((responseJson) => {
					// console.log(responseJson);
					if (responseJson[0] == 200) {
						Alert.alert('Success Message !!', responseJson[1].msg, [{ text: 'OK', onPress: () => this.props.navigation.pop() }], { cancelable: false });
						this.setState({ isLoading: false });
					} else {
						Alert.alert('Error Message !!', responseJson[1].msg);
						this.setState({ isLoading: false });
					}
				})
				.catch((err) => {
					console.log(err);
					this.setState({ isLoading: false });
				});
		} else {
			Alert.alert('Error!', 'Please Upload Media');
		}
	};

	myEvent = async () => {
		const savedID = await AsyncStorage.getItem(global.ACCESS.USER_ID);
		if (savedID > 0) {
			this.props.navigation.navigate('myEvent');
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
							<Title style={{ color: '#000000', justifyContent: 'center', alignItems: 'stretch', alignSelf: 'center' }}>EventHome</Title>
						</Body>
						<Right style={{ flex: 0.2, paddingRight: 2 }}>
							<Thumbnail small source={{ uri: global.coreURL + 'upload/raj.jpg' }} />
						</Right>
					</ImageBackground>
				</Header>

				<Content>
					<LinearGradient colors={['#fccd15', '#f96305']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
						<Text style={[styles.titleText, { color: '#FFF', fontSize: 18 }]}>Upload Media to Submit Yourself</Text>
						<View style={styles.container}>
							<Image source={{ uri: this.state.filePath.uri }} style={{ width: 200, height: 200 }} />
							{/* <Text style={styles.textStyle}>{this.state.filePath.uri}</Text> */}
							<View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
								<TouchableOpacity activeOpacity={0.5} style={styles.buttonStyle} onPress={() => this.captureImage('photo')}>
									<Text style={styles.textStyle}>Launch Camera for Image</Text>
								</TouchableOpacity>
								<TouchableOpacity activeOpacity={0.5} style={styles.buttonStyle} onPress={() => this.captureImage('video')}>
									<Text style={styles.textStyle}>Launch Camera for Video</Text>
								</TouchableOpacity>
								<TouchableOpacity activeOpacity={0.5} style={styles.buttonStyle} onPress={() => this.chooseFile('photo')}>
									<Text style={styles.textStyle}>Choose Image</Text>
								</TouchableOpacity>
								<TouchableOpacity activeOpacity={0.5} style={styles.buttonStyle} onPress={() => this.chooseFile('video')}>
									<Text style={styles.textStyle}>Choose Video</Text>
								</TouchableOpacity>
							</View>
							<View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
								<Textarea rowSpan={5} bordered placeholder="Comment" onChangeText={(comment) => this.setState({ comment })} />
							</View>
							<View style={{ padding: 5, paddingLeft: 40, paddingRight: 45 }}>
								<CardButton
									onPress={() => this.uploadMedia()}
									title="Submit Media"
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
				<Loader modalVisible={isLoading} animationType="fade" />
			</Container>
		);
	}
}
var styles = StyleSheet.create({
	buttonStyle: {
		padding: 8,
	},
});
