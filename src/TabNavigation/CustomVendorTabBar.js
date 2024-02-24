import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomVendorTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.tabBarContainer}>
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

        const iconColor = isFocused ? '#29977E' : 'grey';

        return (
          !options.unmountOnBlur && (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabBarItem}>
              <Icon name={options.tabBarIconName} size={24} color={iconColor} />
              {options.tabBarLabel && (
                <Text style={{color: iconColor, fontSize: 14}}>
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
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
};

export default CustomVendorTabBar;
