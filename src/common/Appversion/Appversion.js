import firestore from '@react-native-firebase/firestore';
import {appVersionUpdate} from '../../graphql/mutations/appVersionMutation';

// export const fetchDataFromFirestore = async () => {
//   try {
//     const querySnapshot = await firestore().collection('versions').get();
//     const data = [];
//     querySnapshot.forEach(documentSnapshot => {
//       data.push({
//         id: documentSnapshot.id,
//         ...documentSnapshot.data(),
//       });
//     });
//     return data[0];
//   } catch (error) {
//     console.error('Error fetching data: ', error);
//   }
// };

export const updateVersionData = async (currVersion, docId) => {
  const updatedData = {
    version: currVersion,
    message: 'New Features Added',
  };
  await appVersionUpdate(updatedData).then(res => console.log('ressss', res));

  //   try {
  //     await firestore()
  //       .collection('versions')
  //       .doc(docId) // Replace with the ID of the document you want to update
  //       .update(updatedData);

  //     console.log('Data updated successfully');
  //     fetchDataFromFirestore();
  //   } catch (error) {
  //     console.error('Error updating data: ', error);
  //   }
};
