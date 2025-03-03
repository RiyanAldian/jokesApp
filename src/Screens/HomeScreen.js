import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, Text} from '@rneui/themed';
import {Icon, Button} from '@rneui/base';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [expanded, setExpanded] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaProvider>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <SafeAreaView style={styles.container}>
          <Text style={styles.h1Style}>JokesApp</Text>
          <ListItem.Accordion
            content={
              <>
                {/* <Icon name="place" size={30} /> */}
                <Text style={styles.numbering}>1. </Text>

                <ListItem.Content>
                  <ListItem.Title>List Accordion</ListItem.Title>
                </ListItem.Content>
                <Button
                  title="TOP"
                  loading={false}
                  loadingProps={{size: 'small', color: 'white'}}
                  buttonStyle={{
                    backgroundColor: 'rgba(111, 202, 186, 1)',
                    borderRadius: 5,
                  }}
                  titleStyle={{fontWeight: 'bold', fontSize: 16}}
                  containerStyle={{
                    marginHorizontal: 50,
                    height: 40,
                    width: 80,
                    marginVertical: 10,
                  }}
                  onPress={() => console.log('aye')}
                />
              </>
            }
            isExpanded={expanded}
            onPress={() => {
              setExpanded(!expanded);
            }}>
            {/* {list2.map((l, i) => (
              <ListItem key={i} onPress={log} bottomDivider>
                <Avatar title={l.name[0]} source={{uri: l.avatar_url}} />
                <ListItem.Content>
                  <ListItem.Title>{l.name}</ListItem.Title>
                  <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
             */}
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Item 1</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Item 2</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </ListItem.Accordion>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  h1Style: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
  },
  numbering: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '1000',
    fontSize: 18,
  },
  //   scrollView: {
  //     flex: 1,
  //     backgroundColor: 'pink',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
});
