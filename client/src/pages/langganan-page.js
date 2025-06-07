'use client';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getUserScale, upsertUserScale } from '../lib/dynamoDB';

//page pricing
function LanggananPage() {
    const navigate = useNavigate();
    { /* State untuk modal detail pembelian */ }
    const handleBuy = (packageName, packagePrice) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            // Jika user sudah login, langsung ke halaman billing
            navigate('/billing', {
                state: {
                    package: { name: packageName, price: packagePrice }
                }
            });
        } else {
            alert("Please log in or sign up to continue your purchase.");
            navigate('/auth');
        }
    };

    { /* Button start ke login page */ }
    const handleStartFreePlan = () => {
        navigate('/auth');
    }

    return (
        <div className='bg-[#F6FAFE] h-screen'>
            <>  {/* Header */}
                <div className='flex flex-row gap-2 justify-start items-center mx-6 mt-0 pt-6'>
                    <a href='/'>
                        <div class="border border-black rounded-tl-xl rounded-bl-xl rounded-tr-sm rounded-br-sm hover:text-white hover:bg-black transition-colors duration-150"> <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-20">  <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        </div>
                    </a>
                    <div className='flex flex-col gap-0'>
                        <h1 className='text-[1.5rem] font-bold'>Choose Package</h1>
                        <div className='text-[0.8rem] font-semibold'>
                            <p>Hi Skyper, welcome aboard!</p>
                            <p>Please Choose a Package to get Started!</p>
                        </div>
                    </div>
                </div>

                {/* Awan */}
                <div className='w-full h-[150%] px-6 pt-10 flex flex-row gap-8 justify-center items-end bg-[#F6FAFE]'>
                    <div className='flex flex-col h-[70%] w-1/5 overflow-hidden relative rounded-t-[40px] bg-gradient-to-r from-blue-900 via-[#0C68FF] to-[#60A5FA]'>
                        <img src='/Vector Awan.png' alt='bg awan' className='absolute w-full bottom-0 h-[70%] top-[40%] object-cover inset-0' />
                        {/* Stack Paket Langganan*/}
                        <div className='flex flex-col h-1/2 rounded-tl-[40px] rounded-tr-[40px] gap-6 z-10 justify-center items-center'>
                            <div className='text-white flex'>
                                <h1 className='font-extrabold text-[1.6em]'>Free Plan</h1>
                            </div>
                            <div className='flex flex-col text-white justify-center items-center'>
                                <h1 className='font-extrabold text-[1em]'>Gratis</h1>
                                <p className='text-[0.8rem]'>Lifetime</p>
                            </div>
                            <button
                                onClick={handleStartFreePlan}
                                className='px-5 py-1 font-bold bg-yellow-300 rounded-lg hover:bg-white hover:text-black'>
                                Start
                            </button>
                        </div>
                        <div className='h-[60%] relative z-10 flex flex-col justify-center items-center text-center '>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>5</p>
                                <p className='text-sm mb-5'>Sticky Notes per day</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>100</p>
                                <p className='text-sm mb-5'>Sticky Word per note</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>7 Days</p>
                                <p className='text-sm mb-5'>Sticky Cloud storage active</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>2 Color</p>
                                <p className='text-sm mb-5'>Sticky Note themes</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col h-[80%] w-1/5 overflow-hidden relative rounded-t-[40px] bg-gradient-to-r from-purple-900 via-purple-600 to-purple-400'>
                        <img src='/Vector Awan.png' alt='bg awan' className='absolute w-full bottom-0 h-[60%] top-[40%] object-cover inset-0' />
                        <div className='flex flex-col h-[40%] rounded-tl-[40px] rounded-tr-[40px] gap-6 z-10 justify-center items-center'>
                            <div className='text-white flex'>
                                <h1 className='font-extrabold text-[1.6em]'>Stars</h1>
                            </div>
                            <div className='flex flex-col text-white justify-center items-center'>
                                <h1 className='font-extrabold text-[1em]'>Rp10,000</h1>
                                <p className='text-[0.8rem]'></p>
                            </div>
                            <button onClick={() => handleBuy("Stars", "Rp10,000")}
                                className='px-5 py-1 font-bold bg-yellow-300 rounded-lg hover:bg-white hover:text-black'>Buy</button>
                        </div>
                        <div className='h-[60%] relative z-10 flex flex-col justify-center items-center text-center '>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>15</p>
                                <p className='text-sm mb-5'>Sticky Notes per day</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>250</p>
                                <p className='text-sm mb-5'>Word per note</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>30 Days</p>
                                <p className='text-sm mb-5'>Cloud storage active</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>5 Color</p>
                                <p className='text-sm mb-5'>Note themes</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>Auto-Sync Enable</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col h-[90%] w-1/5 overflow-hidden relative rounded-t-[40px] bg-gradient-to-r from-teal-900 via-teal-600 to-teal-400'>
                        <img src='/Vector Awan.png' alt='bg awan' className='absolute w-full h-[62%] bottom-0  top-[38%] inset-0 object-cover' />
                        <div className='flex flex-col h-[40%] rounded-tl-[40px] rounded-tr-[40px] gap-6 z-10 justify-center items-center'>
                            <div className='text-white flex'>
                                <h1 className='font-extrabold text-[1.6em]'>Orbit</h1>
                            </div>
                            <div className='flex flex-col text-white justify-center items-center'>
                                <h1 className='font-extrabold text-[1em]'>Rp25,000</h1>
                                <p className='text-[0.8rem]'></p>
                            </div>
                            <button onClick={() => handleBuy("Orbit", "Rp25,000")}
                                className='px-5 py-1 font-bold bg-yellow-300 rounded-lg hover:bg-white hover:text-black'>Buy</button>
                        </div>
                        <div className='h-[60%] relative z-10 flex flex-col justify-center items-center text-center '>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>50</p>
                                <p className='text-sm mb-5'>Sticky Notes per day</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>500</p>
                                <p className='text-sm mb-5'>Sticky Word per note</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>20 GB</p>
                                <p className='text-sm mb-5'>Cloud storage active</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>10 Color</p>
                                <p className='text-sm mb-5'>Note themes</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>Auto-Sync Enable</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col h-[100%] w-1/5 overflow-hidden relative rounded-t-[40px] bg-gradient-to-r from-red-900 via-red-600 to-red-400'>
                        <img src='/Vector Awan.png' alt='bg awan' className='absolute w-full bottom-0 top-[35%] h-[65%] inset-0 object-cover' />
                        <div className='flex flex-col h-[35%] rounded-tl-[40px] rounded-tr-[40px] gap-6 z-10 justify-center items-center'>
                            <div className='text-white flex'>
                                <h1 className='font-extrabold text-[1.6em]'>Boost</h1>
                            </div>
                            <div className='flex flex-col text-white justify-center items-center'>
                                <h1 className='font-extrabold text-[1em]'>Rp50,000</h1>
                                <p className='text-[0.8rem]'></p>
                            </div>
                            <button onClick={() => handleBuy("Boost", "Rp50,000")}
                                className='px-5 py-1 font-bold bg-yellow-300 rounded-lg hover:bg-white hover:text-black'>Buy</button>
                        </div>
                        <div className='h-[60%] relative z-10 flex flex-col justify-center items-center text-center '>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>Unlimited</p>
                                <p className='text-sm mb-5'>Sticky Notes per day</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>No limit</p>
                                <p className='text-sm mb-5'>Word per note</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>30 Days</p>
                                <p className='text-sm mb-5'>Cloud storage active</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>Full Access</p>
                                <p className='text-sm mb-5'>Note themes</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md font-bold'>Auto-Sync Enable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}

export default LanggananPage;