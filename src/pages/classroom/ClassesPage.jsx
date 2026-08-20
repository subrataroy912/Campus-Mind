import { Link } from "react-router-dom"
import Navbar from "../../components/common/Navbar"

function ClassesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Outer Wrapper: Split Left & Right Columns */}
      <div className="flex items-start w-full px-6 py-6 gap-6">
        <LeftBar />
        <RightBar />
      </div>
    </main>
  )
}

export default ClassesPage

function LeftBar() {
  return (
    <div className="w-1/4 bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col h-screen">

      <h1 className="text-xl font-bold text-gray-800 mb-4 px-2">
        My Classes
      </h1>

      <div className="flex-1 overflow-y-auto px-2">
        <ul className="flex flex-col gap-2">

          <li>
            <Link
              to="#"
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition cursor-pointer"
            >
              <img
                src="/api/placeholder/32/32"
                alt="Class Icon"
                className="w-8 h-8 rounded-full bg-gray-200 object-cover"
              />
              <h2 className="font-medium text-gray-700">Math 101</h2>
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition cursor-pointer"
            >
              <img
                src="/api/placeholder/32/32"
                alt="Class Icon"
                className="w-8 h-8 rounded-full bg-gray-200 object-cover"
              />
              <h2 className="font-medium text-gray-700">Math 101</h2>
            </Link>
          </li>
          <li>
            <Link
              to="3"
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition cursor-pointer"
            >
              <img
                src="/api/placeholder/32/32"
                alt="Class Icon"
                className="w-8 h-8 rounded-full bg-gray-200 object-cover"
              />
              <h2 className="font-medium text-gray-700">Math 101</h2>
            </Link>
          </li>

        </ul>
      </div>

      {/* 6. Added `mt-auto` to push the button to the bottom of the sidebar */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200 shadow-sm">
          Add New Class
        </button>
      </div>

    </div>
  );
}

function RightBar() {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full">

      <div className="flex justify-between items-center w-full p-6 border-b border-gray-200">

        {/* Top Left Corner */}
        <h1 className="text-xl font-bold text-gray-800 text-left">
          [Name of the Class will come here]
        </h1>

        {/* Top Right Corner */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition shadow-sm">
            Launch Live Space
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition">
            Meeting Settings
          </button>
        </div>
      </div>

      {/* Body of Right Column */}
      <div className="p-6 text-gray-500 flex-1 overflow-y-auto">
        [have to think]
      </div>

    </div>
  )
}