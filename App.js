import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

import eventHome from './screen/eventHome';
import eventDetail from './screen/eventDetail';
import login from './screen/login';
import register from './screen/register';
import newparticipant from './screen/newparticipant';
import participant from './screen/participant';
import payment from './screen/payment';
import myEvent from './screen/myEvent';
import mySubmission from './screen/mySubmission';
import updateparticipant from './screen/updateparticipant';
import forgotPassword from './screen/forgotPassword';
import notification from './screen/notification';
import contact from './screen/contact';
import chatDetail from './screen/chatDetail';

// global.eventData = [];
// global.subID = 0; // 1
// global.stripePK = 'pk_test_51HyBYRGZuMnpPMeIsgpIeN9V0I3GOeuOUMy2U4RrBCWG0pLxYbkj1Wg4yBgLOz4zzzZ45z39uFpfJOJKSSmZ0KN000w78pRr7o';
// global.stripeSK = 'sk_test_51HyBYRGZuMnpPMeIsLOGHvNePVFs3qJG0yhEejDdcWVSqk0rVykhDqvBngfbjAR757vWfoyBKsL6KWxMKPnxZFan00rHRxNRAf';

global.ACCESS = {
	DEVICE_TOKEN: '@device_token',
	STORAGE_KEY: '@champ_token',
	USER_ID: '@subID',
	USER_DETAIL: '@champ_info',
	// BASE_URL: 'http://localhost:3000/kousik/EventChamp/Services/',
	BASE_URL: 'https://demo.clematistech.com/eventchamp/Services/',
	// CORE_URL: 'http://localhost:3000/kousik/EventChamp/',
	CORE_URL: 'https://demo.clematistech.com/eventchamp/',
	stripePK: 'pk_test_51HyBYRGZuMnpPMeIsgpIeN9V0I3GOeuOUMy2U4RrBCWG0pLxYbkj1Wg4yBgLOz4zzzZ45z39uFpfJOJKSSmZ0KN000w78pRr7o',
	stripeSK: 'sk_test_51HyBYRGZuMnpPMeIsLOGHvNePVFs3qJG0yhEejDdcWVSqk0rVykhDqvBngfbjAR757vWfoyBKsL6KWxMKPnxZFan00rHRxNRAf',
};

const Stack = createStackNavigator();

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount = () => {
		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			console.log('Message handled in the background!', remoteMessage);
		});

		PushNotification.configure({
			onRegister: (token) => {
				console.log('Token:', token);
				AsyncStorage.setItem(global.ACCESS.DEVICE_TOKEN, token.token);
			},
			onNotification: (notification) => {
				// console.log('Notification: ', notification);

				notification.finish(PushNotificationIOS.FetchResult.NoData);
			},

			// IOS ONLY (optional): default: all - Permissions to register.
			permissions: {
				alert: true,
				badge: true,
				sound: true,
			},
			popInitialNotification: true,
			requestPermissions: true,
		});

		PushNotification.getChannels(function (channel_ids) {
			// console.log(channel_ids); // ['fcm_fallback_notification_channel']
		});
	};

	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
						tabBarVisible: false,
					}}
					initialRouteName="eventHome"
					headerMode="none"
					tabBarVisible="false">
					<Stack.Screen name="eventHome" component={eventHome} tabBarVisible="false" options={{ headerShown: false, tabBarVisible: false }} />
					<Stack.Screen name="eventDetail" component={eventDetail} />
					<Stack.Screen name="login" component={login} />
					<Stack.Screen name="register" component={register} />
					<Stack.Screen name="participant" component={participant} />
					<Stack.Screen name="newparticipant" component={newparticipant} />
					<Stack.Screen name="updateparticipant" component={updateparticipant} />
					<Stack.Screen name="payment" component={payment} />
					<Stack.Screen name="myEvent" component={myEvent} />
					<Stack.Screen name="mySubmission" component={mySubmission} />
					<Stack.Screen name="forgotPassword" component={forgotPassword} />
					<Stack.Screen name="notification" component={notification} />
					<Stack.Screen name="contact" component={contact} />
					<Stack.Screen name="chatDetail" component={chatDetail} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

// export default App;
