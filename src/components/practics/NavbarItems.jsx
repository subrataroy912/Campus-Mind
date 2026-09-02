import { NavLink } from "react-router";

export default function NavbarItems({ name, to }) {
    return (
        <li>
            <NavLink
                to={to}
                className={({ isActive }) => `pb-1 transition-all border-b-2 hover:text-secondary hover:border-secondary ${isActive
                    ?
                    "border-secondary text-secondary font-semibold"
                    : "border-transparent text-surface"}
                    cursor-pointer`}>
                {name}
            </NavLink>
        </li>
    )
}