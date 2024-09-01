import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

const Detail = ({ route, navigation }) => {
  const { home } = route.params;
  const [isWithinRange, setIsWithinRange] = useState(false);

  useEffect(() => {
    checkProximity();

    navigation.setOptions({
      title: home.address, 
    });
  }, []);

  const checkProximity = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const distance = getDistance(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      { latitude: home.latitude, longitude: home.longitude }
    );

    setIsWithinRange(distance <= 30); 
  };

  const getDistance = (loc1, loc2) => {
    const R = 6371e3; 
    const latitudeRadians1 = (loc1.latitude * Math.PI) / 180;
    const latitudeRadians2 = (loc2.latitude * Math.PI) / 180;
    const deltaLatitudeRadians = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const deltaLongitudeRadians = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLatitudeRadians / 2) * Math.sin(deltaLatitudeRadians / 2) +
      Math.cos(latitudeRadians1) * Math.cos(latitudeRadians2) * Math.sin(deltaLongitudeRadians / 2) * Math.sin(deltaLongitudeRadians / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleUnlock = async () => {
    try {
      // const response = await fetch('https://mockapi.io/unlock', {
      //   method: 'POST',
      // });
      if (true) {
        Alert.alert('Success', 'The home has been unlocked!');
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Home Unlocked!!!',
            body: 'You have successfully unlocked the home!',
          },
          trigger: null, // Send immediately
        });
      } else {
        Alert.alert('Error', 'Failed to unlock the home.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while unlocking the home.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: home.image }} style={styles.image} />
      <Text style={styles.address}>{home.address}</Text>
      <Text style={styles.description}>{home.description}</Text>
      <TouchableOpacity
        style={[styles.unlockButton, isWithinRange && styles.disabledButton]}
        onPress={handleUnlock}
        disabled={isWithinRange}
      >
        <Text style={styles.unlockButtonText}>Unlock</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  address: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  unlockButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
});
