import { TextInput, TextArea, Button, Tile } from "@carbon/react"
import { useState } from "react";
import styles from "../styles/WaterBody.module.scss"

const WaterBodyEditableData = ({
    name,
    description,
    onSaveClick,
}: any) => {

    const [nameField, setNameField] = useState(name)
    const [descriptionField, setDescriptionField] = useState(description)

    const handleSaveClick = (evt) => {
        onSaveClick(nameField, descriptionField)
    }

    return (
        <Tile light style={{ "flex": 1, "marginRight": "8px" }}>
            <div className={styles.dataLabel}>Name</div>
            <TextInput onChange={(evt) => setNameField(evt.target.value)} />
            <div className={styles.dataLabel}>Description</div>
            <TextArea onChange={(evt) => setDescriptionField(evt.target.value)} />
            <div>
                <Button kind="ghost" size="sm">Cancel</Button>
                <Button size="sm" onClick={handleSaveClick}>Save</Button>
            </div>
            
        </Tile>
    );
}

export default WaterBodyEditableData;