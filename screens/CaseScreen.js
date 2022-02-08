import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
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
        <Text style={styles.title}>{data.email}</Text>
        <Text style={styles.title}>{data.category.name}</Text>
        <Text style={styles.title}>{data.time}</Text>
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
              <Text>Update</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.title}>{comments}</Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item }) => <Item data={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={caseList}
        renderItem={renderItem}
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
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: '100%',
  },
  title: {
    fontSize: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
});
