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
    <div className="w-1/4 bg-white p-4 border rounded-lg shadow-sm h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-4 px-2">
        My Classes
      </h1>
      <div>
        <ul className="flex flex-col gap-2">
          <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">[Class Name 1]</li>
          <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">[Class Name 2]</li>
          <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">[.....]</li>
        </ul>
      </div>
      <div>
        <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"> Add New Class</button>
      </div>
    </div>
  )
}

function RightBar() {
  return (
    <div className="flex-1 bg-white border rounded-lg shadow-sm">

      <div className="flex justify-between items-start w-full p-6 border-b">

        {/* Top Left Corner */}
        <h1 className="text-xl font-bold text-gray-800 text-left leading-none mt-1">
          [Name of the Class will come here]
        </h1>

        {/* Top Right Corner */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Launch Live Space
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition">
            Meeting Settings
          </button>
        </div>
      </div>

      {/* Body of Right Column */}
      <div className="p-6 text-gray-500 min-h-[400px]">
        [have to think]
      </div>

    </div>
  )
}