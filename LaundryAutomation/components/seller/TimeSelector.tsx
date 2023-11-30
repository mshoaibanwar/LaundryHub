import React, { useCallback, useState } from 'react'
import { Button, Switch, Text, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { BlueColor } from '../../constants/Colors';

const TimeSelector = (props: any) => {
    const [openStart, setOpenStart] = useState(false);
    const [startValue, setStartValue] = useState(props?.data[0]?.time?.start);
    const [openEnd, setOpenEnd] = useState(false);
    const [endValue, setEndValue] = useState(props?.data[0]?.time?.end);
    const [openDays, setOpenDays] = useState(false);
    const [dayValue, setDayValue] = useState(0);
    const [isOpen, setIsOpen] = useState(props?.data[0]?.status == 'on' ? true : false);
    const [items, setItems] = useState([
        { label: '06:00 AM', value: '6:00 AM' },
        { label: '07:00 AM', value: '7:00 AM' },
        { label: '08:00 AM', value: '8:00 AM' },
        { label: '09:00 AM', value: '9:00 AM' },
        { label: '10:00 AM', value: '10:00 AM' },
        { label: '11:00 AM', value: '11:00 AM' },
        { label: '12:00 PM', value: '12:00 PM' },
        { label: '01:00 PM', value: '1:00 PM' },
        { label: '02:00 PM', value: '2:00 PM' },
        { label: '03:00 PM', value: '3:00 PM' },
        { label: '04:00 PM', value: '4:00 PM' },
        { label: '05:00 PM', value: '5:00 PM' },
        { label: '06:00 PM', value: '6:00 PM' },
        { label: '07:00 PM', value: '7:00 PM' },
        { label: '08:00 PM', value: '8:00 PM' },
        { label: '09:00 PM', value: '9:00 PM' },
        { label: '10:00 PM', value: '10:00 PM' },
        { label: '11:00 PM', value: '11:00 PM' },
        { label: '11:59 PM', value: '11:59 PM' }

    ]);

    const [days, setDays] = useState([
        { label: 'Sunday', value: 0 },
        { label: 'Monday', value: 1 },
        { label: 'Tuesday', value: 2 },
        { label: 'Wednesday', value: 3 },
        { label: 'Thursday', value: 4 },
        { label: 'Friday', value: 5 },
        { label: 'Saturday', value: 6 },
    ]);

    const onStartOpen = useCallback(() => {
        setOpenEnd(false);
        setOpenDays(false);
    }, []);
    const onEndOpen = useCallback(() => {
        setOpenStart(false);
        setOpenDays(false);
    }, []);
    const onDayOpen = useCallback(() => {
        setOpenStart(false);
        setOpenEnd(false);
    }, []);
    const toggleSwitch = () => setIsOpen(previousState => !previousState);

    const onDayChange = (value: any) => {
        setDayValue(value);
        setStartValue(props?.data[value]?.time?.start);
        setEndValue(props?.data[value]?.time?.end);
        setIsOpen(props?.data[value]?.status == 'on' ? true : false);
    }

    const onUpdate = () => {
        let temp = [...props.data];
        temp[dayValue].time.start = startValue;
        temp[dayValue].time.end = endValue;
        temp[dayValue].status = isOpen ? 'on' : 'off';
        props.setData(temp);
    }

    return (
        <View style={{ gap: 10, position: 'relative', zIndex: 1, borderWidth: 0.5, padding: 10, borderRadius: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 3 }}>
                <Text style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>Select Day:</Text>
                <DropDownPicker
                    containerStyle={{ width: '43%' }}
                    style={{ backgroundColor: BlueColor, borderRadius: 6, paddingHorizontal: 10, minHeight: 40 }}
                    textStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
                    placeholder='Monday'
                    dropDownContainerStyle={{ backgroundColor: BlueColor, borderRadius: 6, borderTopColor: 'grey' }}
                    open={openDays}
                    onOpen={onDayOpen}
                    theme='DARK'
                    value={dayValue}
                    items={days}
                    zIndex={1000}
                    zIndexInverse={2000}
                    setOpen={setOpenDays}
                    setValue={setDayValue}
                    setItems={setDays}
                    onChangeValue={(value) => { onDayChange(value) }}
                    autoScroll={true}
                    searchable={true}
                    listMode='SCROLLVIEW'
                />
            </View>
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                <DropDownPicker
                    containerStyle={{ width: '43%' }}
                    style={{ backgroundColor: BlueColor, borderRadius: 6, paddingHorizontal: 10, minHeight: 40 }}
                    textStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
                    placeholder='8:00 AM'
                    dropDownContainerStyle={{ backgroundColor: BlueColor, borderRadius: 10, borderTopColor: 'grey' }}
                    open={openStart}
                    onOpen={onStartOpen}
                    theme='DARK'
                    value={startValue}
                    items={items}
                    setOpen={setOpenStart}
                    setValue={setStartValue}
                    setItems={setItems}
                    autoScroll={true}
                    searchable={true}
                    listMode='SCROLLVIEW'
                />

                <Text style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>To</Text>

                <DropDownPicker
                    containerStyle={{ width: '43%' }}
                    style={{ backgroundColor: BlueColor, borderRadius: 6, paddingHorizontal: 10, minHeight: 40 }}
                    textStyle={{ color: 'white', fontSize: 16, fontWeight: '500' }}
                    placeholder='10:00 PM'
                    dropDownContainerStyle={{ backgroundColor: BlueColor, borderRadius: 10, borderTopColor: 'grey' }}
                    open={openEnd}
                    onOpen={onEndOpen}
                    theme='DARK'
                    value={endValue}
                    items={items}
                    setOpen={setOpenEnd}
                    setValue={setEndValue}
                    setItems={setItems}
                    autoScroll={true}
                    searchable={true}
                    listMode='SCROLLVIEW'
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>Shop Status ( Open / Closed )</Text>
                <Switch onValueChange={toggleSwitch} value={isOpen} />
            </View>

            <TouchableOpacity onPress={onUpdate} style={{ backgroundColor: BlueColor, padding: 8, borderRadius: 6 }}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '500' }}>Update Timing</Text>
            </TouchableOpacity>
        </View>
    )
}

export default TimeSelector