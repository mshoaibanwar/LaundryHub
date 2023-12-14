import React, { ReactNode, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { axiosInstance } from '../../helpers/AxiosAPI';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { addUser } from '../../reduxStore/reducers/UserReducer';
import GetLocation from 'react-native-get-location';
import socket from '../../helpers/Socket';
import { addMsg } from '../../reduxStore/reducers/MessagesReducer';

interface LocationTrackerProps {
    children: ReactNode; // Explicitly define children prop
}

export const rejectedRides: any = []

const LocationTracker: React.FC<LocationTrackerProps> = ({ children }) => {
    let locationUpdateInterval: NodeJS.Timeout;

    const dispatch = useAppDispatch();

    useEffect(() => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
        })
            .then(location => {
                const { latitude, longitude } = location;
                saveCoordinatesToMongoDB({ latitude, longitude });
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })

        const requestLocationPermission = async () => {
            try {
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'This app needs access to your location.',
                            buttonPositive: 'OK',
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        trackLocation();
                    } else {
                        console.error('Location permission denied');
                    }
                } else if (Platform.OS === 'ios') {
                    trackLocation();
                }
            } catch (error) {
                console.error('Error requesting location permission:', error);
            }
        };

        requestLocationPermission();

        return () => {
            clearInterval(locationUpdateInterval);
        };
    }, []);

    const user: any = useAppSelector((state) => state.user.value);
    const trackLocation = () => {
        locationUpdateInterval = setInterval(() => {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
            })
                .then(location => {
                    const { latitude, longitude } = location;
                    if (user.latitude !== latitude && user.longitude !== longitude)
                        saveCoordinatesToMongoDB({ latitude, longitude });
                })
                .catch(error => {
                    const { code, message } = error;
                    console.warn(code, message);
                })
        }, 10000);
    }

    const saveCoordinatesToMongoDB = async (coordinates: { latitude: number; longitude: number }) => {
        const apiUrl = `/riders/updateLoc/${user?.user?._id}`;
        await axiosInstance.post(apiUrl, coordinates)
            .then(function (response: any) {
                let nuser = { ...user, ...coordinates }
                dispatch(addUser(nuser));
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (message.msg) {
            const nMsg: any = { from: 'other', msg: message.msg };
            dispatch(addMsg(nMsg))
        }
    }

    return (
        <>
            {children}
        </>
    );
};

export default LocationTracker;