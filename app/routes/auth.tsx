import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter'

export const meta=()=>([
    {title:'Connected | Auth'},
    {name:'description', content:'Log into your account '},
])
const auth = () => {
    const {isLoading,auth} = usePuterStore();
    const location = useLocation();
    const next=location.search.split('next=')[1]
    const navigate=useNavigate();
    useEffect(()=>{
        if(auth.isAuthenticated)navigate(next)
    }), [auth.isAuthenticated,next]
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
        <div className='gradient-border shadow-lg'>
            <section className='flex flex-col gap-8 items-center text-center bg-white rounded-2xl p-10'>
                <div>
                    <h1>Welcome</h1>
                    <h2>Log in to find jobs that suite your preference.</h2>
                </div>
                <div>
                    {isLoading?(
                        <button className='auth-button animate-pulse'>
                            <p>backend magic...</p>
                        </button>
                    ):(
                        <>
                            {auth.isAuthenticated?(
                                <button className='auth-button' onClick={auth.signOut}><p>Log out</p></button>
                            ):(
                                <button className='auth-button' onClick={auth.signIn}><p>Log in</p></button>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    </main>
  )
}

export default auth