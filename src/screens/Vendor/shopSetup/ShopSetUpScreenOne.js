import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomTextInput from '../../../common/CustomTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FontStyle} from '../../../../CommonStyle';
import CustomButton from '../../../common/CustomButton';
import {Divider} from 'react-native-paper';
import TimeCustomTextField from '../../../common/TimeCustomTextField';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const ShopSetUpScreenOne = ({control, errors, individual, hours, setHours}) => {
  const [ownerDetailShow, setOwnerDetailShow] = useState(true);
  const [shopInfoShow, setShopInfoShow] = useState(true);
  const [shopTimeDetails, setShopTimeDetails] = useState(true);

  const [daysTimeModalOpen, setDaysTimeModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedWeek, setSelectedWeek] = useState();
  const [selectedAllHours, setSelectedAllHours] = useState();

  const windowHeight = Dimensions.get('window').height;
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <View style={{marginHorizontal: 16}}>
      <View>
        <TouchableOpacity
          onPress={() => setOwnerDetailShow(!ownerDetailShow)}
          style={styles.labelMain}>
          <Icon
            name={ownerDetailShow ? 'angle-up' : 'angle-down'}
            size={33}
            color="black"
          />
          <Text style={styles.labelStyle}>Owner Details</Text>
        </TouchableOpacity>

        {ownerDetailShow && (
          <View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="First Name"
                mode="outlined"
                control={control}
                name="first_name"
                rules={{required: 'First Name is required *'}}
                activeOutlineColor="#29977E"
              />
              {errors?.first_name && (
                <Text style={{color: 'red'}}>
                  {errors?.first_name?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Last Name"
                mode="outlined"
                control={control}
                name="last_name"
                rules={{required: 'Last Name is required *'}}
                activeOutlineColor="#29977E"
              />
              {errors?.last_name && (
                <Text style={{color: 'red'}}>{errors?.last_name?.message}</Text>
              )}
            </View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Email"
                mode="outlined"
                control={control}
                name="user_email"
                rules={{
                  required: 'Email is required *',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Please enter a valid email',
                  },
                }}
                activeOutlineColor="#29977E"
              />
              {errors?.user_email && (
                <Text style={{color: 'red'}}>
                  {errors?.user_email?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Phone Number"
                mode="outlined"
                control={control}
                name="user_contact"
                rules={{
                  required: 'Phone Number is required *',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid mobile number',
                  },
                }}
                activeOutlineColor="#29977E"
                keyboardType="number-pad"
              />
              {errors?.user_contact && (
                <Text style={{color: 'red'}}>
                  {errors?.user_contact?.message}
                </Text>
              )}
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setShopInfoShow(!shopInfoShow)}
          style={styles.labelMain}>
          <Icon
            name={shopInfoShow ? 'angle-up' : 'angle-down'}
            size={32}
            color="black"
          />
          <Text style={styles.labelStyle}>Shop Info</Text>
        </TouchableOpacity>

        {shopInfoShow && (
          <View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Shop Name"
                mode="outlined"
                control={control}
                name="shop_name"
                rules={{required: 'Shop Name is required *'}}
                activeOutlineColor="#29977E"
              />
              {errors?.shop_name && (
                <Text style={{color: 'red'}}>{errors?.shop_name?.message}</Text>
              )}
            </View>
            {!individual && (
              <>
                <View style={{marginBottom: 15}}>
                  <CustomTextInput
                    label="Shop Email"
                    mode="outlined"
                    control={control}
                    name="shop_email"
                    // rules={{
                    //   required: 'Shop Email is required *',
                    //   pattern: {
                    //     value:
                    //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    //     message: 'Please enter a valid email',
                    //   },
                    // }}
                    activeOutlineColor="#29977E"
                  />
                  {/* {errors?.shop_email && (
                    <Text style={{color: 'red'}}>
                      {errors?.shop_email?.message}
                    </Text>
                  )} */}
                </View>
                <View style={{marginBottom: 15}}>
                  <CustomTextInput
                    label="Personal Website Link"
                    mode="outlined"
                    control={control}
                    name="personal_website"
                    activeOutlineColor="#29977E"
                  />
                </View>
                <View style={{marginBottom: 15}}>
                  <CustomTextInput
                    label="Facebook Link"
                    mode="outlined"
                    control={control}
                    name="facebook_link"
                    activeOutlineColor="#29977E"
                  />
                </View>
                <View style={{marginBottom: 15}}>
                  <CustomTextInput
                    label="Instagram Link"
                    mode="outlined"
                    control={control}
                    name="instagram_link"
                    activeOutlineColor="#29977E"
                  />
                </View>
              </>
            )}
          </View>
        )}

        {!individual && (
          <>
            <View style={styles.editBtnMain}>
              <TouchableOpacity
                onPress={() => setShopTimeDetails(!shopTimeDetails)}
                style={styles.labelMain}>
                <Icon
                  name={shopTimeDetails ? 'angle-up' : 'angle-down'}
                  size={32}
                  color="black"
                />
                <Text style={styles.labelStyle}>Shop Open/Close Time</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleOpenBottomSheet}
                style={styles.editLabelMain}>
                <Icon name="pencil" size={12} color="black" />
                <Text style={{color: 'rgba(21, 24, 39, 0.56)'}}>Edit</Text>
              </TouchableOpacity>
            </View>

            {shopTimeDetails && (
              <View style={styles.shopDetailMain}>
                {hours?.map((day, index) => (
                  <View style={{marginBottom: 15, width: '47%'}} key={index}>
                    {day['value']?.map((time, index1) => (
                      <TimeCustomTextField
                        key={index1}
                        value={time}
                        label={day['key']}
                        editable={false}
                      />
                    ))}
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
      <HoursModal
        isBottomSheetOpen={isBottomSheetOpen}
        hours={hours}
        handleCloseBottomSheet={handleCloseBottomSheet}
        windowHeight={windowHeight}
        setDaysTimeModalOpen={setDaysTimeModalOpen}
        setSelectedDay={setSelectedDay}
        setSelectedWeek={setSelectedWeek}
        setSelectedAllHours={setSelectedAllHours}
      />
      <DaysTimeModal
        daysTimeModalOpen={daysTimeModalOpen}
        setDaysTimeModalOpen={setDaysTimeModalOpen}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        hours={hours}
        setHours={setHours}
        setSelectedWeek={setSelectedWeek}
        selectedWeek={selectedWeek}
        selectedAllHours={selectedAllHours}
        setSelectedAllHours={setSelectedAllHours}
      />
    </View>
  );
};

export default ShopSetUpScreenOne;

const styles = StyleSheet.create({
  labelStyle: {
    color: '#151827',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: FontStyle,
  },
  labelMain: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  editLabelMain: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(21, 24, 39, 0.08)',
    borderRadius: 4,
    padding: 2,
  },
  shopDetailMain: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  editBtnMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const hourModelStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 23,
    bottom: 0,
  },
  headerText: {
    color: '#151827',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FontStyle,
  },
  daysAll: {
    color: '#151827',
    fontSize: 18,
    fontWeight: '600',
  },
  editDayHour: {
    backgroundColor: '#29977E',
    padding: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLeftMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  mainDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomThreeButton: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 3,
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  bottomThreeButtonText: {
    paddingVertical: 14,
    color: 'rgba(21, 24, 39, 0.56)',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: FontStyle,
  },
  openEveryDaysText: {
    color: 'green',
    fontWeight: '700',
    fontSize: 18,
  },
  closeEveryDaysText: {
    color: 'red',
    fontWeight: '700',
    fontSize: 18,
  },
});

const HoursModal = ({
  hours,
  isBottomSheetOpen,
  handleCloseBottomSheet,
  windowHeight,
  setDaysTimeModalOpen,
  setSelectedDay,
  setSelectedAllHours,
  setSelectedWeek,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isBottomSheetOpen}
      onRequestClose={handleCloseBottomSheet}>
      <View style={[hourModelStyles.modalContainer]}>
        <View
          style={[hourModelStyles.bottomSheet, {height: windowHeight * 0.7}]}>
          <View
            style={{
              width: '100%',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}>
              <Text style={hourModelStyles.headerText}>HOURS</Text>
              <TouchableOpacity onPress={handleCloseBottomSheet}>
                <Icon name="close" size={20} color="rgba(21, 24, 39, 0.56)" />
              </TouchableOpacity>
            </View>
            <Divider style={{marginVertical: 16}} bold={true} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                paddingHorizontal: 20,
                marginBottom: 50,
              }}>
              {hours?.map((day, index) => (
                <View
                  style={[hourModelStyles.mainDiv, {marginBottom: 16}]}
                  key={index}>
                  <View>
                    <Text style={hourModelStyles.daysAll}>{day['key']}</Text>
                  </View>
                  {day['value'].map((time, index1) => (
                    <View style={hourModelStyles.timeLeftMain} key={index1}>
                      {time === 'Closed' || time === 'Open 24 hours' ? (
                        <Text
                          style={
                            time === 'Open 24 hours'
                              ? hourModelStyles.openEveryDaysText
                              : hourModelStyles.closeEveryDaysText
                          }>
                          {time}
                        </Text>
                      ) : (
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 10,
                          }}>
                          <TimeCustomTextField
                            value={time.split(' - ')[0]}
                            label="Start"
                            editable={false}
                          />
                          <TimeCustomTextField
                            value={time.split(' - ')[1]}
                            label="End"
                            editable={false}
                          />
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={() => {
                          setDaysTimeModalOpen(true);
                          setSelectedDay(day['key'] + ' - ' + time);
                        }}
                        style={hourModelStyles.editDayHour}>
                        <Icon name="pencil" size={15} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}
              <Divider style={{marginVertical: 16}} bold={true} />

              <View
                style={{
                  marginTop: 15,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={hourModelStyles.bottomThreeButton}
                  onPress={() => {
                    setDaysTimeModalOpen(true);

                    setSelectedAllHours([
                      'Sunday',
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ]);
                  }}>
                  <Icon
                    name="pencil"
                    size={12}
                    color="rgba(21, 24, 39, 0.56)"
                  />
                  <Text style={hourModelStyles.bottomThreeButtonText}>
                    EDIT ALL HOURS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={hourModelStyles.bottomThreeButton}
                  onPress={() => {
                    setDaysTimeModalOpen(true);

                    setSelectedWeek([
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ]);
                  }}>
                  <Icon
                    name="pencil"
                    size={12}
                    color="rgba(21, 24, 39, 0.56)"
                  />
                  <Text style={hourModelStyles.bottomThreeButtonText}>
                    EDIT MON TO SAT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={hourModelStyles.bottomThreeButton}
                  onPress={() => {
                    setDaysTimeModalOpen(true);
                    setSelectedDay(
                      'Sunday' +
                        ' - ' +
                        hours[hours.findIndex(item => item.key === 'Sunday')]
                          .value,
                    );
                  }}>
                  <Icon
                    name="pencil"
                    size={12}
                    color="rgba(21, 24, 39, 0.56)"
                  />
                  <Text style={hourModelStyles.bottomThreeButtonText}>
                    EDIT SUNDAY
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 40, width: '100%'}}>
                <CustomButton
                  name="Save"
                  color="#FFFFFF"
                  backgroundColor="#29977E"
                  onPress={handleCloseBottomSheet}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const daysStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    alignSelf: 'center',
    marginVertical: 15,
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },
  daysNameFirstMain: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    marginBottom: 20,
  },
  charMainDiv: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  charUnSelectedMainDiv: {
    backgroundColor: 'white',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  checkBoxMain: {
    marginLeft: 25,
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  mainTimeDiv: {
    marginLeft: 25,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  startEndText: {
    paddingLeft: 30,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#151827',
  },
  bottomButtonMain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginRight: 30,
    marginBottom: 16,
  },
});

const DaysTimeModal = ({
  daysTimeModalOpen,
  setDaysTimeModalOpen,
  setSelectedDay,
  selectedDay,
  hours,
  setHours,
  setSelectedWeek,
  selectedWeek,
  selectedAllHours,
  setSelectedAllHours,
}) => {
  const [startTime, setStartTime] = useState();
  const [closeTime, setCloseTime] = useState();
  const [closed, setClosed] = useState(false);
  const [open24Hours, setOpen24Hours] = useState(false);

  const currentDate = new Date();

  // Calculate the date and time 12 hours from now
  const futureDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(futureDate);

  const handleCloseDaysTimeModal = () => {
    setDaysTimeModalOpen(false);
    setSelectedDay();

    setSelectedWeek();
    setSelectedAllHours();
    setClosed(false);
    setOpen24Hours(false);
    setStartTime();
    setCloseTime();
  };

  const saveDaysTimeData = () => {
    if ((closed || open24Hours) && selectedDay) {
      const index = hours?.findIndex(
        item => item.key === selectedDay?.split(' - ')[0],
      );
      if (hours[index]?.value) {
        hours[index].value = open24Hours ? ['Open 24 hours'] : ['Closed'];
        setHours(hours);
      }
      handleCloseDaysTimeModal();
    }

    if (
      hours &&
      !closed &&
      !open24Hours &&
      selectedWeek === undefined &&
      selectedAllHours === undefined
    ) {
      const index = hours.findIndex(
        item => item.key === selectedDay?.split(' - ')[0],
      );
      if (hours[index]?.value && startTime && closeTime) {
        hours[index].value = [`${startTime} - ${closeTime}`];
        setHours(hours);
      }
      handleCloseDaysTimeModal();
    }

    if ((closed || open24Hours) && selectedAllHours) {
      hours?.map(itm =>
        selectedAllHours?.map(day => {
          if (day === itm.key) {
            return (itm.value = open24Hours ? ['Open 24 hours'] : ['Closed']);
          }
          return itm;
        }),
      );
      handleCloseDaysTimeModal();
    }

    const formatStartTime = moment(selectedStartTime).format('hh:mm A');
    const formatEndTime = moment(selectedEndTime).format('hh:mm A');
    if (hours && !closed && !open24Hours && selectedAllHours) {
      hours?.map(itm =>
        selectedAllHours?.map(day => {
          if (day === itm.key) {
            return (itm.value = [
              `${startTime === undefined ? formatStartTime : startTime} - ${
                closeTime === undefined ? formatEndTime : closeTime
              }`,
            ]);
          }
          return itm;
        }),
      );

      handleCloseDaysTimeModal();
    }

    if ((closed || open24Hours) && selectedWeek) {
      hours?.map(itm =>
        selectedWeek?.map(day => {
          if (day === itm.key) {
            return (itm.value = open24Hours ? ['Open 24 hours'] : ['Closed']);
          }
          return itm;
        }),
      );
      handleCloseDaysTimeModal();
    }

    if (hours && !closed && !open24Hours && selectedWeek) {
      hours?.map(itm =>
        selectedWeek?.map(day => {
          if (day === itm.key) {
            return (itm.value = [
              `${startTime === undefined ? formatStartTime : startTime} - ${
                closeTime === undefined ? formatEndTime : closeTime
              }`,
            ]);
          }
          return itm;
        }),
      );

      handleCloseDaysTimeModal();
    }
  };

  useEffect(() => {
    if (selectedDay) {
      const timeString = selectedDay?.split(' - ')[1];
      if (timeString === 'Closed' || timeString === 'Open 24 hours') {
        const formattedTimeNew = moment(new Date()).format('hh:mm A');
        setStartTime(formattedTimeNew);
        setSelectedStartTime(new Date());
      } else {
        const [time, period] = timeString?.split(' ');
        const [hours, minutes] = time?.split(':')?.map(Number);

        const currentDate = new Date();
        const newDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          hours,
          minutes,
        );
        if (period === 'PM') {
          newDate.setHours(newDate.getHours() + 12);
        }
        setStartTime(timeString);
        setSelectedStartTime(newDate);
      }
    }
  }, [selectedDay]);

  useEffect(() => {
    if (selectedDay) {
      const openClosedString = selectedDay?.split(' - ')[1];

      if (
        openClosedString === 'Closed' ||
        openClosedString === 'Open 24 hours'
      ) {
        const formattedTimeNew = moment(new Date(futureDate)).format('hh:mm A');
        setCloseTime(formattedTimeNew);
        setSelectedEndTime(futureDate);
      } else {
        const EndTimeString = selectedDay?.split(' - ')[2];

        const [timeEnd, periodEnd] = EndTimeString?.split(' ');
        const [hoursEnd, minutesEnd] = timeEnd?.split(':')?.map(Number);
        const currentDate = new Date();

        const newDateEnd = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          hoursEnd,
          minutesEnd,
        );
        if (periodEnd === 'PM') {
          newDateEnd.setHours(newDateEnd.getHours() + 12);
        }
        setCloseTime(EndTimeString);

        setSelectedEndTime(newDateEnd);
      }
    }
  }, [selectedDay]);

  useEffect(() => {
    if (selectedDay?.split(' - ')[1] === 'Closed') {
      setClosed(true);
    } else {
      setClosed(false);
    }

    if (selectedDay?.split(' - ')[1] === 'Open 24 hours') {
      setOpen24Hours(true);
    } else {
      setOpen24Hours(false);
    }
  }, [selectedDay]);

  const handleStartTimeChange = newTime => {
    const formattedTime = moment(newTime).format('hh:mm A');
    setStartTime(formattedTime);
    setSelectedStartTime(newTime);
  };
  const handleEndTimeChange = newTime => {
    const formattedTime = moment(newTime).format('hh:mm A');
    setCloseTime(formattedTime);
    setSelectedEndTime(newTime);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={daysTimeModalOpen}
      onRequestClose={() => {
        setDaysTimeModalOpen(!daysTimeModalOpen);
      }}>
      <View style={daysStyles.centeredView}>
        <View style={daysStyles.modalView}>
          <Text style={daysStyles.headerText}>Select days & time</Text>
          <View style={daysStyles.daysNameFirstMain}>
            {[
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ].map((itm, index) => (
              <TouchableOpacity
                style={[
                  daysStyles.charMainDiv,
                  {
                    backgroundColor:
                      selectedDay?.split(' - ')[0] === itm
                        ? '#bdbbbb'
                        : selectedWeek?.find(day => day === itm)
                        ? '#bdbbbb'
                        : selectedAllHours?.find(day => day === itm)
                        ? '#bdbbbb'
                        : 'white',
                  },
                ]}
                key={index}>
                <Text style={{color: 'black'}}>{itm?.charAt(0)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={daysStyles.checkBoxMain}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                color: 'black',
              }}>
              <CheckBox
                value={open24Hours}
                onValueChange={e => {
                  setOpen24Hours(e);
                  if (closed) {
                    setClosed(!e);
                  }
                }}
                tintColors={{
                  true: '#29977E',
                  false: '#151827',
                  disabled: 'gray',
                }}
              />
              <Text style={{color: 'black'}}>Open 24 Hours</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                value={closed}
                onValueChange={e => {
                  setClosed(e);
                  if (open24Hours) {
                    setOpen24Hours(!e);
                  }
                }}
                tintColors={{
                  true: '#29977E',
                  false: '#151827',
                  disabled: 'gray',
                }}
              />
              <Text style={{color: 'black'}}>Closed</Text>
            </View>
          </View>

          {!(closed || open24Hours) && (
            <View style={daysStyles.mainTimeDiv}>
              <View>
                <Text style={daysStyles.startEndText}>Start Time</Text>
                <DatePicker
                  style={{width: 150, height: 100}}
                  mode="time"
                  date={selectedStartTime}
                  onDateChange={handleStartTimeChange}
                  is24hourSource="locale"
                  textColor="black"
                />
              </View>
              <View>
                <Text style={daysStyles.startEndText}>End Time</Text>
                <DatePicker
                  style={{width: 150, height: 100}}
                  mode="time"
                  date={selectedEndTime}
                  onDateChange={handleEndTimeChange}
                  is24hourSource="locale"
                  textColor="black"
                />
              </View>
            </View>
          )}

          <View style={daysStyles.bottomButtonMain}>
            <View style={{width: '30%'}}>
              <CustomButton
                name="Cancel"
                color="#29977E"
                backgroundColor="white"
                borderColor="#29977E"
                onPress={() => handleCloseDaysTimeModal()}
              />
            </View>
            <View style={{width: '30%'}}>
              <CustomButton
                name="Save"
                color="white"
                backgroundColor="#29977E"
                borderColor="#29977E"
                onPress={() => saveDaysTimeData()}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
