import { MenuIcon } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

function NotificationCard({ onClose }) {
  return (
    <div
      className='absolute flex flex-col items-center z-10 top-0 right-0 w-full h-screen bg-white md:right-10 md:top-15 md:w-[50%] md:min-w-80 md:h-[calc(100vh-80px)] md:shadow-2xl md:shadow-gray-800 rounded-lg'>
      <div className="flex items-center justify-between p-4 bg-gray-100 w-full h-4">
        <h2 className="font-serif">Notifications</h2>
        <CgClose className="bg-gray-400 rounded-lg text-xl cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex flex-col items-center w-full overflow-y-auto">
        <NotificationCardItems author={"Nabojeet BiswasNabojeet BiswasNabojeet BiswasNabojeet BiswasNabojeet BiswasNabojeet BiswasNabojeet BiswasNabojeet BiswasNabojeet BiswasNabojeet Biswas"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
        <NotificationCardItems author={"Subho Free Fire"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
        <NotificationCardItems author={"Dhrubo _ _ _"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
        <NotificationCardItems author={"Sayil"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
        <NotificationCardItems author={"Sayil"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
        <NotificationCardItems author={"Sayil"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
        <NotificationCardItems author={"Sayil"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
        <NotificationCardItems author={"Sayil"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
        <NotificationCardItems author={"Sayil"} createdAt={"8-28-2026"} timestamp={"8:10 PM"} content={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda dignissimos nostrum, ex adipisci quidem!"} />
      </div>
    </div>
  )
}

export default NotificationCard;

function NotificationCardItems({ author, createdAt, timestamp, content }) {
  return (
    <div className="w-full flex justify-between items-start gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      {/* Left Side: Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 tracking-tight truncate">
          From: {author}
        </h4>
        
        <div className="flex items-center space-x-2 mt-0.5">
          <span className="text-xs text-gray-500">{createdAt}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        
        <p className="mt-1.5 text-sm text-gray-600 leading-relaxed tracking-tight line-clamp-2">
          {content}
        </p>
      </div>

      {/* Right Side: Actions */}
      <div className="shrink-0">
        <button 
          aria-label="Notification options"
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <BsThreeDots className="text-lg" />
        </button>
      </div>
    </div>
  );
}

