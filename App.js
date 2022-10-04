import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, SnapshotViewIOSComponent } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBdfk_fgAv5D5YL3bUzIMDmibxNIZ9zHNY",
  authDomain: "assignment12-8c5c9.firebaseapp.com",
  databaseURL: "https://assignment12-8c5c9-default-rtdb.firebaseio.com",
  projectId: "assignment12-8c5c9",
  storageBucket: "assignment12-8c5c9.appspot.com",
  messagingSenderId: "604421958265",
  appId: "1:604421958265:web:4e0e9d745629165271c2a8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

ref(database, 'items/');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    onValue(ref(database, 'items/'), (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      const dataWithKeys = Object.values(data).map((obj, index) => {
        return { ...obj, key: keys[index] }
      });

      setItems(dataWithKeys);
    })
  }, []);

  const saveItem = () => {
    push(
      ref(database, 'items/'),
      { 'product': product, 'amount': amount });
  }

  const deleteItem = (itemKey) => {
    remove(ref(database, 'items/' + itemKey));
  }

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.textInput}
        placeholder='Product'
        onChangeText={(product) => setProduct(product)}
        value={product}
      />

      <TextInput
        style={styles.textInput}
        placeholder='Amount'
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />

      <Button
        title='Save'
        onPress={saveItem}
      />

      <Text style={styles.text}>
        Shopping list
      </Text>

      <FlatList
        data={items}
        renderItem={({ item }) =>
          <View style={styles.listContainer}>
            <Text style={styles.listText}>{item.product}, {item.amount}</Text>
            <Text style={styles.listDelete} onPress={() => deleteItem(item.key)}> delete</Text>
          </View>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },

  textInput: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 5,
  },

  text: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10
  },

  listText: {
    fontSize: 15
  },

  listDelete: {
    fontSize: 15,
    color: 'blue'
  },

  listContainer: {
    flexDirection: 'row',
    marginBottom: 5
  },

});
