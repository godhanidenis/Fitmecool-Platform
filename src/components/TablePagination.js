import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TablePagination = ({
  totalItems,
  itemsPerPage,
  onPageChange,
  numOfPages,
}) => {
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  const totalPages = numOfPages;
  const [currentPage, setCurrentPage] = useState(1);
  console.log('currentPage', currentPage);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage]);

  const handlePageClick = page => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const paginationItems = [];
    const maxDisplayPages = 3;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxDisplayPages) {
      if (currentPage <= Math.floor(maxDisplayPages / 2) + 1) {
        endPage = maxDisplayPages;
      } else if (currentPage >= totalPages - Math.floor(maxDisplayPages / 2)) {
        startPage = totalPages - maxDisplayPages + 1;
      } else {
        startPage = currentPage - Math.floor(maxDisplayPages / 2);
        endPage = currentPage + Math.floor(maxDisplayPages / 2);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      paginationItems.push(
        <TouchableOpacity
          key={page}
          onPress={() => handlePageClick(page)}
          style={[
            currentPage === page
              ? paginationStyles.currPageStyleMain
              : paginationStyles.unSelPageStyleMain,
          ]}>
          <Text
            style={[
              currentPage === page
                ? paginationStyles.currPageStyle
                : paginationStyles.unSelPageStyle,
            ]}>
            {page}
          </Text>
        </TouchableOpacity>,
      );
    }

    if (startPage > 1) {
      paginationItems.unshift(
        <Text style={paginationStyles.dotStale} key="ellipsis1">
          {'...'}
        </Text>,
      );
      paginationItems.unshift(
        <TouchableOpacity key="first-page" onPress={() => handlePageClick(1)}>
          <Text style={paginationStyles.oneTotalTExt}>1</Text>
        </TouchableOpacity>,
      );
      paginationItems.unshift(
        <TouchableOpacity
          style={paginationStyles.leftAngle}
          key="left-arrow"
          onPress={() => handlePageClick(currentPage - 1)}>
          <Icon name="angle-left" size={26} color="black" />
        </TouchableOpacity>,
      );
    } else {
      paginationItems.unshift(
        <TouchableOpacity
          disabled={currentPage === 1 ? true : false}
          style={[
            paginationStyles.leftAngle,
            {opacity: currentPage === 1 ? 0.5 : 1},
          ]}
          key="left-arrow"
          onPress={() => handlePageClick(currentPage - 1)}>
          <Icon name="angle-left" size={26} color="black" />
        </TouchableOpacity>,
      );
    }

    if (endPage < totalPages) {
      paginationItems.push(
        <Text style={paginationStyles.dotStale} key="ellipsis2">
          {'...'}
        </Text>,
      );
      paginationItems.push(
        <TouchableOpacity
          key="last-page"
          onPress={() => handlePageClick(totalPages)}>
          <Text style={paginationStyles.oneTotalTExt}>{totalPages}</Text>
        </TouchableOpacity>,
      );
      paginationItems.push(
        <TouchableOpacity
          style={paginationStyles.rightAngle}
          key="right-arrow"
          onPress={() => handlePageClick(currentPage + 1)}>
          <Icon name="angle-right" size={26} color="black" />
        </TouchableOpacity>,
      );
    } else {
      paginationItems.push(
        <TouchableOpacity
          disabled={totalPages === currentPage ? true : false}
          style={[
            paginationStyles.rightAngle,
            {opacity: totalPages === currentPage ? 0.5 : 1},
          ]}
          key="right-arrow"
          onPress={() => handlePageClick(currentPage + 1)}>
          <Icon name="angle-right" size={26} color="black" />
        </TouchableOpacity>,
      );
    }

    return paginationItems;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {renderPagination()}
    </View>
  );
};

export default TablePagination;

const paginationStyles = StyleSheet.create({
  rightAngle: {
    marginLeft: 25,
  },
  leftAngle: {
    marginRight: 25,
  },
  oneTotalTExt: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
  },

  dotStale: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  currPageStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  unSelPageStyle: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  currPageStyleMain: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#151827',
  },
  unSelPageStyleMain: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
});
