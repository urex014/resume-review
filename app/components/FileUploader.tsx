import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"


interface FileUploaderProps {
    onFileSelect?:(file: File|null) => void;
}
function MyDropzone({ onFileSelect }: { onFileSelect?: (file: File | null) => void }) {
    // const [file, setFile] = useState<File | undefined>(undefined)

    function formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(2)} KB`;
        const mb = kb / 1024;
        if (mb < 1024) return `${mb.toFixed(2)} MB`;
        const gb = mb / 1024;
        return `${gb.toFixed(2)} GB`;
    }
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        // setFile(acceptedFiles[0])
        onFileSelect?.(file)
    }, [onFileSelect]);
    const {getRootProps, getInputProps, isDragActive,acceptedFiles} = useDropzone({onDrop,multiple:false,accept:{'application/pdf':['.pdf']},maxSize:20*1024*1024})
    const file = acceptedFiles[0]||null;
    return (
        <div className='w-full gradient-border'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e)=>{e.stopPropagation()}}>
                            <div className="flex items-center space-x-3">
                                <img src="/images/pdf.png" alt="pdf" className="size-10"/>
                                <div>
                                    <p className='text-sm text-gray-700 font-medium max-w-xs truncate'>{file.name}</p>
                                    <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                                    </div>
                            </div>
                            <button className="p-2 cursor-pointer" onClick={(e)=>{
                                onFileSelect?.(null)
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div>
                            <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max 20mb)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const FileUploader = ({onFileSelect}:FileUploaderProps) => {
    return <MyDropzone onFileSelect={onFileSelect} />
}

export default FileUploader