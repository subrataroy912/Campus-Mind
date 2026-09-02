import { MapPin } from 'lucide-react'
import { BiCaretDown, BiSearch } from 'react-icons/bi'
import { IoCartOutline } from 'react-icons/io5'
import { Link } from 'react-router'
import NavbarItems from "../practics/NavbarItems"
export default function PracticsNavbar() {
    const isLogined = false;

    return (
        <header className='py-1.5 px-4 shadow-2xl bg-gray-900 text-white'>
            <div className=' max-w-6xl mx-auto flex justify-between items-center gap-4 '>
                <div className='flex items-center gap-3'>
                    <span className='font-bold font-sans tracking-tight text-xl'>
                        Amazon<span className='text-[13px]'>
                            .in
                        </span>
                    </span>
                    <div className='items-center text-white hidden md:flex'>
                        <MapPin size={18} color='white' />
                        <div
                            className="flex items-center gap-1.5 p-1.5 border border-transparent rounded-sm cursor-pointer hover:border-gray-300 transition-all duration-200"
                            role="button"
                            tabIndex={0}
                            aria-label="Update delivery location"
                        >

                            <div className="flex flex-col text-left">
                                <span className="text-[11px] text-white font-medium leading-none mb-1">
                                    Deliver to Subrata
                                </span>
                                <span className="text-xs font-bold text-white leading-none">
                                    Jalpaiguri 735101
                                </span>
                            </div>

                            <BiCaretDown className="text-gray-500 mt-3" />
                        </div>


                    </div>
                </div>

                <form
                    className="flex flex-1 items-center max-w-2xl bg-white border-2 border-gray-200 rounded-md overflow-hidden focus-within:border-blue-500 transition-colors duration-200"
                    onSubmit={(e) => e.preventDefault()}
                >

                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        className="w-full flex-1 px-3 py-1.5 text-sm text-gray-900 outline-none bg-transparent placeholder-gray-500"
                        aria-label="Search input"
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 transition-colors duration-200 flex items-center justify-center"
                        aria-label="Submit search"
                    >
                        <BiSearch className="text-xl" />
                    </button>
                </form>

                <div className='flex gap-3 items-center'>
                    <nav className='hidden md:block'>
                        <ul className='flex gap-2 items-center font-medium text-white'>
                            <NavbarItems to={"/practics/"} name={"Home"} />
                            <NavbarItems to={"/practics/features"} name={"Features"} />
                            <NavbarItems to={"/practics/about"} name={"About"} />
                        </ul>
                    </nav>

                    <div className='flex items-center gap-4'>
                        <Link
                            to="/practics/cart"
                            className='relative'>
                            <IoCartOutline
                                className='w-6 h-6' />
                            <span
                                className='bg-red-500 absolute min-w-4 h-4 px-1 flex items-center justify-center rounded-full -top-2 -right-2 text-white text-[10px] font-bold shadow-sm'
                            >
                                10
                            </span>
                        </Link>
                        <Link
                            to={isLogined ? "/practics/logout" : "/practics/login"}
                            className='bg-red-500 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors  text-[13px] shadow-sm'>
                            <span>{isLogined ? "Logout" : "Login"}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

