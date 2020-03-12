import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableWithoutFeedback, Keyboard
 } from 'react-native';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('itemdb.db');

export default function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const [amount, setAmount] = useState('');



  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists list (id integer primary key not null, name text, amount text);');
    });
    updateList();
  }, []);


// Save item to database
const saveItem = () => {
  db.transaction(tx => {
      tx.executeSql('insert into list (name, amount) values (?, ?);',
      [name, amount]);
    }, null, updateList
  );
  console.log(list);
}

//Update itemList
const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from list;', [], (_, { rows }) =>
      setList(rows._array)
    );
  });
  console.log(list);
};

//Delete item
const deleteItem = (id) => {
  db.transaction(
    tx => {
      tx.executeSql(`delete from list where id = ?;`, [id]);
    }, null, updateList
  )
}

const listSeparator = () => {
  return (
    <View
      style={{
        height: 5,
        width: "80%",
        backgroundColor: "#fff",
        marginLeft: "10%"
      }}
    />
  );
};



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
      <View style={styles.container}>

          <TextInput
          placeholder='Product'
          style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
          onChangeText={name => setName(name)}
          value={name} />
          <TextInput
          placeholder='Amount'
          style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
          onChangeText={amount => setAmount(amount)}
          value={amount} />

          <View style={{flexDirection: 'row'}}>
              <Button  onPress={saveItem}  title='Add' />
          </View>
          <Text style={{color: 'pink', fontWeight: 'bold', fontSize: 20}}>Shopping List</Text>
          <FlatList
            style={{marginLeft : "5%"}}
            keyExtractor={item => item.id.toString()}

            renderItem={({item}) => <View style={styles.listcontainer}>
            <Text style={{fontSize: 18}}>{item.name}, {item.amount}  </Text>
            <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}>Bought</Text>
            </View>}

            data={list}
            ItemSeparatorComponent={listSeparator}
          />

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 300
  },
  listcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
},
});
