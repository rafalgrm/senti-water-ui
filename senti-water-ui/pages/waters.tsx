import { SyntheticEvent, useEffect, useState } from 'react';
import WaterMaps from '../components/WaterMaps';
import WaterTable from "../components/WaterTable";
import { loadWaters } from "../lib/load-waters";

const handleOnRowClick = (evt: SyntheticEvent, setBinaryBuffer: (resp: any) => void, setIsLoading: (isLoading: boolean) => void) => {
    const x = ((evt.target as HTMLElement)?.parentNode as HTMLTableRowElement)?.cells[1]?.innerText;
    const y = ((evt.target as HTMLElement)?.parentNode as HTMLTableRowElement)?.cells[2]?.innerText;
    
    setIsLoading(true)
    // fetch(`/api/small-map?x=${x}&y=${y}&polygon=${}`)
    fetch(`/api/small-map?x=${x}&y=${y}`)
    .then((response) => {
        response.blob().then((data) => setBinaryBuffer(data))
    })
}

const INIT_TABLE_LIMIT = 10;
const INIT_TABLE_PAGE = 0;

function Waters({ waters, total }: any) {
    // IMAGE
    const [binaryBuffer, setBinaryBuffer] = useState()
    const [imgSrc, setImgSrc] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    // TABLE
    const [watersState, setWatersState] = useState(waters)
    const [totalState, setTotalState] = useState(total)
    const [tableLimit, setTableLimit] = useState(INIT_TABLE_LIMIT);
    const [tablePage, setTablePage] = useState(INIT_TABLE_PAGE);
    
    useEffect(() => {
        if (binaryBuffer !== undefined) {
            setImgSrc(URL.createObjectURL(binaryBuffer));
            setIsLoading(false)
        }
    }, [binaryBuffer])

    useEffect(() => {
        fetch(`/api/waters?limit=${tableLimit}&page=${tablePage}`).then((resp) => resp.json()).then((data) => {
            setWatersState(data.waters)
            setTotalState(data.total)
        })
    }, [tableLimit, tablePage])

    const tableChangeHandler = (evt: { pageSize: number, page: number }) => {
        setTablePage(evt.page)
        setTableLimit(evt.pageSize)
    }
   
    const rows = watersState.map((water: any) => ({
        id: water.index.toString(),
        coordX: water.centroid_coords[0],
        coordY: water.centroid_coords[1],
        polygon_length: water.polygon_coords.length,
        area: water.area})
    )
    const headers = [
        { key: 'id', header: 'DB ID'},
        { key: 'coordX', header: 'centroid X' },
        { key: 'coordY', header: 'centroid Y' },
        { key: 'polygon_length', header: 'polygon length' },
        { key: 'area', header: 'area (km^2)' }
    ]
    
    return (
        <div className="cds--css-grid">
            <div className="cds--col-span-9 cds--css-grid-column">
                <header>Water bodies</header>
                <WaterTable
                    rows={rows}
                    headers={headers}
                    handleOnRowClick={(evt: SyntheticEvent) => handleOnRowClick(evt, setBinaryBuffer, setIsLoading)}
                    totalRows={totalState}
                    onTableChange={tableChangeHandler}
                />
            </div>
            <div className="cds--col-span-7 cds--css-grid-column">
                <header>Details</header>
                <WaterMaps
                    smallMapUrl={imgSrc}
                    bigMapUrl={imgSrc}
                    isLoading={isLoading}
                    emptyMessage="Click on item on the table to the left"
                />
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const { waters, total } = await loadWaters(INIT_TABLE_LIMIT, INIT_TABLE_PAGE)
    console.log({waters})
    return { props: { waters, total } }
}

export default Waters;