import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>

          <Text>Pull down to see RefreshControl indicator</Text>

          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>

          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
          <Text>Pull down to see RefreshControl indicator</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
