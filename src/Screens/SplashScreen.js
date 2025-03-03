// SplashScreen.js
import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Replace Splash with Home after 3 seconds
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
