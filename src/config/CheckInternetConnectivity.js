import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

export const checkInternetConnectivity = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return isConnected;
};
