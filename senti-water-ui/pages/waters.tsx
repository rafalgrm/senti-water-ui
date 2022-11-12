import { SyntheticEvent, useEffect, useState } from 'react';
import WaterTable from "../components/WaterTable";
import { loadWaters } from "../lib/load-waters";

const handleOnRowClick = (evt: SyntheticEvent, setBinaryBuffer: (resp: any) => void) => {
  const x = ((evt.target as HTMLElement)?.parentNode as HTMLTableRowElement)?.cells[1]?.innerText;
  const y = ((evt.target as HTMLElement)?.parentNode as HTMLTableRowElement)?.cells[2]?.innerText;
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
   
    const rows = waters.map((water: any) => ({ id: water.index.toString(), coordX: water.coords[0], coordY: water.coords[1] }))
    const headers = [{ key: 'id', header: 'DB ID'}, { key: 'coordX', header: 'X' }, { key: 'coordY', header: 'Y' }]
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