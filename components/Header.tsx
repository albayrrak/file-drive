import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Search from '@/components/Search'
import FileUploader from '@/components/FileUploader'
import { signOut } from '@/lib/actions/user.actions'

const Header = () => {
    return (
        <div className='header'>
            <Search />

            <div className='header-wrapper'>
                <FileUploader />

                <form action={async () => {
                    "use server"
                    await signOut()
                }}>
                    <Button type='submit' className='sign-out-button'>
                        <Image src={"/assets/icons/logout.svg"} alt='logo' width={24} height={24} className='w-6' />
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Header