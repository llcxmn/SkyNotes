import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getUserScale, upsertUserScale } from '../lib/dynamoDB';

const SuccessToast = ({ message, onClose }) => (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md">
        <div className="bg-yellow-400 text-black font-bold rounded-full shadow-lg flex items-center justify-between p-3">
            <span className="pl-3">{message}</span>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    </div>
);

const SkyNotesLogo = () => (
    <img
        src="/logo fix.png"
        alt="SkyNotes Logo"
        width="200"
        height="200"
        mr="2"
        className="inline-block mr-2"
    />
);

const BillingPage = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil detail paket dari halaman sebelumnya
    const selectedPackage = location.state?.package || { name: 'Unknown', price: 'Rp0' };

    //ini logicnya yg auto ke reset notes setelah subscribe
    const handleSubscription = async () => {
        setIsLoading(true);

        const planNotePerDay = {
            'Free Plan': 5, 'Stars': 15, 'Orbit': 50, 'Boost': 99999
        };
        const planName = selectedPackage.name;
        const notePerDay = planNotePerDay[planName] || 5;

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                let usedThisDay = 0;
                try {
                    const scale = await getUserScale(user.uid);
                    usedThisDay = scale?.used_this_day ? Number(scale.used_this_day) : 0;
                } catch (e) {
                    usedThisDay = 0;
                }
                await upsertUserScale(user.uid, notePerDay, usedThisDay);
            }
        } catch (err) {
            console.error('Failed to update user scaling:', err);
            alert('Gagal memperbarui langganan Anda. Silakan coba lagi.');
            setIsLoading(false);
            return;
        }

        setShowSuccess(true);
        setIsLoading(false);

        setTimeout(() => {
            navigate('/dashboard');
        }, 2500);
    };

    const formatToRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    const priceNumber = parseInt(selectedPackage.price.replace(/[^0-9]/g, ''), 10) || 0;
    const tax = priceNumber * 0.10;
    const subTotal = priceNumber + tax;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
            {showSuccess && (
                <SuccessToast
                    message="You Subscribed!!!"
                    onClose={() => setShowSuccess(false)}
                />
            )}
            <div className="w-full max-w-6xl mx-auto p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-lg overflow-hidden">

                    {/* Kolom Kiri */}
                    <div className="bg-white p-8 md:p-12">
                        <h1 className="text-3xl font-bold text-gray-800 mb-8">Billing</h1>

                        <form>
                            {/* Email Account */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email-account">
                                    Email account
                                </label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="email-account"
                                    type="email"
                                    placeholder="Email"
                                />
                            </div>

                            {/* Card Details */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="card-number">
                                    Card details
                                </label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="card-number"
                                    type="text"
                                    placeholder="1234 5678 9123 4567"
                                />
                                <div className="flex space-x-4 mt-4">
                                    <input
                                        className="w-1/2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        placeholder="MM/YY"
                                    />
                                    <input
                                        className="w-1/2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        placeholder="CVV"
                                    />
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div className="mb-8">
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="billing-email">
                                    Billing address
                                </label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="billing-email"
                                    type="email"
                                    placeholder="Email"
                                />
                                <div className="flex space-x-4">
                                    <input
                                        className="w-1/2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        placeholder="Zipcode"
                                    />
                                    <div className="relative w-1/2">
                                        <select className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>State</option>
                                            <option>Indonesia</option>
                                            <option>Japan</option>
                                            <option>Korea</option>
                                            <option>England</option>
                                            <option>Arab</option>
                                            <option>Germany</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Information Checkbox */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="save-info" aria-describedby="save-info-description" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="save-info" className="font-medium text-gray-900">Securely save my information for 1-click checkout</label>
                                    <p id="save-info-description" className="text-xs text-gray-500">Quickly pay anywhere the link is accepted</p>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Kolom Kanan*/}
                    <div className="bg-gradient-to-r from-blue-900 via-[#0C68FF] to-[#60A5FA] text-white p-8 md:p-12 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-center items-center mb-10 ">
                                <SkyNotesLogo />
                            </div>

                            <p className="text-white text-lg mb-3">
                                <span>Subscribe to </span>
                                <span className="font-bold text-white">{selectedPackage.name}</span>
                            </p>
                            <div className="bg-[#F6F6F6]/10 bg-opacity-50 rounded-lg p-4 mb-8 border border-white">
                                <p className="text-3xl font-bold">{formatToRupiah(priceNumber)}</p>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between text-lg">
                                    <span className="text-white">Tax 10%</span>
                                    <span>{formatToRupiah(tax)}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-white">Discount</span>
                                    <span className="flex mr-10">-</span>
                                </div>
                                <hr className="border-white my-6" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Sub total</span>
                                    <span>{formatToRupiah(subTotal)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleSubscription}
                                disabled={isLoading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white border border-white py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? 'Processing...' : 'Subscribed'}
                            </button>
                            <p className="text-center text-xs text-white/80 mt-3">Confirming your subscription authorizes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;