/**
 * Generates consistent Tailwind CSS classes for NavLinks based on active state.
 * @param {Object} navState - The state object provided by React Router's NavLink
 * @param {boolean} navState.isActive - Whether the link matches the current URL
 * @returns {string} Tailwind CSS class string
 */
export const getNavLinkStyles = ({ isActive }) => {
  return `flex items-center gap-3 p-3 rounded-lg transition-all w-full text-sm font-medium ${
    isActive
      ? 'bg-indigo-50 text-indigo-600 font-semibold'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;
};
