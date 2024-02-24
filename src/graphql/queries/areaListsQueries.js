import {gql} from '@apollo/client';
import client from '../apollo-client';

export const getAreaLists = async () => {
  const results = await client.query({
    query: gql`
      query AreaList {
        areaList {
          area
          pin
        }
      }
    `,
  });

  return results;
};

export const getStateLists = async () => {
  const results = await client.query({
    query: gql`
      query StateList {
        stateList {
          state
        }
      }
    `,
  });

  return results;
};

export const getCityLists = async () => {
  const results = await client.query({
    query: gql`
      query CityList {
        cityList {
          city
        }
      }
    `,
  });

  return results;
};

export const getCityByStateLists = async payload => {
  const results = await client.query({
    query: gql`
      query CityByState($state: String) {
        cityByState(state: $state) {
          city
        }
      }
    `,
    variables: {
      state: payload,
    },
    fetchPolicy: 'no-cache',
  });

  return results;
};

export const getAreaByCityLists = async payload => {
  const results = await client.query({
    query: gql`
      query AreaByCity($city: String) {
        areaByCity(city: $city) {
          pin
          area
        }
      }
    `,
    variables: {
      city: payload,
    },
    fetchPolicy: 'no-cache',
  });

  return results;
};
