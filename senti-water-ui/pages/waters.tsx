import { SyntheticEvent, useEffect, useState } from 'react';
const { Heading } = require("@carbon/react")
import WaterMaps from '../components/WaterMaps';
import WaterTable from "../components/WaterTable";
import WaterBodyData from "../components/WaterBodyData"
import { loadWaters } from "../lib/load-waters";

const INIT_TABLE_LIMIT = 10;
const INIT_TABLE_PAGE = 1;

function Waters({ waters, total }: any) {
    // IMAGE
    const [binaryBuffer, setBinaryBuffer] = useState()
    const [binaryBufferDetailed, setBinaryBufferDetailed] = useState()
    const [imgSrc, setImgSrc] = useState('')
    const [polygonImgSrc, setPolygonImgSrc] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    // TABLE
    const [isTableLoading, setIsTableLoading] = useState(true)
    const [watersState, setWatersState] = useState(waters)
    const [totalState, setTotalState] = useState(total)
    const [tableLimit, setTableLimit] = useState(INIT_TABLE_LIMIT);
    const [tablePage, setTablePage] = useState(INIT_TABLE_PAGE);
    const [reload, setReload] = useState(false);
    // DATA
    const [rowClicked, setRowClicked] = useState()
    const [prevTableId, setPrevTableId] = useState('')
    
    useEffect(() => {
        if (binaryBuffer !== undefined) {
            setImgSrc(URL.createObjectURL(binaryBuffer));
            setIsLoading(false)
        }
        if (binaryBufferDetailed !== undefined) {
            setPolygonImgSrc(URL.createObjectURL(binaryBufferDetailed))
            setIsLoading(false)
        }
        // TODO setError
    }, [binaryBuffer, binaryBufferDetailed])

    useEffect(() => {
        fetch(`/api/waters?limit=${tableLimit}&page=${tablePage}`).then((resp) => resp.json()).then((data) => {
            setWatersState(data.waters)
            setTotalState(data.total)
            setIsTableLoading(false)
        })
    }, [tableLimit, tablePage])

    const reloadTable = () => {
        setReload(!reload)
    }

    useEffect(() => {
        fetch(`/api/waters?limit=${tableLimit}&page=${tablePage}`).then((resp) => resp.json()).then((data) => {
            setWatersState(data.waters)
            setIsTableLoading(false)
        })
    }, [reload])

    useEffect(() => {
        if (prevTableId !== '') {
            const rowClicked = watersState[(parseInt(prevTableId) - 1) % tableLimit]
            setRowClicked(rowClicked)
            setIsLoading(true)
            const x = rowClicked.centroid_coords[0]
            const y = rowClicked.centroid_coords[1]
            Promise.all([
                fetch(`/api/small-map?x=${x}&y=${y}`),
                fetch('/api/polygon-map', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ polygon: rowClicked?.polygon_coords }),
                })
            ]).then((responses) => {
                responses[0].blob().then((data) => setBinaryBuffer(data))
                responses[1].blob().then((data) => setBinaryBufferDetailed(data))
            })
        }
    }, [watersState])

    const handleOnRowClick = (evt: SyntheticEvent) => {
        const tableId = ((evt.target as HTMLElement)?.parentNode as HTMLTableRowElement)?.cells[0]?.innerText;
        setPrevTableId(tableId)
        const rowClicked = watersState[(parseInt(tableId) - 1) % tableLimit]
        setRowClicked(rowClicked)
        setIsLoading(true)
        const x = rowClicked.centroid_coords[0]
        const y = rowClicked.centroid_coords[1]
        Promise.all([
            fetch(`/api/small-map?x=${x}&y=${y}`),
            fetch('/api/polygon-map', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ polygon: rowClicked?.polygon_coords }),
            })
        ]).then((responses) => {
            responses[0].blob().then((data) => setBinaryBuffer(data))
            responses[1].blob().then((data) => setBinaryBufferDetailed(data))
        })
    }

    const tableChangeHandler = (evt: { pageSize: number, page: number }) => {
        setIsTableLoading(true)
        setTablePage(evt.page)
        setTableLimit(evt.pageSize)
    }
   
    const rows = watersState.map((water: any, index: number) => ({
        index: water.index,
        id: (index + 1) + (tablePage - 1) * tableLimit,
        name: water.name !== "" ? water.name : water.index,
        coordX: Intl.NumberFormat('en', { maximumFractionDigits: 4, maximumSignificantDigits: 7 }).format(water.centroid_coords[0]),
        coordY: Intl.NumberFormat('en', { maximumFractionDigits: 4, maximumSignificantDigits: 7 }).format(water.centroid_coords[1]),
        area: water.area})
    )

    const headers = [
        { key: 'id', header: 'Table ID'},
        { key: 'name', header: 'Name'},
        { key: 'coordY', header: 'Lattitude' },
        { key: 'coordX', header: 'Longitude' },
        { key: 'area', header: 'area (km^2)' }
    ]
    
    return (
        <div className="cds--css-grid">
            <div className="cds--col-span-9 cds--css-grid-column">
                <Heading style={{ "marginBottom": "12px" }}>Water bodies</Heading>
                <WaterTable
                    rows={rows}
                    headers={headers}
                    handleOnRowClick={(evt: SyntheticEvent) => handleOnRowClick(evt)}
                    totalRows={totalState}
                    onTableChange={tableChangeHandler}
                    isTableLoading={isTableLoading}
                />
            </div>
            <div className="cds--col-span-7 cds--css-grid-column">
                <Heading style={{ "marginBottom": "12px" }}>Details</Heading>
                <WaterBodyData
                    name={rowClicked?.name}
                    description={rowClicked?.description}
                    centralCoords={[rowClicked?.centroid_coords?.[0], rowClicked?.centroid_coords?.[1]]}
                    surfaceArea={rowClicked?.area}
                    polygonLength={rowClicked?.polygon_coords?.length}
                    satTimestamp={rowClicked?.timestamp}
                    id={rowClicked?.index}
                    reloadTable={reloadTable}
                />
                <WaterMaps
                    smallMapUrl={polygonImgSrc}
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
    return { props: { waters, total } }
}

export default Waters;