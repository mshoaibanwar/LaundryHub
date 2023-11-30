import React from 'react'
import {
    View,
} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';

type propsType = {
    type: string,
    setType: React.Dispatch<React.SetStateAction<string>>
}

const ServiceTypeCard = (props: propsType) => {
    const data = [
        {
            label: 'Wash',
            value: 'Wash',
        },
        {
            label: 'Dry Clean',
            value: 'Dry Clean',
        },
        {
            label: 'Ironing',
            value: 'Iron',
        }
    ];

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 }}>
            <RadioButtonRN
                initial={1}
                data={data}
                selectedBtn={(e: any) => { props.setType(e.value) }}
                box={true}
                style={{ width: '100%' }}
            />
        </View>
    )
}

export default ServiceTypeCard