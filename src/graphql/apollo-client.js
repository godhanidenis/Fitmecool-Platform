import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import appConfig from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

const httpLink = createHttpLink({
  uri: `${appConfig.appUrl}`,
});

const authLink = setContext(async (_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem('token');
  // const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const handleNavigation = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.navigate('LoginMainScreen');
  }, []);
};

const errorLink = onError(({graphQLErrors, networkError}) => {
  // const navigation = useNavigation();

  if (graphQLErrors) {
    graphQLErrors.forEach(async ({message}) => {
      if (message === 'Invalid/Expired token') {
        await AsyncStorage.clear();
        // navigation.navigate('LoginMainScreen');
        handleNavigation();
        alert('User Logout Successfully!!');
      }
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
