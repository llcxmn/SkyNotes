'use client';
import { ChevronLeft} from 'lucide-react';
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getUserScale, upsertUserScale } from '../lib/dynamoDB';

//pop up
const IconX = ({ size = 24, className = "" }) => (
<svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
);

function Modal({ open, onClose, children, title }) {
if (!open) return null; 
return (
    // Backdrop
    <div
    onClick={onClose} 
    className={`
        fixed inset-0 flex justify-center items-center transition-colors z-50
        ${open ? "visible bg-black/50 backdrop-blur-sm" : "invisible"}
    `}
    >
    <div
        onClick={(e) => e.stopPropagation()} 
        className={`
        bg-white rounded-xl shadow-2xl p-6 transition-all max-w-md w-11/12 sm:w-full
        ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
    >
        <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title || "Konfirmasi"}</h3>
        <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
        >
            <IconX size={20} />
        </button>
        </div>
        <div>{children}</div>
    </div>
    </div>
);
}

//page pricing
function LanggananPage() {
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedPackage, setSelectedPackage] = useState({ name: "", price: "" });
const [showThankYou, setShowThankYou] = useState(false);
const navigate = useNavigate();

const handleOpenModal = (packageName, packagePrice) => {
    setSelectedPackage({ name: packageName, price: packagePrice });
    setIsModalOpen(true);
};

const handleCloseModal = () => {
    setIsModalOpen(false);
};

const handleConfirmSubscription = async () => {
    // Map package to note_per_day
    const planNotePerDay = {
        'Free Plan': 5,
        'Stars': 15,
        'Orbit': 50,
        'Boost': 99999 // Unlimited, use a very high number
    };
    const planName = selectedPackage.name;
    const notePerDay = planNotePerDay[planName] || 5;
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            // Fetch current used_this_day to avoid resetting it
            let usedThisDay = 0;
            try {
                const scale = await getUserScale(user.uid);
                usedThisDay = scale && scale.used_this_day ? Number(scale.used_this_day) : 0;
            } catch (e) {
                // fallback to 0 if error
                usedThisDay = 0;
            }
            await upsertUserScale(user.uid, notePerDay, usedThisDay);
        }
    } catch (err) {
        console.error('Failed to update user scaling:', err);
        alert('Failed to update your subscription scaling. Please try again.');
    }
    handleCloseModal(); 
    setShowThankYou(true);
};

const handleStartFreePlan = () => {
    navigate('/auth');
}

    return(
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
                        <div className='flex flex-col'>
                            <p className='text-md font-bold'>Collaboration support</p>
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
                        <button onClick={() => handleOpenModal("Stars", "Rp10,000")}
                        className='px-5 py-1 font-bold bg-yellow-300 rounded-lg hover:bg-white hover:text-black'>Subscribe</button>
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
                            <p className='text-md font-bold'>up to 3 users</p>
                            <p className='text-sm mb-5'>Collaboration support</p>
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
                        <button onClick={() => handleOpenModal("Orbit", "Rp25,000")}
                        className='px-5 py-1 font-bold bg-yellow-300 rounded-lg hover:bg-white hover:text-black'>Subscribe</button>
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
                            <p className='text-md font-bold'>up to 10 users</p>
                            <p className='text-sm mb-5'>Collaboration support</p>
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
                        <button onClick={() => handleOpenModal("Boost", "Rp50,000")}
                        className='px-5 py-1 font-bold bg-yellow-300 rounded-lg hover:bg-white hover:text-black'>Subscribe</button>
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
                            <p className='text-md font-bold'>Unlimited</p>
                            <p className='text-sm mb-5'>Collaboration support</p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-md font-bold'>Auto-Sync Enable</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
        {/* Modal render*/}
        <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            title={`Confirm your package: ${selectedPackage.name}`}
        >
            <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
                You will subscribe to the  
                <strong> {selectedPackage.name} Package </strong> for <strong>{selectedPackage.price}</strong>. Continue?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                onClick={handleConfirmSubscription}
                >
                Yes, Subscribe
                </button>
                <button
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
                onClick={handleCloseModal}
                >
                Cancel
                </button>
            </div>
            </div>
        </Modal>

        <Modal
        open={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank You!"
        >
        <div className="text-center ">
            <p className="text-sm text-gray-600 mb-6">
            You've successfully subscribed to the <strong>{selectedPackage.name}</strong> package.
            </p>
</div>
</Modal>
        </div>
    )
}

export default LanggananPage;