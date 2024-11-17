"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.actions'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { useDebounce } from "use-debounce"

const Search = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get("query") || ""
    const path = usePathname()
    const [query, setQuery] = useState("")
    const [result, setResult] = useState<Models.Document[]>([])
    const [open, setOpen] = useState(false)
    const [debouncedQuery] = useDebounce(query, 300)

    useEffect(() => {
        const fetchFiles = async () => {

            if (debouncedQuery.length === 0) {
                setResult([]);
                setOpen(false)
                return router.push(path.replace(searchParams.toString(), ""))
            }
            const files = await getFiles({ types: [], searchText: debouncedQuery })

            setResult(files.documents)
            setOpen(true)
        }

        fetchFiles()
    }, [debouncedQuery])

    useEffect(() => {

        if (!searchQuery) {
            setQuery("")
        }

    }, [searchQuery])

    const handleClickItem = (file: Models.Document) => {
        setOpen(false);
        setResult([]);

        router.push(`${file.type === "video" || file.type === "audio" ? "media" : file.type + 's'}?query=${query}`)
    }
    return (
        <div className='search'>
            <div className='search-input-wrapper'>
                <Image src={"/assets/icons/search.svg"} alt='' width={24} height={24} />
                <Input type='text' onChange={(e) => setQuery(e.target.value)} className='search-input' placeholder='Search...' />

                {open && (
                    <ul className='search-result'>
                        {result.length > 0 ? (
                            result.map(x => (
                                <li key={x.$id} className=' flex items-center justify-between' onClick={() => handleClickItem(x)}>
                                    <div className='flex max-w-80  cursor-pointer items-center gap-4'>
                                        <Thumbnail type={x.type} extension={x.extension} url={x.url} className='size-9 min-w-9' />
                                        <p className='subtitle-2 line-clamp-1 text-light-100'>
                                            {x.name}
                                        </p>
                                    </div>
                                    <FormattedDateTime date={x.$createdAt} className='caption line-clamp-1 text-light-200' />
                                </li>
                            ))
                        ) : (
                            <p className='empty-result'>No files found</p>
                        )}
                    </ul>
                )

                }
            </div>
        </div>
    )
}

export default Search