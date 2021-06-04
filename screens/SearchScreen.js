import React from 'react';
import { Text, View, FlatList } from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import db from '../config';   

export default class Searchscreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      allTransctions: [],
      lastVisibleTransaction: null
    }
  }

  componentDidMount=async ()=>{
    const query = await db.collection("transactions").limit(10).get()
    query.docs.map((doc)=>{
      this.setState({
        allTransctions: [...this.state.allTransctions, doc.data()],
        lastVisibleTransaction: doc
      })
    })
  }

  fetchMoreTransactions=async()=>{
    const query = await db.collection("transactions")
    .startAfter(this.state.lastVisibleTransaction).limit(10).get()
    query.docs.map((doc)=>{
      this.setState({
        allTransctions: [...this.state.allTransctions, doc.data()],
        lastVisibleTransaction: doc                                                                                           
      })
    })
  }

  render() {
    return (
      <FlatList
      data = {this.state.allTransctions}
      renderItem={({item})=>(
        <View style = {{borderBottomWidth: 2}}>
          <Text>{"Book Id: " + item.bookId}</Text>
          <Text>{"Student Id: " + item.studentId}</Text>
          <Text>{"Transaction Type: " + item.transactionType}</Text>
          <Text>{"Date: " + item.date.toDate()}</Text>
        </View>
      )} 
      keyExtractor = {(item, index)=> index.toString()}
      onEndReached = {this.fetchMoreTransactions}
      onEndReachedThreshold={0.7}
      />  
    );
  }
}