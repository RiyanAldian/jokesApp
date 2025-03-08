/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, Text, Overlay} from '@rneui/themed';
import {Button} from '@rneui/base';

const HomeScreen = () => {
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);

  const [top, setTop] = useState();
  const [jokes, setJokes] = useState([]);
  const [dataActive, setDataActive] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getCategories();
    }, 2000);
  }, []);

  const setCetegoryStatus = title => {
    const newJokes = jokes.map(item => {
      if (item.title === title) {
        return {
          ...item,
          status: !item.status ? true : false,
        };
      } else {
        return {
          ...item,
          status: false,
        };
      }
    });
    setJokes(newJokes);
  };

  const getCetegoryStatus = title => {
    const newExpanded = jokes.find(item => item.title === title)?.status;
    return newExpanded;
  };

  const getCategories = async () => {
    try {
      const response = await fetch('https://v2.jokeapi.dev/categories');
      const json = await response.json();
      const category = [];
      const jokesData = [];
      for (let i = 0; i < json.categories.length; i++) {
        const joke = await getData(json.categories[i], 1);
        category.push(json.categories[i]);
        jokesData.push(joke);
      }
      setTop(json.categories[0]);
      setCategories(category);
      setJokes(jokesData);
      setVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  async function getData(category, panjangAmount) {
    var url =
      'https://v2.jokeapi.dev/joke/' + category + '?type=single&amount=2';
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      const datajok = {
        title: category,
        status: false,
        amount: 0,
        data: data.message,
      };
      return datajok;
    } else {
      const joke = [];
      for (let i = 0; i < data.jokes.length; i++) {
        joke.push(data.jokes[i].joke);
      }
      const datajok = {
        title: category,
        status: false,
        amount: panjangAmount,
        data: joke,
      };
      return datajok;
    }
  }

  const addMoreData = async (title, panjangAmount) => {
    const moreData = await getData(title, panjangAmount + 1);

    const newJokes = jokes.map(item => {
      if (item.title === title) {
        const dataJokes = item.data;
        return {
          ...item,
          amount: panjangAmount + 1,
          data: dataJokes.concat(moreData.data),
        };
      } else {
        return {
          ...item,
        };
      }
    });
    const newActive = newJokes.find(item => item.title === title)?.data;
    setDataActive(newActive);
    setJokes(newJokes);
  };

  const GoTop = title => {
    var category = categories;
    var index = category.indexOf(title);
    if (index > -1) {
      category.splice(index, 1);
      category.unshift(title);
    }
    setCategories(category);
    setTop(title);
  };

  useEffect(() => {
    setVisible(true);
    getCategories();
  }, []);

  const modalChild = data => {
    Alert.alert('', data, [{text: 'OK'}]);
  };

  return (
    <SafeAreaProvider>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <SafeAreaView style={styles.container}>
          <Text style={styles.headerTitle}>JokesApp</Text>
          <Overlay isVisible={visible}>
            <View style={{padding: 20, alignItems: 'center'}}>
              <ActivityIndicator size="large" color="blue" />
              <Text style={{marginTop: 10}}>Loading...</Text>
            </View>
          </Overlay>
          {categories.map((data, i) => (
            <ListItem.Accordion
              style={{paddingLeft: 5, peddingRight: 5, paddingBottom: 5}}
              key={i}
              content={
                <>
                  <Text style={styles.numbering}>{i + 1} </Text>
                  <ListItem.Content>
                    <ListItem.Title style={styles.ChildData}>
                      {data}
                    </ListItem.Title>
                  </ListItem.Content>
                  {top === data && (
                    <Button
                      title="TOP"
                      loading={false}
                      loadingProps={{size: 'small', color: 'white'}}
                      buttonStyle={{
                        backgroundColor: 'rgba(111, 202, 186, 1)',
                        borderRadius: 5,
                        flex: 1,
                      }}
                      titleStyle={{fontWeight: 'bold', fontSize: 16}}
                      containerStyle={{
                        marginHorizontal: 20,
                        height: 50,
                        width: 100,
                        marginVertical: 0,
                      }}
                    />
                  )}

                  {top !== data && (
                    <Button
                      title="Go Top"
                      loading={false}
                      loadingProps={{size: 'small', color: 'white'}}
                      buttonStyle={{
                        backgroundColor: 'rgb(235, 80, 60)',
                        borderRadius: 5,
                      }}
                      titleStyle={{fontWeight: 'bold', fontSize: 16}}
                      containerStyle={{
                        marginHorizontal: 20,
                        height: 40,
                        width: 80,
                        marginVertical: 10,
                      }}
                      onPress={() => {
                        GoTop(data);
                      }}
                    />
                  )}
                </>
              }
              isExpanded={getCetegoryStatus(data)}
              onPress={() => {
                const category = jokes.find(item => item.title === data);
                const jokeActive = jokes.find(
                  item => item.title === data,
                )?.data;
                const amountValue = category.amount;
                setDataActive(jokeActive);
                setCetegoryStatus(category.title, amountValue); // Gunakan nilai default jika tidak ditemukan
              }}>
              {Array.isArray(dataActive) ? (
                dataActive.map((l, j) => (
                  <View>
                    <ListItem
                      style={{paddingLeft: 10, paddingRight: 5}}
                      key={j}
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
                  </View>
                ))
              ) : (
                <ListItem
                  style={{paddingLeft: 10, paddingRight: 5, paddingBottom: 10}}
                  bottomDivider>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      modalChild('not Found');
                    }}>
                    <ListItem.Content>
                      <ListItem.Title>{dataActive}</ListItem.Title>
                    </ListItem.Content>
                  </TouchableOpacity>
                </ListItem>
              )}

              {Array.isArray(dataActive) ? (
                <ListItem
                  style={{
                    paddingLeft: 10,
                    paddingRight: 5,
                    paddingBottom: 10,
                  }}>
                  {jokes.find(item => item.title === data)?.amount !== 3 && (
                    <Button
                      mode="contained"
                      style={styles.addMoreText}
                      containerStyle={{
                        flex: 1,
                      }}
                      onPress={() => {
                        const dataok = jokes.find(item => item.title === data);
                        addMoreData(data, dataok.amount);
                      }}>
                      Add More data
                    </Button>
                  )}
                </ListItem>
              ) : (
                <></>
              )}
            </ListItem.Accordion>
          ))}
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
  headerTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
  },
  numbering: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '1000',
    fontSize: 22,
  },
  ChildData: {
    paddingLeft: 8,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '1000',
    fontSize: 22,
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
    width: 700,
  },
});
