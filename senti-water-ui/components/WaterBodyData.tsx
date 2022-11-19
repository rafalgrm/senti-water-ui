import { Tile } from "@carbon/react"
import styles from "../styles/WaterBody.module.scss"

type WaterBodyDataProps = {
    name: string,
    description: string,
    centralCoords: number[],
    surfaceArea: number,
    satTimestamp: string,
    polygon: [x: number, y: number][]
};

const invalidFormatString = <div style={{ color: "red"}}>Invalid format</div>

const centralCoordsToString = (coords: number[]) => {
    if (coords && coords.length === 2) {
        return `${coords[0]}, ${coords[1]}`
    }
    return invalidFormatString
}

const areaToString = (area: number) => {
    if (area !== undefined) {
        return Intl.NumberFormat('en', { maximumFractionDigits: 3, maximumSignificantDigits: 4 }).format(area)
    }
    return invalidFormatString
}

const WaterBodyData = ({
    name,
    description,
    centralCoords,
    surfaceArea,
    satTimestamp,
    polygon
}: WaterBodyDataProps) => {
    return (
        <div style={{
            "display": "flex",
            "flexDirection": "row",
            "width": "100%",
            "alignItems": "stretch",
            "justifyContent": "space-between"
        }}>
            <Tile light style={{ "flex": 1, "marginRight": "8px" }}>
                <div className={styles.dataLabel}>Name</div>
                <div>{name}</div>
                <div className={styles.dataLabel}>Description</div>
                <div>{description}</div>
            </Tile>
            <Tile light style={{ "flex": 1, "marginRight": "8px" }}>
                <div className={styles.dataLabel}>Centroid coordinates</div>
                <div>{centralCoordsToString(centralCoords)}</div>
                <div className={styles.dataLabel}>Surface area</div>
                <div>{areaToString(surfaceArea)}</div>
                <div className={styles.dataLabel}>Satellite data timestamp</div>
                <div>{satTimestamp}</div>
                <div className={styles.dataLabel}>Polygon length</div>
                <div>TODO</div>
            </Tile>
        </div>
      
    );
}

export default WaterBodyData;