import { Bike } from 'lucide-react-native';
import React, { ReactNode, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native';
import { axiosInstance } from '../helpers/AxiosAPI';
import { useAppSelector } from '../hooks/Hooks';

interface PopupProps {
    children: ReactNode; // Explicitly define children prop
    navigation: any;
}

const Popup: React.FC<PopupProps> = ({ children, navigation }) => {
    const user: any = useAppSelector((state) => state.user.value);
    const [rideAccepted, setRideAccepted] = React.useState(false)
    useEffect(() => {
        axiosInstance.get(`rides/user/${user.user._id}`)
            .then((res) => {
                setRideAccepted(res.data[0].status !== 'Pending')
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);

    const onNavigate = () => {
        navigation.navigate('RideReq')
    }
    return (
        <>
            {children}
            {rideAccepted ?
                <TouchableOpacity onPress={onNavigate} style={{ position: 'absolute', width: 60, height: 60, top: 400, left: 10, backgroundColor: 'blue', borderRadius: 20 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Bike color='white' size={45} />
                    </View>
                </TouchableOpacity >
                : null}
        </>
    );
}

export default Popup