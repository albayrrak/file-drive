import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Search from '@/components/Search'
import FileUploader from '@/components/FileUploader'
import { signOut } from '@/lib/actions/user.actions'

const Header = ({ userId, accountId }: { userId: string; accountId: string }) => {
    return (
        <div className='header'>
            <Search />

            <div className='header-wrapper'>
                <FileUploader accountId={accountId} ownerId={userId} />

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