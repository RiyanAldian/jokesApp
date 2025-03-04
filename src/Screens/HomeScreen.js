import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, Text} from '@rneui/themed';
import {Icon, Button} from '@rneui/base';
// import Modal from 'react-native-modal';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [jokes, setJokes] = React.useState([]);

  const [expanded, setExpanded] = useState([]);

  const [isModalVisible, setisModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getCategories();
    }, 2000);
  }, []);

  const setCetegoryStatus = (title, status) => {
    const newExpanded1 = expanded.find(item => item.title === title)?.status;
    const newExpanded = expanded.map(item => {
      if (item.title === title) {
        return {
          ...item,
          status: !item.status ? true : false,
        };
      }
      return item;
    });
    setExpanded(newExpanded);
  };

  const getCetegoryStatus = title => {
    const newExpanded = expanded.find(item => item.title === title)?.status;
    console.log(newExpanded, 'getCetegoryStatus');
    return newExpanded;
  };

  const getCategories = async () => {
    try {
      const response = await fetch('https://v2.jokeapi.dev/categories');
      const json = await response.json();
      const expand = [];
      for (let i = 0; i < json.categories.length; i++) {
        expand.push({
          title: json.categories[i],
          status: false,
        });
      }
      setExpanded(expand);
      setCategories(json.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const getJokes = async category => {
    try {
      const response = await fetch(
        'https://v2.jokeapi.dev/joke/' + category + '?type=single&amount=2',
      );
      const json = await response.json();
      const list = [];
      for (let i = 0; i < json.jokes.length; i++) {
        list.push(json.jokes[i].joke);
      }
      setJokes(list);
    } catch (error) {
      console.error(error);
    }
  };

  const CustomModal = ({visible, onClose}) => {
    return (
      <Modal transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Ini Modal!</Text>
            <Button title="Tutup" onPress={onClose} />
          </View>
        </View>
      </Modal>
    );
  };

  const addMoreData = async () => {
    console.log('Add more data');
    console.log(categories, 'categories');
  };

  useEffect(() => {
    getCategories();
  }, []);

  const modalChild = data => {
    Alert.alert(data);
  };

  return (
    <SafeAreaProvider>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <SafeAreaView style={styles.container}>
          <Text style={styles.h1Style}>JokesApp</Text>

          {categories.map((data, i) => (
            <ListItem.Accordion
              style={{paddingLeft: 5, peddingRight: 5, paddingBottom: 5}}
              key={i}
              content={
                <>
                  <Text style={styles.numbering}>{i + 1} </Text>

                  <ListItem.Content>
                    <ListItem.Title> {data}</ListItem.Title>
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
                    onPress={() => {
                      console.log('aye');
                    }}
                  />
                </>
              }
              isExpanded={getCetegoryStatus(data)}
              onPress={() => {
                setCetegoryStatus(data);
                getJokes(data);
              }}>
              {jokes.map((l, i) => (
                <ListItem
                  style={{paddingLeft: 10, paddingRight: 5}}
                  key={i}
                  bottomDivider>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      modalChild(l);
                    }}>
                    <ListItem.Content>
                      <ListItem.Title>{l}</ListItem.Title>
                    </ListItem.Content>
                  </TouchableOpacity>
                </ListItem>
              ))}
              <ListItem
                style={{paddingLeft: 10, paddingRight: 5, paddingBottom: 10}}>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={() => {
                    addMoreData();
                  }}>
                  <ListItem.Content style={styles.addMore}>
                    <ListItem.Title style={styles.addMoreText}>
                      Add More data
                    </ListItem.Title>
                  </ListItem.Content>
                </TouchableOpacity>
              </ListItem>
            </ListItem.Accordion>
          ))}
        </SafeAreaView>
      </ScrollView>
      <CustomModal visible={modalVisible} onClose={hideModal} />
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
  addMore: {
    backgroundColor: 'rgba(111, 202, 186, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  addMoreText: {
    fontSize: 20,
    color: 'white',
  },
  //   scrollView: {
  //     flex: 1,
  //     backgroundColor: 'pink',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
});
