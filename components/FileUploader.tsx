"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from "react-dropzone"
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { uploadFile } from '@/lib/actions/file.actions'
import { usePathname } from 'next/navigation'

interface IProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader: React.FC<IProps> = ({ ownerId, accountId, className }) => {
  const pathname = usePathname()
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    const uploadPromises = acceptedFiles.map(async file => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name))

        return toast({
          description: (
            <p className='body-2 text-white'>
              <span className='font-semibold'>
                {file.name}
              </span> is too large. Max file size is 50MB.
            </p>
          ),
          className: 'error-toast',
        })
      }
      return uploadFile({ file, ownerId, accountId, path: pathname }).then((uploadFile) => {
        if (uploadFile) {
          setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name))
        }
      })
    })
    await Promise.all(uploadPromises)
  }, [ownerId, accountId, pathname])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleRemoveFile = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
    e.stopPropagation()

    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName))

  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='submit' className={cn("uploader-button", className)}>
        <Image src="/assets/icons/upload.svg" alt='upload' width={24} height={24} />
        <p>Uplaod</p>
      </Button>

      {files.length > 0 && (

        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name)
            console.log("type", type, extension);


            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className='flex items-center gap-3'>
                  <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />
                  <div className='preview-item-name'>
                    {file.name}
                    <Image src="/assets/icons/file-loader.gif" alt='loader' width={80} height={26} />
                  </div>
                </div>
                <Image src="/assets/icons/remove.svg" width={24} height={24} alt='remove' onClick={(e) => {
                  handleRemoveFile(e, file.name)
                }} />
              </li>
            )
          })}


        </ul>

      )}

    </div>
  )
}

export default FileUploader