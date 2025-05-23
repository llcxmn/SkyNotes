    import NavBar from '../component/NavBar';
    import FooterLandingPage from '../component/footer-landing-page';

    export default function LandingPage() {
    return (
        <>
            <div className="pt-6"> {/* .LandingPage */}
                <header className="sticky top-0 z-10 flex w-full"> {/* header */}
                    <NavBar />
                </header>
                <main className="relative m-0 flex-1 overflow-hidden"> {/* main */}
                    <img src='/Kotak Kotak Bawah.png' alt='Background Image' className='absolute bottom-0 left-0 block w-full p-0 opacity-50 z-[-1]' /> {/* .background-image */}

                    <div className="mt-[10%] flex flex-col items-center justify-center"> {/* .MainContent */}
                        <div className="flex w-full flex-row items-center justify-center gap-[80px]"> {/* .atas-MainContent */}
                            <div className="m-auto ml-[4%] flex w-1/2 flex-col p-3"> {/* .atas-MainContent .notes-MainContent */}
                                <h1 className="m-0 text-[3.5rem] font-extrabold">Notes for Everyone!</h1> {/* .atas-MainContent .notes-MainContent h1 */}
                                <p className="ml-[0.1em] max-w-[70%] text-sm font-medium text-justify"> {/* .atas-MainContent .notes-MainContent p */}
                                SkyNote is a fast cloud-based note-taking platform that allows users to create personal 
                                or collaborative notes with friends. With a simple interface and easy access from various devices, 
                                SkyNote helps you capture ideas, tasks, and collaborate seamlessly.
                                </p>
                            </div>
                            <div className="mr-[6%] flex items-center justify-center rounded-[50px] bg-gradient-to-r from-blue-900 via-[#0C68FF] to-blue-400 px-[0.3rem] py-2"> {/* .atas-MainContent .gambar-logoMC */}
                                <img src='/logo fix.png' alt='Logo Image' className='h-[80%] w-[70%]' /> {/* .atas-MainContent img */}
                            </div>
                        </div>
                        
                        <div className="flex w-full flex-row items-center justify-between"> {/* .bawah-MainContent */}
                            <div className="gambar-notes">
                                <img src='/Logo-notes-rev.png' alt='Notes Image' className='m-20 mt-30 h-[60%] w-[70%]' /> {/* .bawah-MainContent img (dalam .gambar-notes) */}
                            </div>
                            <div className="mr-[5%] flex w-[20%] flex-col items-center justify-center gap-3"> {/* .bawah-MainContent .stack-paket */}
                                <div className="mb-[-20%] flex w-full flex-col items-center justify-center rounded-tl-[50px] rounded-tr-[50px] bg-blue-50 px-0 pb-24 pt-12"> {/* .bawah-MainContent .stack-paket1 */}
                                    <h1 className="m-0 bg-gradient-to-r from-blue-900 via-[#0C68FF] to-blue-400 bg-clip-text text-5xl font-bold text-transparent">Boost</h1> {/* .bawah-MainContent .stack-paket1 h1 */}
                                    <h2 className="m-0 bg-gradient-to-r from-blue-900 via-[#0C68FF] to-blue-400 bg-clip-text text-center text-2xl font-bold text-transparent">Rp50,000</h2> {/* .bawah-MainContent .stack-paket1 h2 */}
                                    <p className="m-0 bg-gradient-to-r from-blue-900 via-[#0C68FF] to-blue-400 bg-clip-text text-center text-base font-normal text-transparent">/ month</p> {/* .bawah-MainContent .stack-paket1 p */}
                                </div>
                                <div className="mb-[-20%] flex w-full flex-col items-center justify-center rounded-tl-[50px] rounded-tr-[50px] bg-blue-100 px-0 pb-24 pt-12"> {/* .bawah-MainContent .stack-paket2 */}
                                    <h1 className="m-0 bg-gradient-to-r from-blue-900 via-[#0C68FF] to-blue-400 bg-clip-text text-5xl font-bold text-transparent">Orbit</h1> {/* .bawah-MainContent .stack-paket2 h1 */}
                                    <h2 className="m-0 bg-gradient-to-r from-blue-900 via-[#0C68FF] to-blue-400 bg-clip-text text-center text-2xl font-bold text-transparent">Rp25,000</h2> {/* .bawah-MainContent .stack-paket2 h2 */}
                                    <p className="m-0 bg-gradient-to-r from-blue-900 via-[#0C68FF] to-blue-400 bg-clip-text text-center text-base font-normal text-transparent">/ month</p> {/* .bawah-MainContent .stack-paket2 p */}
                                </div>
                                <div className="mb-[-30%] flex w-full flex-col items-center justify-center rounded-tl-[50px] rounded-tr-[50px] bg-blue-400 px-0 pb-24 pt-12 text-white"> {/* .bawah-MainContent .stack-paket3 */}
                                    <h1 className="m-0 text-[2.5rem] font-bold">Stars</h1> {/* .bawah-MainContent .stack-paket3 h1 */}
                                    <h2 className="m-0 text-center text-base font-bold">Rp10,000</h2> {/* .bawah-MainContent .stack-paket3 h2 */}
                                    <p className="m-0 text-center text-base font-normal">/ month</p> {/* .bawah-MainContent .stack-paket3 p */}
                                </div>
                                <div className="flex w-full items-center justify-center rounded-bl-[20px] rounded-br-[20px] rounded-tl-[50px] rounded-tr-[50px] bg-blue-700 py-[1rem] text-white"> {/* .bawah-MainContent .stack-paket4 */}
                                    <h1 className="font-bold text-[2rem]">Free</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <footer>
                    <FooterLandingPage />
                </footer>
            </div>
        </>
    )
}