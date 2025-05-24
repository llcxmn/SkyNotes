import { Copyright } from 'lucide-react';
import { NavLink } from "react-router-dom";

function FooterLandingPage() {
    return (
        <>
            <div className="flex flex-col w-full -mt-[50px]"> {/* .all-footer */}
                <div className="flex justify-start text-xl font-bold"> {/* .yellow-navbar-footer */}
                    <p className="bg-[#FFEA00] py-2 px-20 m-0 rounded-tr-[20px] relative"> {/* .yellow-navbar-footer p -*/}
                        Join Now!
                    </p>
                </div>
                <div className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 text-white"> {/* .footer-besar */}
                    <footer className="flex justify-center items-center flex-col z-10"> {/* footer HTML element styles & z-index */}
                        <NavLink
                            to="/Pricing"
                            className="bg-white rounded-[54.31px] border border-white text-black text-xl py-2 px-4 font-semibold mt-8 hover:bg-black hover:border-black hover:text-white cursor-pointer" 
                        >
                                Start for FREE!
                        </NavLink>
                        <div className="flex justify-center items-center font-semibold text-[11.75px] mt-7"> {/* .footer-copyright - Added mt-4 for spacing, adjust as needed */}
                            <p className="text-white font-medium"> {/* .footer-copyright .copyright */}
                                Copyright 2025 <Copyright className='relative -top-[3px] inline-block' /> SkyNotes Group. All rights reserved. {/* .logo - added inline-block for proper alignment with text */}
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default FooterLandingPage;