import { SyntheticEvent, useEffect, useState } from 'react';
import WaterTable from "../components/WaterTable";
import { loadWaters } from "../lib/load-waters";

const handleOnRowClick = (evt: SyntheticEvent, setBinaryBuffer: (resp: any) => void) => {
    const x = ((evt.target as HTMLElement)?.parentNode as HTMLTableRowElement)?.cells[1]?.innerText;
    const y = ((evt.target as HTMLElement)?.parentNode as HTMLTableRowElement)?.cells[2]?.innerText;
    // console.log(evt);
    // console.log(((evt.target as HTMLElement)?.parentNode as HTMLTableRowElement)?.cells);
    
    // fetch(`/api/small-map?x=${x}&y=${y}&polygon=${}`)
    fetch(`/api/small-map?x=${x}&y=${y}`)
    .then((response) => {
        response.blob().then((data) => setBinaryBuffer(data))
    })
}

function Waters({ waters }: any) {
    const [binaryBuffer, setBinaryBuffer] = useState()
    const [imgSrc, setImgSrc] = useState('')
    useEffect(() => {
        if (binaryBuffer !== undefined) {
            setImgSrc(URL.createObjectURL(binaryBuffer));
        }
    }, [binaryBuffer])

    // console.log('uuu');
    // console.log(waters);
   
    const rows = waters.map((water: any) => ({ id: water.index.toString(), coordX: water.centroid_coords[0], coordY: water.centroid_coords[1], polygon_length: water.polygon_coords.length, area: water.area}))
    const headers = [{ key: 'id', header: 'DB ID'}, { key: 'coordX', header: 'centroid X' }, { key: 'coordY', header: 'centroid Y' }, { key: 'polygon_length', header: 'polygon length' }, { key: 'area', header: 'area (km^2)' }]
    return (
        <div className="cds--css-grid">
            <div className="cds--col-span-6 cds--css-grid-column">
                <WaterTable
                    rows={rows}
                    headers={headers}
                    handleOnRowClick={(evt: SyntheticEvent) => handleOnRowClick(evt, setBinaryBuffer)}
                />
            </div>
            <div className="cds--col-span-2 cds--css-grid-column">
                <img src={imgSrc}/>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const waters = await loadWaters()
    return { props: { waters } }
}

export default Waters;