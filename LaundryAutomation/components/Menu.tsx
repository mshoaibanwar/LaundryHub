import { X, UserCog, MapPin, Folder, Languages, BadgeInfo, Lock, LogOut, Bike } from 'lucide-react-native'
import React, { useRef } from 'react'
import { StyleSheet } from 'react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAppDispatch, useAppSelector } from '../hooks/Hooks';
import { logout } from '../reduxStore/reducers/UserReducer';
import Toast from 'react-native-toast-notifications';
import { emptyShopData } from '../reduxStore/reducers/ShopDataReducer';
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';

interface propsTypes {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    modalVisible: boolean;
    navigation: any;
}

const Menu = ({ setModal, modalVisible, navigation }: propsTypes) => {
    const user: any = useAppSelector((state) => state.user.value);
    const dispatch = useAppDispatch();

    const toastRef = useRef<any>(null);

    const logoutUser = () => {
        dispatch(emptyShopData(''));
        dispatch(logout(''));

        toastRef.current?.show("Logged Out!", {
            type: "success",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
        });
        navigation.navigate("Login");

        setModal(false);
    }

    const onMyOrder = () => {
        if (user?.userType == "user")
            navigation.navigate("HomeStack", { screen: 'MyOrders' });
        else if (user?.userType == "seller")
            navigation.navigate("OrdersStack", { screen: 'Orders' });
        else if (user?.userType == "rider")
            navigation.navigate("HomeStack", { screen: 'MyRides' });
        setModal(false)
    }

    return (
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            visible={modalVisible}
            onRequestClose={() => {
                setModal(!modalVisible);
            }}>
            <View style={{ backgroundColor: 'whte' }}>
                <Toast ref={toastRef} />
                <View>
                    <Pressable onPress={() => setModal(false)} style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', margin: 5 }}>
                        <X color='black' strokeWidth={3} size={30} />
                    </Pressable>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 20 }}>
                        <View>
                            <Text style={{ fontSize: 28, fontWeight: '600', color: 'black' }}>
                                Hello, {user?.user?.name.split(' ')[0]}
                            </Text>
                            <Text style={{ color: 'black' }}>
                                {user?.user?.email}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Pressable onPress={() => { navigation.navigate("HomeStack", { screen: 'Account' }); setModal(false) }} style={{ backgroundColor: Colors.FrontColor, borderWidth: 0.4, borderRadius: 20, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <UserCog color='black' size={30} />
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ height: 6, backgroundColor: '#e8e8e8' }}></View>

                </View>
                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                    <Text style={{ fontSize: 22, fontWeight: '500', marginVertical: 5, color: 'black' }}>Personal</Text>
                    {user?.userType === 'user' ?
                        <Pressable onPress={() => { navigation.navigate("HomeStack", { screen: 'Addresses' }); setModal(false) }} style={styles.btn}>
                            <MapPin color='black' size={22} />
                            <Text style={styles.btnText}>My Addresses</Text>
                        </Pressable>
                        : null}
                    {user?.userType === 'rider' ?
                        <Pressable onPress={onMyOrder} style={styles.btn}>
                            <Bike color='black' size={22} />
                            <Text style={styles.btnText}>My Rides</Text>
                        </Pressable> :
                        <Pressable onPress={onMyOrder} style={styles.btn}>
                            <Folder color='black' size={22} />
                            <Text style={styles.btnText}>My Orders</Text>
                        </Pressable>
                    }
                </View>
                <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
                    <Text style={{ fontSize: 22, fontWeight: '500', marginVertical: 5, color: 'black' }}>General</Text>
                    <Pressable onPress={() => { navigation.navigate("HomeStack", { screen: 'ChangePswrd' }); setModal(false) }} style={styles.btn}>
                        <Lock color='black' size={22} />
                        <Text style={styles.btnText}>Change Password</Text>
                    </Pressable>
                    <Pressable onPress={logoutUser} style={styles.btn}>
                        <LogOut color='black' size={22} />
                        <Text style={styles.btnText}>Logout</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 }}>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            <Languages color='black' size={22} />
                            <Text style={styles.btnText}>Language</Text>
                        </View>
                        <View>
                            <Text style={styles.btnText}>English</Text>
                        </View>
                    </Pressable>
                    <Pressable style={styles.btn}>
                        <BadgeInfo color='black' size={22} />
                        <Text style={styles.btnText}>About Us</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginVertical: 15,
        color: 'black'
    },
    btnText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'black'
    }
})

export default Menu