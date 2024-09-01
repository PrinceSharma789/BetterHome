import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/AuthScreens/Login';
import Home from './screens/MainScreens/Home';
import Detail from './screens/MainScreens/Detail';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View  } from 'react-native';

const Stack = createNativeStackNavigator();
const auth = getAuth();

export default function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        // User is logged out
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const getUser = async () => {
    const _user = await AsyncStorage.getItem('user');
    if (_user) {
      setUser(JSON.parse(_user));
    }
    setLoading(false); 
  }
  useEffect(() => {
    getUser();
  },[])

  if (loading) {
    // Show a loading spinner while checking the user's status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
