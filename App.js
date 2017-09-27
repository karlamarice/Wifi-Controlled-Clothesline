import React from 'react';
import { FlatList, DrawerLayoutAndroid, Modal, StyleSheet, Switch, ToastAndroid, View } from 'react-native';
import { Button, FormInput, FormLabel, Header, Icon, List, ListItem, Text } from 'react-native-elements';

export default class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.toggleSwitch = this.toggleSwitch.bind(this);    
    this.handlePressAutomatic = this.handlePressAutomatic.bind(this);
    this.handlePressAutoTP = this.handlePressAutoTP.bind(this);
    this.handlePressIn = this.handlePressIn.bind(this);
    this.handlePressOut = this.handlePressOut.bind(this)
    this.handlePressRefresh = this.handlePressRefresh.bind(this)
    this.sendRequest = this.sendRequest.bind(this);
    this.getRequest = this.getRequest.bind(this);

    this.state = {
      switched: false,
      IPInput: "",
      IPOffline: "192.168.1.15",
      settings: "...",
      selectedSetting: "",
      status: "Please make sure you are connected to the system"
    };
  }

  toggleSwitch = () => {
    this.setState(prevState => {
      return {
        switched: !prevState.switched
      };
    });
  };

  handlePressAutomatic(){
      this.setState({
        selectedSetting: "auto"        
      })
      sendRequest();
  }

  handlePressAutoTP(){
    this.setState({
      selectedSetting: "phase"        
    })
    sendRequest();
  }

  handlePressIn(){
    this.setState({
      selectedSetting: "on"        
    })
    sendRequest();
  }

  handlePressOut(){
    this.setState({
      selectedSetting: "off"        
    })
    sendRequest();
  }

  handlePressRefresh(){
    this.setState({
      selectedSetting: "info"        
    })
    sendRequest();
  }

  sendRequest(){
    {/*
      if(switched == false){
        go to "http://"+IPOffline+"/?cmd="+selectedSetting
        get response
        getRequest();        
      }
    */}
  }

  getRequest(){
    {/*
      check if response length is greater than 227
      // start sa 228 hanggang sa index ng comma
      // yung 228 ay fixed length ng http code button kaya ang susunod na index ay yung first character ng status
      this.setState({
        settings: 
        status:
      })
    */}
  }

  render() {
    return (
      <View>
        {/*  DARK BLUE - HEADER TITLE + REFRESH ICON */}
        <View style={{width: 360, height: 80, backgroundColor: '#10191E'}} >
          <Text style={{ fontSize: 23, color: 'white', top: 43, left: 10}}> Wifi Controlled Clothesline </Text>
          <Icon 
            name='refresh' 
            color= 'white' 
            size={25} 
            style={{left: 320, top: 17}}
            onPress={this.handlePressRefresh}
          />
        </View>
        {/*  DARK BLUE - HEADER TITLE + REFRESH ICON */}

        {/*  LIGHT BLUE - MODE + STATUS */}     
        <View style={{width: 360, height: 240, backgroundColor: '#1D2733', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ fontSize: 50, color: 'white', top: -10}}> {this.state.settings} </Text>
          <Text style={{ fontSize: 15, color: 'white'}}> {this.state.status} </Text>
        </View>
        {/*  LIGHT BLUE - MODE + STATUS */}  

        {/*  DARK BLUE - OFFLINE/ONLINE + MODE */}  
        <View style={{width: 360, height: 320, backgroundColor: '#10191E'}} >
          {
            this.state.switched &&
              <FormInput 
                style={{ fontSize: 15, color: 'white', width: 100, left: 115, top: 10, textAlign: 'center'}} 
                onChangeText={text => this.setState({ IPInput: text})} 
                value={this.state.IPInput} 
                underlineColorAndroid='#fc1b6e'
              />
          }
          <Text style={{ fontSize: 15, color: 'white', left: 105, top: 28}}> Offline </Text>
          <Switch
            onValueChange={this.toggleSwitch} 
            tintColor= '#10191E'
            onTintColor= '#fc1b6e'
            thumbTintColor= 'white'
            style={{ top: 5, left: -155}}
            value={this.state.switched}
          />
          <Text style={{ fontSize: 15.3, color: 'white', left: 213, top: -18}}> Online </Text>

          <View style={{width: 180, height: 260, backgroundColor: '#10191E'}}>
            <Button 
              title='AUTOMATIC' 
              buttonStyle={{ width: 130, height: 40, borderRadius: 5, marginTop: 50, marginLeft: 15}} 
              backgroundColor="white" 
              color="#10191E"
              onPress={this.handlePressAutomatic}
            />
            <Button 
              title='MANUAL-IN' 
              buttonStyle={{ width: 130, height: 40, borderRadius: 5, marginTop: 50, marginLeft: 15}} 
              backgroundColor="white" 
              color="#10191E"
              onPress={this.handlePressIn}
            />
          </View>
          
          <View style={{width: 180, height: 260, backgroundColor: '#10191E', top: -264, left: 180}}>
            <Button 
              title='AUTO + TP' 
              buttonStyle={{ width: 130, height: 40, borderRadius: 5, marginTop: 54, marginLeft: 5}} 
              backgroundColor="white" 
              color="#10191E"
              onPress={this.handlePressAutoTP}
            />
            <Button 
              title='MANUAL-OUT' 
              buttonStyle={{ width: 130, height: 40, borderRadius: 5, marginTop: 50, marginLeft: 5}} 
              backgroundColor="white" 
              color="#10191E"
              onPress={this.handlePressOut}
            />
          </View>
        </View>
        {/*  DARK BLUE - OFFLINE/ONLINE + MODE */}  
      </View>
    );
  }
}          
