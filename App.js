import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableWithoutFeedback, Keyboard
 } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Input, Button, ListItem } from 'react-native-elements';


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

const keyExtractor = (item, index) => index.toString();

const renderItem = ( {item} ) => (
  <ListItem
    title={item.name}
    subtitle={item.amount}
    // leftElement={<Text>{item.name}, {item.amount}</Text>}
    rightElement={<Text style={{color: 'grey'}} onPress={() => deleteItem(item.id)}>done</Text>}
    topDivider
    chevron
    containerStyle={styles.listcontainer}
  />
)



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
      <View style={styles.container}>

          <Input
          label='Product'
          placeholder='Product'
          style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
          onChangeText={name => setName(name)}
          value={name} />
          <Input
          label='Amount'
          placeholder='Amount'
          style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
          onChangeText={amount => setAmount(amount)}
          value={amount} />

          <View style={{flexDirection: 'row'}}>
              <Button buttonStyle={{marginVertical: 20}} type="outline"  onPress={saveItem}  title='SAVE' />
          </View>
          <Text style={{color: 'pink', fontWeight: 'bold', fontSize: 20, marginBottom: 20}}>Shopping List</Text>
          <FlatList
            style={{marginLeft : "5%"}}
            keyExtractor={keyExtractor}
            data={list}
            renderItem={renderItem}
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
    width: '90%',
   flexDirection: 'row',
   backgroundColor: 'white',
   alignItems: 'center',
   justifyContent: 'space-evenly'

},
});
