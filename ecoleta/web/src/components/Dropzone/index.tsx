import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface FileUploaded {
    onFileUploaded: (file: File) => void,
}

const Dropzone: React.FC<FileUploaded> = ({ onFileUploaded }) => {
    const [selectedImageUrl, setSelectedImageUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const image = acceptedFiles[0];

        const imageUrl = URL.createObjectURL(image);

        setSelectedImageUrl(imageUrl);
        
        onFileUploaded(image);
    }, [onFileUploaded]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    return (
        <div className="dropzone" {...getRootProps()} >
            <input {...getInputProps()} accept="image/*" />
            {
                selectedImageUrl
                    ? <img src={selectedImageUrl} alt="Point thumbnail" />
                    : (
                        <p>
                            <FiUpload />
                            Imagem do estabelecimento
                        </p>
                    )
            }
        </div>
    );
};

export default Dropzone;