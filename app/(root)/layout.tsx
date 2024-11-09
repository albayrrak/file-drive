import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'

interface IProps {
    children: React.ReactNode
}
const Layout: React.FC<IProps> = async ({ children }) => {
    const currentUser = await getCurrentUser()

    if (!currentUser) return redirect("/sign-in")

    return (
        <main className='flex h-screen'>
            <Sidebar email={currentUser.email} fullName={currentUser.fullName} />

            <section className='flex h-full flex-1 flex-col'>
                <MobileNavigation  {...currentUser} />
                <Header />
                <div className='main-content'>
                    {children}
                </div>
            </section>
        </main>
    )
}

export default Layout