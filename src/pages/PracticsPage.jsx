import { MenuIcon } from "lucide-react";
import PracticsNavbar from "../components/practics/PracticsNavbar";
import { createContext, useContext, useEffect, useState } from "react";
import { CgClose, CgProfile } from "react-icons/cg";
import ProductCard from "../components/practics/ProductCard";
import { fetchProducts } from "../features/practics/api/practicsService";


const DrawerContext = createContext(null);

export default function PracticsPage() {
    const [drawer, setDrawer] = useState(false);
    const [data, setData] = useState({ products: [], total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);
    return (
        <div className='min-h-screen w-full relative'>
            <PracticsNavbar />
            <div className="flex items-center w-full bg-text-heading h-10">
                <div className="flex items-center pl-1 gap-1">
                    <MenuIcon className="text-surface" onClick={() => setDrawer(!drawer)} />
                    <span className="text-surface">All</span>
                </div>
                {
                    drawer && (
                        <DrawerContext value={{ drawer, setDrawer }}>
                            < SideBar />
                        </DrawerContext>
                    )
                }
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : (
                <ProductList data={data} />
            )}
        </div>
    )
}



function SideBar() {
    const { drawer, setDrawer } = useContext(DrawerContext);
    return (
        <div
            className={`absolute z-10 bg-text-heading w-[40%] inset-y-0 left-0 min-w-80 text-surface shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawer ? "translate-x-0" : "-translate-x-full"
                } shadow-2xl shadow-text-heading overflow-y-auto`}>

            <div className="flex items-center p-4 justify-between  border-b border-text-main">
                <div className="flex items-center gap-2 text-xl">
                    <CgProfile className="cursor-pointer" />
                    <span className="text-lg font-semibold">Hello,Subrata</span>
                </div>
                <button
                    onClick={() => { setDrawer(!drawer) }}
                    className="p-1 bg-surface rounded-lg hover:bg-border transition-colors focus:outline-none">
                    <CgClose className="text-text-heading" />
                </button>
            </div>
            <div className="bg-surface flex flex-col flex-1 items-start text-text-heading pl-7 py-4">
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-text-heading text-lg px-2">Trending</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Bestsellers
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            New Releases
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-text-heading text-lg px-2">Digital Content and Devices</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Echo & Alexa
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Fire TV
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Kindle E-Readers & eBooks
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Audible Audiblebooks
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Amazon Prime Video
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Amazon Music
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-text-heading text-lg px-2">Shop by Category</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Mobiles, Compuers
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            TV, Appliances, Electronics
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Men's Fashion
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Women's Fashion
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            See all
                        </button>

                    </div>
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-text-heading text-lg px-2">Programs & Features</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Gift Cards & Mobile Recharges
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Amazon Launchpad
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Amazon Business
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Handloom and Handicrafts
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            See all
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <h1 className="font-bold text-text-heading text-lg px-2">Help & Settings</h1>
                    <div className="flex flex-col items-start gap-1 w-full pr-4">
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Your Account
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Customer Service
                        </button>
                        <button className="font-sans text-left w-full px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-canvas text-text-main hover:text-text-heading">
                            Sign Out
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}



function ProductList({ data }) {
    // Safe fallbacks to prevent crashes
    const productItems = data?.products || [];
    const totalCount = data?.total || 0;

    return (
        <div className="min-h-screen bg-canvas py-10 px-4 sm:px-6 lg:px-8 dark:bg-text-heading">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-text-heading dark:text-surface sm:text-3xl">
                        Featured Products
                    </h2>
                    <span className="text-sm font-medium text-text-muted dark:text-text-muted">
                        Showing {productItems.length} of {totalCount} items
                    </span>
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8">
                    {productItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
