import React from "react";
import {useTranslation} from "react-i18next";

const RecordingsActionCell = ({ row }) => {
    const { t } = useTranslation();

    //TODO: styled components for links if icons not loaded
    return (
        <>
            {/*TODO: When recording details are implemented, remove placeholder */}
            {/*TODO: with-Role */}
            <a className="more"
               title={t('RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DETAILS')}
               onClick={() => onClickPlaceholder()}/>

            {/*TODO: When action for deleting is implemented, remove placeholder */}
            {/*TODO: with-Role */}
            <a className="remove"
               title={t('RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DELETE')}
               onClick={() => onClickPlaceholder()}/>
        </>
    )
}

//todo: remove if not needed anymore
const onClickPlaceholder = () => {
    console.log("In the Future here opens an other component, which is not implemented yet");
}

export default RecordingsActionCell;