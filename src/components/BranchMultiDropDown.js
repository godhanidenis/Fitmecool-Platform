import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const BranchMultiDropDown = ({
  item,
  index,
  cardTitle,
  bottomComponent,
  onDeleteBranch,
  onEditBranch,
  onEditDelShow,
}) => {
  const [show, setShow] = useState(true);
  return (
    <View key={index} style={styles.branchesMainContainer}>
      <View
        style={[
          styles.BranchListHeaderMain,
          {
            borderRadius: show ? 0 : 20,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          },
        ]}>
        <TouchableOpacity
          onPress={() => setShow(!show)}
          style={styles.leftMain}>
          <Icon
            name={show ? 'angle-up' : 'angle-down'}
            size={24}
            color="black"
          />
          <Text style={styles.textBranchName}>{cardTitle}</Text>
        </TouchableOpacity>

        {onEditDelShow && (
          <View style={styles.leftMain}>
            <TouchableOpacity
              onPress={() => onEditBranch(item)}
              style={styles.editPencil}>
              <Icon name="pencil" size={13} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDeleteBranch(item)}
              style={styles.delIcon}>
              <Icon name="trash" size={14} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {show && <View>{bottomComponent}</View>}
    </View>
  );
};

export default BranchMultiDropDown;

const styles = StyleSheet.create({
  branchesMainContainer: {
    borderColor: '#F3F6F6',
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 20,
  },
  leftMain: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  BranchListHeaderMain: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F3F6F6',
  },
  textBranchName: {
    color: '#151827',
    fontWeight: '600',
    fontSize: 14,
  },

  editPencil: {
    backgroundColor: '#151827',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  delIcon: {
    backgroundColor: '#D63848',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
});
