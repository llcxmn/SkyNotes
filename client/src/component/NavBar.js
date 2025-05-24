import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <>
            {/* .navbar-besar */}
            <div className="fixed flex flex-col items-center justify-center w-full gap-1 z-[100]">
                {/* .navbar */}
                <nav className="flex justify-center w-full font-semibold z-[100]">
                    <div className="flex flex-row items-center justify-between w-4/5 p-0 mx-8 overflow-hidden list-none bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 rounded-[20px]">
                        <div className="flex"> {/* .info equivalent for grouping nav links */}
                            <NavLink
                                to="/"
                                className="block px-4 py-[14px] text-center text-white no-underline hover:bg-blue-400"
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/Pricing"
                                className="block px-4 py-[14px] text-center text-white no-underline hover:bg-blue-400" 
                            >
                                Pricing
                            </NavLink>
                            <NavLink
                                to="/" 
                                className="block px-4 py-[14px] text-center text-white no-underline hover:bg-blue-400">
                                Contact
                            </NavLink>
                        </div>

                        {/* .content .login-signup */}
                        <div className="flex items-center mr-8">
                            <NavLink
                                to="/auth"
                                state={{ form: 'login' }}
                                className="px-4 py-0.5 ml-[0.4em] mt-[0.1em] bg-transparent border border-white rounded-[10px] text-white font-bold hover:bg-white hover:text-black cursor-pointer"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/auth"
                                state={{ form: 'register' }}
                                className="px-4 py-0.5 ml-[0.4em] mt-[0.1em] bg-transparent border border-white rounded-[10px] text-white font-bold hover:bg-white hover:text-black cursor-pointer"
                            >
                                Sign Up
                            </NavLink>
                        </div>
                    </div>
                </nav>

                {/* .yellow-navbar */}
                <div className="-mt-1 flex flex-row items-center justify-between bg-[#FFEA00] px-4 ml-[34rem] rounded-bl-[20px] rounded-br-[10px] rounded-tl-none rounded-tr-none w-[25rem] text-[12.71px] font-semibold">
                    <p>
                        Join US! now at a special price
                    </p>
                    <NavLink to="/Pricing" className="no-underline"> 
                        {/* .yellow-navbar .price (div className="price" was implicit) */}
                        <div>
                             {/* .yellow-navbar .price .priceoffer-button */}
                            <button className="mt-1 bg-transparent border border-black rounded-[13px] text-black mb-1.5 text-[12.71px] font-bold px-3 py-1 hover:bg-black hover:text-white cursor-pointer"> {/* Added some padding px-3 py-1 for better appearance */}
                                View plans and pricing
                            </button>
                        </div>
                    </NavLink>
                </div>
            </div>
        </>
    );
}

export default NavBar;