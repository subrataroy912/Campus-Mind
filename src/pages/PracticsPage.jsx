import { MenuIcon } from "lucide-react";
import PracticsNavbar from "../components/practics/PracticsNavbar";
import { createContext, useContext, useState } from "react";
import { CgClose, CgProfile } from "react-icons/cg";


const DrawerContext = createContext(null);

export default function PracticsPage() {
    const [drawer, setDrawer] = useState(false);
    return (
        <div className='min-h-screen w-full relative'>
            <PracticsNavbar />
            <div className="flex items-center w-full bg-gray-800 h-10">
                <div className="flex items-center pl-1 gap-1">
                    <MenuIcon color="white" onClick={() => setDrawer(!drawer)} />
                    <span className="text-white">All</span>
                </div>
                {
                    drawer && (
                        <DrawerContext value={{ drawer, setDrawer }}>
                            < SideBar />
                        </DrawerContext>
                    )
                }
            </div>
        </div>
    )
}



function SideBar() {
    const { drawer, setDrawer } = useContext(DrawerContext);
    return (
        <div
            className={`absolute z-10 bg-gray-800 w-[40%] inset-y-0 left-0 min-w-80 text-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawer ? "translate-x-0" : "-translate-x-full"
                } shadow-2xl shadow-black overflow-y-auto`}>

            <div className="flex items-center p-4 justify-between  border-b border-gray-700">
                <div className="flex items-center gap-2 text-xl">
                    <CgProfile className="cursor-pointer" />
                    <span className="text-lg font-semibold">Hello,Subrata</span>
                </div>
                <button
                    onClick={() => { setDrawer(!drawer) }}
                    className="p-1 bg-white rounded-lg hover:bg-gray-300 transition-colors focus:outline-none">
                    <CgClose color="black" />
                </button>
            </div>
            <div className="bg-white flex flex-col flex-1 items-start text-black pl-7 py-4">
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-gray-900 text-lg px-2">Trending</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Bestsellers
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            New Releases
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-gray-900 text-lg px-2">Digital Content and Devices</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Echo & Alexa
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Fire TV
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Kindle E-Readers & eBooks
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Audible Audiblebooks
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Amazon Prime Video
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Amazon Music
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-gray-900 text-lg px-2">Shop by Category</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Mobiles, Compuers
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            TV, Appliances, Electronics
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Men's Fashion
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Women's Fashion
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            See all
                        </button>

                    </div>
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-gray-900 text-lg px-2">Programs & Features</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Gift Cards & Mobile Recharges
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Amazon Launchpad
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Amazon Business
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Handloom and Handicrafts
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            See all
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-gray-900 text-lg px-2">Help & Settings</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Your Account
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Customer Service
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 text-gray-700 hover:text-black">
                            Sign Out
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
