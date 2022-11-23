const { Tabs, Tab, TabList, TabPanels, TabPanel, TabsSkeleton } = require('@carbon/react');
import Image from 'next/image'

type WaterMapsProps = {
    smallMapUrl: string,
    bigMapUrl: string,
    isLoading: boolean,
    emptyMessage: string,
};

const WaterMaps = ({ smallMapUrl, bigMapUrl, isLoading, emptyMessage }: WaterMapsProps) => {
    return (
        <div>
            { isLoading
            ? <TabsSkeleton />
            : (
                <Tabs>
                    <TabList aria-label="Water data">
                        <Tab>Big</Tab>
                        <Tab>Detailed</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel style={{ width: "100%", height: "420px", position: "relative" }}>
                            { bigMapUrl !== "" ? <Image fill alt="Big map" src={bigMapUrl}/> : <div>{emptyMessage}</div> }
                        </TabPanel>
                        <TabPanel style={{ width: "100%", height: "420px", position: "relative" }}>
                            { smallMapUrl !== "" ? <Image fill alt="Small map" src={smallMapUrl}/> : <div>{emptyMessage}</div> }
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            )}
        </div>
    );
}

export default WaterMaps;