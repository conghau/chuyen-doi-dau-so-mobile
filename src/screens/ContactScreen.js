import React from "react";
import {Platform, ScrollView, StyleSheet, View, TouchableOpacity} from "react-native";

import {isEmpty, isUndefined} from "lodash";
import {
  List,
  ListItem,
  SearchBar,
  Card,
  Button,
  Icon,
  Divider,
  CheckBox,
  Header,
  ButtonGroup,
  Text
} from "react-native-elements";
import {convertToNewPhone} from "../helper/Convert";
import {Contacts, Permissions} from 'expo';
import {filter} from 'lodash'
import {width} from '../constants/Layout'

const isIos = Platform.OS === 'ios';

const buttons = ['Xóa', 'Chuyển'];
export default class ContactScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      allContacts: [],
      filterContacts: [],
      keyword: ''
    }
  }

  async componentWillMount() {
    await this.getContact()
  }

  getContact = async () => {
    const {status} = await Permissions.askAsync(Permissions.CONTACTS);
    if (status === 'granted') {
      // const {data} = await Contacts.getContactsAsync({
      //   fields: [
      //     Contacts.PHONE_NUMBERS,
      //     Contacts.EMAILS,
      //   ],
      // });
      const {data} = await Contacts.getContactsAsync();
      if (data.length > 0) {
        console.log(data);
        this.setState({contacts: data, filterContacts: data});
      }
    } else {
      throw new Error('Location permission not granted');
    }
  };

  filterContact = (keyword) => {
    let {contacts} = this.state;

    let re = new RegExp(keyword);
    const filterContacts = filter(contacts, function (c) {
      return re.test(c.name);
    });

    this.setState({filterContacts});
  };

  _onUpdateContract = async (contactId, phoneNumberId, newPhone) => {
    let {contacts} = this.state;
    let _contactNeedUpdate = filter(contacts, function (c) {
      return c.id === contactId;
    });
    console.log('contactId');
    console.log(contactId);
    _contactNeedUpdate = _contactNeedUpdate[0];
    console.log(_contactNeedUpdate);

    _contactNeedUpdate.phoneNumbers.map((p, i) => {
      if (p.id === phoneNumberId) {
        p.digits = newPhone;
        p.number = newPhone;
      }
    });

    console.log(_contactNeedUpdate);
    // const contact = {
    //   id: "161A368D-D614-4A15-8DC6-665FDBCFAE55",
    //   [Contacts.Fields.FirstName]: "Drake",
    //   [Contacts.Fields.Company]: "Young Money",
    //   [Contacts.Fields.PHONE_NUMBERS]: [{}],
    // };
    await Contacts.updateContactAsync(_contactNeedUpdate);
  };

  renderPhoneNumber = (phoneNumbers, contactId) => {
    if (isEmpty(phoneNumbers) || isUndefined(phoneNumbers)) {
      return null;
    }
    return phoneNumbers.map((l, i) => {
      let oldPhone = l.digits || '';
      let newPhone = convertToNewPhone(oldPhone);
      return (
        ItemRow({oldPhone, newPhone})
        // <Text key={i}>{_old}
        //   <Icon
        //     raised
        //     name='heartbeat'
        //     type='font-awesome'
        //     color='#f50'
        //     size={styles.buttonSmall}
        //     onPress={() => {
        //       this._onUpdateContract(contactId, l.id, _new)
        //     }}/> {_new}
        //
        // </Text>
      )
    })
  };

  renderList = (contacts) => {
    if (isEmpty(contacts)) {
      return <Text>Empty</Text>
    }
    return (
      <List>
        {
          contacts.map((l, i) => {
            return (
              _Card(i, l.name, l.phoneNumbers || [], l.id)

            )
          })
        }
      </List>
    )
  };

  onChange = () => {

  };

  render() {
    const {filterContacts} = this.state;
    return (
      <View style={styles.container}>
        <SearchBar
          onChangeText={this.filterContact}
          onClearText={this.onChange}
          placeholder='Type Here...'/>
        <ScrollView contentContainerStyle={styles.contentContainer} style={{paddingTop: 5}}>
          <TouchableOpacity>
            <Button
              raised
              icon={{name: 'cached'}}
              title='Chuyển tất cả'
              buttonStyle={styles.button}
            />
          </TouchableOpacity>
          {this.renderList(filterContacts)}
        </ScrollView>
      </View>
    );
  }
}

const renderPhoneNumber = (phoneNumbers, contactId) => {
  return phoneNumbers.map((l, i) => {
    let oldPhone = l.digits || '';
    let newPhone = convertToNewPhone(oldPhone);
    return (
      ItemRow({oldPhone, newPhone})
    )
  })
};

const _Card = (index, name, phoneNumbers, id) => {
  return (
    <Card
      key={index}
      title={`${name}`}
      titleNumberOfLines={1}
      containerStyle={{paddingLeft: 10, paddingRight: 10}}
    >
      <View>
        {renderPhoneNumber(phoneNumbers, id)}
      </View>
    </Card>
  )
};

const ItemRow = ({oldPhone, newPhone}) => {
  let w = '50%';
  let w1 = '30%';
  return (
    <Card style={
      {
        flex: 1,
        paddingTop: 0,
        flexDirection: 'column', alignItems: 'stretch',
        justifyContent: 'center',
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        // shadowOffset: { height: 0, width: 0 },
      }

    }
          key={oldPhone}
          containerStyle={{marginLeft: 0, marginRight: 0}}

    >
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: `center`}}>
          <Text>{oldPhone}</Text>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#517fa4'
            containerStyle={{paddingLeft: 3, paddingRight: 3}}
          />

          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{newPhone}</Text>
        </View>
      </View>
      <View style={{height: 30}}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={0}
          buttons={buttons}
          containerStyle={{height: 20}}
        />
      </View>
    </Card>
  );
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  button: {
    backgroundColor: '#d03223'
  },
  buttonSmall: {
    backgroundColor: '#d03223',
  }
});
