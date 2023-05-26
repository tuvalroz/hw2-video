import React, { useState } from "react";

export const Upload: React.FC<{ setFormData: (formData: FormData) => void }> = ({ setFormData }) => {
    const [hasVideo, setHasVideo] = useState(false);

    const uploadHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const formData = new FormData();
        const file = event.target.files?.[0];
        formData.append('inputFile', file ?? new File([], 'empty-file', { type: 'text/plain' }));
        setFormData(formData);
        setHasVideo(true);
    }

    return (<input type="file" onChange={uploadHandler} disabled={hasVideo} />)
}