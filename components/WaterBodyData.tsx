import { Tile, Button } from "@carbon/react"
import { useState } from "react";
import styles from "../styles/WaterBody.module.scss"
import WaterBodyEditableData from "./WaterBodyEditableData";

type WaterBodyDataProps = {
    name: string,
    description: string,
    centralCoords: number[],
    surfaceArea: number,
    satTimestamp: string,
    polygonLength: number,
    id: string,
    reloadTable: any
};

const invalidFormatString = <div style={{ color: "red"}}>Invalid format</div>

const centralCoordsToString = (coords: number[]) => {
    if (coords && coords.length === 2) {
        return `${Intl.NumberFormat('en', { maximumFractionDigits: 6, maximumSignificantDigits: 5 }).format(coords[1])}°N, ` +
                `${Intl.NumberFormat('en', { maximumFractionDigits: 6, maximumSignificantDigits: 5 }).format(coords[0])}°E`
    }
    return invalidFormatString
}

const areaToString = (area: number) => {
    if (area !== undefined) {
        return Intl.NumberFormat('en', { maximumFractionDigits: 3, maximumSignificantDigits: 4 }).format(area) + " km²"
    }
    return invalidFormatString
}

const WaterBodyData = ({
    name,
    description,
    centralCoords,
    surfaceArea,
    satTimestamp,
    polygonLength,
    id,
    reloadTable,
}: WaterBodyDataProps) => {

    const [waterBodyEditMode, setWaterBodyEditMode] = useState(false)

    const onSaveClick = (name: string, description: string) => {
        fetch(`/api/edit-waters?id=${id}&name=${name}&description=${description}`).then((response) => {
            console.log(response)
            setWaterBodyEditMode(false)
            reloadTable()
        })
    }

    const changeEditMode = (evt) => {
        setWaterBodyEditMode(!waterBodyEditMode)
    }

    return (
        <div style={{
            "display": "flex",
            "flexDirection": "row",
            "width": "100%",
            "alignItems": "stretch",
            "justifyContent": "space-between"
        }}>
            {
                waterBodyEditMode ?
                <WaterBodyEditableData
                    changeEditMode={changeEditMode}
                    onSaveClick={onSaveClick}
                    name={name}
                    description={description}
                /> :
                <Tile light style={{ "flex": 1, "marginRight": "8px" }}>
                    <div className={styles.dataLabel}>Name</div>
                    <div>{name}</div>
                    <div className={styles.dataLabel}>Description</div>
                    <div>{description}</div>
                    <Button size="sm" onClick={changeEditMode}>Edit</Button>
                </Tile>
            }
            <Tile light style={{ "flex": 1, "marginRight": "8px" }}>
                <div className={styles.dataLabel}>Centroid coordinates</div>
                <div>{centralCoordsToString(centralCoords)}</div>
                <div className={styles.dataLabel}>Surface area</div>
                <div>{areaToString(surfaceArea)}</div>
                <div className={styles.dataLabel}>Satellite data timestamp</div>
                <div>{satTimestamp || "Not set"}</div>
                <div className={styles.dataLabel}>Polygon length</div>
                <div>{polygonLength}</div>
            </Tile>
        </div>
    );
}

export default WaterBodyData;