import { useEffect } from "react";
import { Text, View } from "react-native";
import { fetchCropPrices } from "../libs/crop_rate";
import { getCurrentLocation } from "../libs/location";

export default function RateWidget() {

    // useEffect(() => {
    //     (async () => {
    //         const location = (await getCurrentLocation())
    //         const state = location?.region || ""
    //         const district = location?.city || ""
    //         const data = await fetchCropPrices({commodity: "potato", state, district})

    //         console.log(data)
    //     })()
    // }, [])

    return (
        <View>
            <Text className="text-2xl font-bold">Market rate page coming soon</Text>
        </View>
    );
}