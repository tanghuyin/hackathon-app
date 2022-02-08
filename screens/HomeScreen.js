import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/core';
import * as Location from 'expo-location';
import { useNotification } from '../components/Notification';
import {
  getAuth,
  getDocs,
  collection,
  getFirestore,
  addDoc,
} from '../Firebase';

const HomeScreen = () => {
  const crimeMap = new Map();
  crimeMap.set('Shooting', 1);
  crimeMap.set('Stabbing', 2);
  crimeMap.set('Hit And Run', 3);
  crimeMap.set('Other Emergency', 999);

  const [currentTime, setCurrentTime] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { expoPushToken } = useNotification();

  // add current phone token to the database if not
  useEffect(() => {
    (async () => {
      if (expoPushToken) {
        const db = getFirestore();
        const querySnapShot = await getDocs(collection(db, 'USER'));
        let exist = false;
        querySnapShot.forEach((doc) => {
          if (doc.data().email === getAuth().currentUser?.email) {
            console.log('This user has been registered');
            exist = true;
          }
        });
        if (!exist) {
          try {
            const docRef = await addDoc(collection(db, 'USER'), {
              email: getAuth().currentUser?.email,
              token: expoPushToken,
            });
            console.log('Document written with ID: ', docRef.id);
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        }
      }
    })();
  }, [expoPushToken]);

  // get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    }
  }, [location]);

  useInterval(() => {
    const time = new Date().toLocaleString();
    setCurrentTime(time);
  }, 1000);

  const navigation = useNavigation();

  const handleSignOut = () => {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
            },
          ],
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const mapIterator = (map, cb) => {
    const arr = [];
    map.forEach((value, key) => {
      arr.push(cb(value, key));
    });
    return arr;
  };

  return (
    <View style={styles.container}>
      <Text>Email: {getAuth().currentUser?.email}</Text>
      <Text>{currentTime}</Text>
      <Text>Latitide: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
      <Text style={styles.titleText}>What is happening around you?</Text>
      {mapIterator(crimeMap, (value, key) => {
        return (
          <TouchableOpacity
            key={value}
            onPress={async () => {
              const data = {
                email: getAuth().currentUser?.email,
                category: {
                  id: value,
                  name: key,
                },
                comments: '',
                time: currentTime,
                latitude: latitude,
                longitude: longitude,
              };
              fetch('http://147.182.197.37:3000/case', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((response) => response.json())
                .then((responseJson) => {
                  alert(responseJson.data);
                  console.log(responseJson);
                })
                .catch((err) => {
                  alert(JSON.stringify(err));
                  console.error(err);
                });
            }}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>{key}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  titleText: {
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
