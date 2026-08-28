import { NavLink } from "react-router-dom";

export default function NavbarItems({ name, to }) {
    return (
        <li>
            <NavLink
                to={to}
                className={({ isActive }) => `pb-1 transition-all border-b-2 hover:text-red-500 hover:border-red-500 ${isActive
                    ?
                    "border-red-500 text-red-500 font-semibold"
                    : "border-transparent text-white"} 
                    cursor-pointer`}>
                {name}
            </NavLink>
        </li>
    )
}