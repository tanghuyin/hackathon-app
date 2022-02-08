import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  getAuth,
  getDocs,
  collection,
  getFirestore,
  setDoc,
  doc,
} from '../Firebase';

export const CaseScreen = () => {
  const [refreshing, setRefreshing] = useState(true);
  const [caseList, setCaseList] = useState([]);
  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  const loadData = async () => {
    console.log('Loading data');
    const db = getFirestore();
    const querySnapShot = await getDocs(collection(db, 'CASE'));
    const list = [];
    querySnapShot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setCaseList(list);
    setRefreshing(false);
  };

  const Item = ({ data }) => {
    const db = getFirestore();
    const [text, onChangeText] = useState(data.comments);
    return (
      <View style={styles.item}>
        <Text style={styles.title}>Reporter: {data.email}</Text>
        <Text style={styles.title}>Case Type: {data.category.name}</Text>
        <Text style={styles.title}>Time: {data.time}</Text>
        {getAuth().currentUser?.email === data.email ? (
          <View>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
            />
            <TouchableOpacity
              key={data.id}
              onPress={async () => {
                data.comments = text;
                fetch('http://147.182.197.37:3000/case', {
                  method: 'PUT',
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
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.title}>Comments: {comments}</Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item }) => <Item data={item} />;

  const handleEmpty = () => {
    return <Text style={styles.title}> No Case present!</Text>;
  };

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={1}
        data={caseList}
        renderItem={renderItem}
        ListEmptyComponent={handleEmpty}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: Dimensions.get('screen').width - 10,
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
  },
  input: {
    height: 30,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});
