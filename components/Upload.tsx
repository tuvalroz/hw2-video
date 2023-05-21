import React from "react";

export const Upload: React.FC<{ setFormData: (formData: FormData) => void }> = ({ setFormData }) => {
    const uploadHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const formData = new FormData();
        const file = event.target.files?.[0];
        formData.append('inputFile', file ?? new File([], 'empty-file', { type: 'text/plain' })); 
        setFormData(formData);
    }

    return (<input type="file" onChange={uploadHandler} />)
}