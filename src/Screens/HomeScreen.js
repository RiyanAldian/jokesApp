/* eslint-disable react/no-unstable-nested-components */
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, Text} from '@rneui/themed';
import {Button} from '@rneui/base';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [top, setTop] = React.useState();
  const [amount, setAmount] = React.useState([]);
  const [jokes, setJokes] = React.useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getCategories();
    }, 2000);
  }, []);

  const setCetegoryStatus = (title, long, addStatus = false) => {
    const newExpanded = expanded.map(item => {
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
    const expandedStatus = newExpanded.find(
      item => item.title === title,
    )?.status;

    if (addStatus === true) {
      getJokes(title, long);
    } else {
      if (expandedStatus === true) {
        getJokes(title, long);
        setTimeout(() => {
          setExpanded(newExpanded);
        }, 500);
      } else {
        console.log('else');
        setExpanded(newExpanded);
      }
    }
  };

  const getCetegoryStatus = title => {
    const newExpanded = expanded.find(item => item.title === title)?.status;
    return newExpanded;
  };

  const getCategories = async () => {
    try {
      const response = await fetch('https://v2.jokeapi.dev/categories');
      const json = await response.json();
      const expand = [];
      const data = [];
      for (let i = 0; i < json.categories.length; i++) {
        expand.push({
          title: json.categories[i],
          status: false,
        });
        data.push({
          title: json.categories[i],
          amount: 2,
        });
      }
      setTop(json.categories[0]);
      setExpanded(expand);
      setCategories(json.categories);
      setAmount(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getJokes = async (category, amount) => {
    try {
      const response = await fetch(
        'https://v2.jokeapi.dev/joke/' +
          category +
          '?type=single&amount=' +
          amount,
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

  const addMoreData = async (title, panjangAmount) => {
    const newAmount = amount.map(item => {
      if (item.title === title) {
        return {
          ...item,
          amount: item.amount + 2,
        };
      }
      return item;
    });
    const dataAmount = newAmount.find(item => item.title === title)?.amount;
    console.log(newAmount, 'newAmount');
    setAmount(newAmount);
    setCetegoryStatus(title, dataAmount, true);
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
          <Text style={styles.h1Style}>JokesApp</Text>

          {categories.map((data, i) => (
            <ListItem.Accordion
              style={{paddingLeft: 5, peddingRight: 5, paddingBottom: 5}}
              key={i}
              content={
                <>
                  <Text style={styles.numbering}>{i + 1} </Text>
                  <ListItem.Content>
                    <ListItem.Title>{data}</ListItem.Title>
                  </ListItem.Content>
                  {top === data && (
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
                        marginHorizontal: 50,
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
                const length = amount.find(item => {
                  if (item.title === data) {
                    return item.amount;
                  }
                });
                setCetegoryStatus(data, length.amount);
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
                    const length = amount.find(item => {
                      if (item.title === data) {
                        return item.amount;
                      }
                    });
                    addMoreData(data, length.amount);
                  }}>
                  {amount.find(item => item.title === data)?.amount !== 6 && (
                    <ListItem.Content style={styles.addMore}>
                      <ListItem.Title style={styles.addMoreText}>
                        Add More data
                      </ListItem.Title>
                    </ListItem.Content>
                  )}
                </TouchableOpacity>
              </ListItem>
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
