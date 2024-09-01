import React, { useEffect, useState } from 'react';
import { Text, FlatList, Image, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { homes } from '../../constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';

const Home = ({ navigation }) => {
  const auth = getAuth();
  const [homesData, setHomesData] = useState([]);

  // Create a mock response using Blob
  const mockResponse = new Response(JSON.stringify(homes), {
    headers: { 'Content-Type': 'application/json' },
  });

  async function fetchData() {
    // Simulate fetch with the mock response
    const response = await mockResponse;
    const data = await response.json();
    console.log(data);
    setHomesData(data);
  }

  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('You need to enable notifications to receive alerts.');
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    return token;
  }
  useEffect(() => {
    registerForPushNotificationsAsync();

    navigation.setOptions({
      headerRight: () => (
        <Button onPress={handleLogout} title="Logout" color="#f4511e" />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchData();
  },[]);

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Detail', { home: item })}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemAddress}>{item.address}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={homesData}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );
};

export default Home;

const styles = StyleSheet.create({
    itemContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    itemImage: {
      width: '100%',
      height: 150,
      borderRadius: 10,
    },
    itemAddress: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 5,
      color: '#333',
    },
    itemDescription: {
      fontSize: 14,
      color: '#666',
    },
  });
