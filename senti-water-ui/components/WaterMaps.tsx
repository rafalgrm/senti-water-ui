const { Tabs, Tab, TabList, TabPanels, TabPanel, Button, TabsSkeleton } = require('@carbon/react');

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
                        <TabPanel>
                            { bigMapUrl !== "" ? <img src={bigMapUrl}/> : <div>{emptyMessage}</div> }
                        </TabPanel>
                        <TabPanel>
                            Tab Panel 2 <Button>Example button</Button>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            )}
        </div>
    );
}

export default WaterMaps;