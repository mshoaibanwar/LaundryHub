import React, { ReactNode, useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, SafeAreaView, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { axiosInstance } from '../../helpers/AxiosAPI';
import { useAppSelector } from '../../hooks/Hooks';

interface LocationTrackerProps {
    children: ReactNode; // Explicitly define children prop
}

const LocationTracker: React.FC<LocationTrackerProps> = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
    const [lastLocation, setLastLocation] = useState({ latitude: 0, longitude: 0 });
    const user: any = useAppSelector((state) => state.user.value);

    let locationWatchId: number;
    let locationUpdateInterval: NodeJS.Timeout;

    useEffect(() => {
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
                    Geolocation.requestAuthorization();
                    trackLocation();
                }
            } catch (error) {
                console.error('Error requesting location permission:', error);
            }
        };

        requestLocationPermission();

        return () => {
            Geolocation.clearWatch(locationWatchId);
            clearInterval(locationUpdateInterval);
        };
    }, []);

    const trackLocation = () => {
        // Watch for location changes
        locationWatchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
            },
            (error) => console.error(error),
            { enableHighAccuracy: true, distanceFilter: 5 } // Update only when the user moves more than 5 meters
        );

        // Send location to MongoDB API every 10 seconds
        locationUpdateInterval = setInterval(() => {
            if (
                currentLocation.latitude !== lastLocation.latitude ||
                currentLocation.longitude !== lastLocation.longitude
            ) {
                // Make API call to store coordinates in MongoDB
                saveCoordinatesToMongoDB(currentLocation);

                // Update last location
                setLastLocation(currentLocation);
            }
        }, 10000); // Update every 10 seconds
    };

    const saveCoordinatesToMongoDB = async (coordinates: { latitude: number; longitude: number }) => {
        const apiUrl = `/riders/updateLoc/${user.user._id}`;
        await axiosInstance.post(apiUrl, coordinates)
            .then(function (response: any) {
                //console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        // <SafeAreaView>
        //     <Text>Current Location: {currentLocation.latitude}, {currentLocation.longitude}</Text>
        //     <Text>Last Location: {lastLocation.latitude}, {lastLocation.longitude}</Text>
        // </SafeAreaView>
        <>
            {children}
        </>
    );
};

export default LocationTracker;