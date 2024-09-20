import React, { useEffect, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomCustomerTabBar = ({state, descriptors, navigation}) => {

   const [currentLoginType, setCurrentLoginType] = useState('');

    const switchLoginType = async () => {
        await AsyncStorage.setItem('loginType', 'vendor');
        navigation.navigate('Splash')
    }

    useEffect(()=>{
    const getCurrentUserType = async () => {
                                    const loginType = await AsyncStorage.getItem('loginType');
                                    setCurrentLoginType(loginType);
                                    };
    getCurrentUserType();
    },[])

  return (
    <View style={styles.tabBarContainer}>
    {currentLoginType && <TouchableOpacity onPress={() => switchLoginType()} style={styles.switchBtn}>
        <Text style={styles.switchBtnText}>Seller</Text>
    </TouchableOpacity>}
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconColor = isFocused ? '#29977E' : '#fff';

        return (
          !options.unmountOnBlur && (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabBarItem}>
              <View style={styles.mainLikeTabDiv}>
                <Icon
                  name={options.tabBarIconName}
                  size={30}
                  color={iconColor}
                />
                {options.tabBarBadgeLikeCount && (
                  <View style={styles.likeCountMain}>
                    <Text style={styles.likeCount}>
                      {options.tabBarBadgeLikeCount}
                    </Text>
                  </View>
                )}
              </View>
              {options.tabBarLabel && (
                <Text style={{color: iconColor, fontSize: 16}}>
                  {options.tabBarLabel}
                </Text>
              )}
            </TouchableOpacity>
          )
        );
      })}
    </View>
  );
};

const styles = {
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#151827',
    position: 'relative', // To allow absolute positioning within the container
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },

  mainLikeTabDiv: {
    position: 'relative',
  },
  likeCountMain: {
    backgroundColor: 'red',
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'absolute',
    left: 16,
    bottom: 10,
  },
  likeCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  switchBtn:{
    backgroundColor:'red',
    borderRadius:50,
    width:90,
    height:90,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    position: 'absolute',
    top: -40, // Adjust to center vertically
    left: '50%', // Horizontally center
    transform: [{ translateX: -40 }], // Adjust to center perfectly
    shadowColor: 'white', // Shadow color
      shadowOffset: {
        width: 0,  // Horizontal shadow offset
        height: 8, // Vertical shadow offset
      },
      shadowOpacity: 0.7,   // Shadow opacity
      shadowRadius: 4,   // Shadow radius
      elevation: 8,         // Elevation for Android
      borderWidth: 2,       // Border width
      borderColor: '#fff',  // Border color
  },
  switchBtnText:{
      fontWeight:'700',
      fontSize:24,
      color:'white'
  }
};

export default CustomCustomerTabBar;
