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

    this.state = {
      switched: false,
      IPInput: "",
      IPAddress: "192.168.1.15",
      mode: "...",
      status: "Please make sure you are connected to the system",
    };
  }

  componentDidMount() {
    this.state.switched ? this.setState({ IPAddress: this.state.IPInput }) : this.setState({ IPAddress: "192.168.1.15" })
    
    fetch('http://' + this.state.IPAddress + '/?cmd=info', { timeout: 5000 }).then(  
      function(response) {      
        ToastAndroid.show('Connected', ToastAndroid.SHORT);     
        this.handlePressRefresh();        
      }  
    )
    .catch(function(err) {  
      ToastAndroid.show('Not Connected', ToastAndroid.SHORT);      
    }); 
  }

  toggleSwitch = () => {
    this.setState(prevState => {
      return {
        switched: !prevState.switched 
      };
    });
    this.handlePressRefresh();
  };

  handlePressAutomatic(){
    this.state.switched ? this.setState({ IPAddress: this.state.IPInput }) : this.setState({ IPAddress: "192.168.1.15" })
    
    if(this.state.IPAddress != ''){   
      fetch('http://' + this.state.IPAddress + '/?cmd=auto', { timeout: 5000 })
      this.handlePressRefresh();
    }else{
      ToastAndroid.show('Please enter public IP Address or choose Offline', ToastAndroid.SHORT);            
    }
  }

  handlePressAutoTP(){
    this.state.switched ? this.setState({ IPAddress: this.state.IPInput }) : this.setState({ IPAddress: "192.168.1.15" })
    
    if(this.state.IPAddress != ''){   
      fetch('http://' + this.state.IPAddress + '/?cmd=phase', { timeout: 5000 })
      this.handlePressRefresh();
    }else{
      ToastAndroid.show('Please enter public IP Address or choose Offline', ToastAndroid.SHORT);            
    }
  }

  handlePressIn(){
    this.state.switched ? this.setState({ IPAddress: this.state.IPInput }) : this.setState({ IPAddress: "192.168.1.15" })
    
    if(this.state.IPAddress != ''){
      fetch('http://' + this.state.IPAddress + '/?cmd=on', { timeout: 5000 })    
      this.handlePressRefresh();
    }else{
      ToastAndroid.show('Please enter public IP Address or choose Offline', ToastAndroid.SHORT);            
    }
  }

  handlePressOut(){
    this.state.switched ? this.setState({ IPAddress: this.state.IPInput }) : this.setState({ IPAddress: "192.168.1.15" })
    
    if(this.state.IPAddress != ''){
      fetch('http://' + this.state.IPAddress + '/?cmd=off', { timeout: 5000 })    
      this.handlePressRefresh();
    }else{
      ToastAndroid.show('Please enter public IP Address or choose Offline', ToastAndroid.SHORT);            
    }
  }

  handlePressRefresh(){
    this.state.switched ? this.setState({ IPAddress: this.state.IPInput }) : this.setState({ IPAddress: "192.168.1.15" })
    
    var int_modeLen, str_mode, str_status;

    if(this.state.IPAddress != ''){
      fetch('http://' + this.state.IPAddress + '/?cmd=info', { timeout: 5000 })
      .then(response =>{   
        // Examine the text in the response   
        response.text().then(data => {
          int_modeLen = data.indexOf(',') + 1; //240
          str_mode = data.substring(int_modeLen);
          str_status = data.substring(228,int_modeLen-1);
          this.setState({
            mode: str_mode,
            status: str_status
          })
        })
      })  
      .catch(function(err) {  
        ToastAndroid.show('Not Connected', ToastAndroid.SHORT);      
      }); 
    }else{
      ToastAndroid.show('Please enter public IP Address or choose Offline', ToastAndroid.SHORT);            
    }
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
          <Text style={{ fontSize: 50, color: 'white', top: -10}}> {this.state.mode} </Text>
          <Text style={{ fontSize: 13, color: 'white'}}> {this.state.status} </Text>
        </View>
        {/*  LIGHT BLUE - MODE + STATUS */}  

        {/*  DARK BLUE - OFFLINE/ONLINE + MODE */}  
        <View style={{width: 360, height: 320, backgroundColor: '#10191E'}} >
          {
            this.state.switched &&
              <FormInput 
                style={{ fontSize: 13, color: 'white', width: 150, left: 88, top: 25, textAlign: 'center', padding: 5}} 
                onChangeText={text => this.setState({ IPInput: text})} 
                value={this.state.IPInput} 
                underlineColorAndroid='#fc1b6e'
              />
          }

          <Text style={{ fontSize: 15, color: 'white', left: 92, top: 31}}> OFFLINE </Text>
          <Switch
            onValueChange={this.toggleSwitch} 
            tintColor= '#10191E'
            onTintColor= '#fc1b6e'
            thumbTintColor= 'white'
            style={{ top: 9, left: -157}}
            value={this.state.switched}
            />
          <Text style={{ fontSize: 15.3, color: 'white', left: 208, top: -14.05}}> ONLINE </Text>

          <View style={{width: 180, height: 260, backgroundColor: '#10191E'}}>
            <Button 
              title='AUTOMATIC' 
              buttonStyle={{ width: 130, height: 40, borderRadius: 5, marginTop: 50, marginLeft: 18}} 
              backgroundColor="white" 
              color="#10191E"
              onPress={this.handlePressAutomatic}
              fontWeight="bold"/>
            <Button 
              title='MANUAL-IN' 
              buttonStyle={{ width: 130, height: 40, borderRadius: 5, marginTop: 50, marginLeft: 18}} 
              backgroundColor="white" 
              color="#10191E"
              onPress={this.handlePressIn}
            fontWeight="bold"/>
          </View>
          
          <View style={{width: 180, height: 260, backgroundColor: '#10191E', top: -264, left: 180}}>
            <Button 
              title='AUTO + TP' 
              buttonStyle={{ width: 130, height: 40, borderRadius: 5, marginTop: 54, marginLeft: 2}} 
              backgroundColor="white" 
              color="#10191E"
              onPress={this.handlePressAutoTP}
              fontWeight="bold"/>
            <Button 
              title='MANUAL-OUT' 
              buttonStyle={{ width: 130, height: 40, borderRadius: 5, marginTop: 51, marginLeft: 0}} 
              backgroundColor="white" 
              color="#10191E"
              onPress={this.handlePressOut}
              fontWeight="bold"/>
          </View>
        </View>
        {/*  DARK BLUE - OFFLINE/ONLINE + MODE */}  
      </View>
    );
  }
}
