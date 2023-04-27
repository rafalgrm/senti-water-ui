import { useState, useEffect } from "react";
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { Grid, Paper, Typography } from "@mui/material";
// import { AreasTable } from "./AreasTable";
// import { AreasTableActions } from "./AreasTableActions";
// import Area from "../data/Area";
 import { NewAreaDialog } from "./NewAreaDialog";
// import { AreaEdit } from "./AreaEdit";
import { createNewAOIInCatalog } from "@/app/utils/MapUtils";

const Map = () => {
    const [map, setMap] = useState(null);
    const [drawnAreas, setDrawnAreas] = useState<Area[] | []>([]);
    const [newArea, setNewArea] = useState<Area | null>(null);
    const [newAreaModalOpen, setNewAreaModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedArea, setEditedArea] = useState<Area | null>(null);
    const [recentLayer, setRecentLayer] = useState(null);
    useEffect(() => {
        if (map) {
            setInterval(function () {
            map.invalidateSize();
            }, 100);
        }
    }, [map]);

    const onAreaCreated = (e: any) => {
        const { layer } = e;
        const { _northEast, _southWest } = layer._bounds;
        const newArea = new Area(
            { lat: _northEast.lat, lng: _northEast.lng },
            { lat: _southWest.lat, lng: _southWest.lng },
            0,
            "Area",
        );
        setNewAreaModalOpen(true);
        setNewArea(newArea);
        setRecentLayer(layer);
    };

    const onAreaAdded = () => {
        if (newArea) {
            setDrawnAreas([...drawnAreas, newArea]);
            setNewAreaModalOpen(false);
            setNewArea(null);
            setIsEditing(true);
            setEditedArea(newArea);
            if (recentLayer) {
                recentLayer.on('click', () => {
                    setEditedArea(newArea);
                    setIsEditing(true);
                });
            }
            setRecentLayer(null);
        }
    };

    const onAreaDiscarded = () => {
        setNewAreaModalOpen(false);
        if (recentLayer) recentLayer.remove();
        setRecentLayer(null);
    };

    const handleEdit = (id: string) => {
        const area = drawnAreas.find((area) => area.id === Number.parseInt(id));
        if (area) {
            setIsEditing(true);
            setEditedArea(area);
        }
    };

    const handleDelete = (id: string) => {
        const area = drawnAreas.find((area) => area.id === Number.parseInt(id));
        if (area) {
            setDrawnAreas(drawnAreas.filter((area) => area.id !== Number.parseInt(id)));
        }
    };

    const handleSubmit = () => {
        createNewAOIInCatalog(drawnAreas, "container-1");
    };


    const position = [51.505, -0.09]

    return (
        <Grid container spacing={2}>
            <NewAreaDialog isOpen={newAreaModalOpen} handleClose={() => onAreaDiscarded()} handleAdd={() => onAreaAdded()} />
            <Grid item xs={8}>
                <Paper>
                    <MapContainer center={position} zoom={20} scrollWheelZoom style={{ height: "820px", width: "100%" }} whenCreated={setMap}>
                        <FeatureGroup>
                            <EditControl
                            position="topright"
                            onEdited={() => {}}
                            onCreated={onAreaCreated}
                            onDeleted={() => {}}
                            onMounted={() => {}}
                            onEditStart={() => {}}
                            onEditStop={() => {}}
                            onDeleteStart={() => {}}
                            onDeleteStop={() => {}}
                            draw={{
                                rectangle: true,
                                circle: false,
                                circlemarker: false,
                                polyline: false,
                                polygon: false,
                                marker: false,
                            }}
                            />
                        </FeatureGroup>
                        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </MapContainer>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Grid container direction="column" spacing={3} style={{ height: "100%" }}>
                    <Grid item>
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1, display: { sm: 'block' } }}>
                            Areas
                        </Typography>
                    </Grid>
                    <Grid item>
                        <AreasTable areas={drawnAreas} onEdit={(id: string) => handleEdit(id)} onDelete={(id: string) => handleDelete(id)} />
                    </Grid>
                    {isEditing && <Grid item>
                        <Paper>
                            <AreaEdit
                                area={editedArea}
                                handleClose={() => { setIsEditing(false) }}
                                handleSave={() => {
                                    setDrawnAreas([...drawnAreas])
                                    setIsEditing(false)
                                }}
                            />
                        </Paper>
                    </Grid>}
                    <Grid item style={{ alignSelf: "flex-end" }}>
                        <AreasTableActions onSubmit={() => handleSubmit()} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
     );
}

export default Map;