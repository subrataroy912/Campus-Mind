export function ProfileHeader({
    user = {
        name: "Subrata Roy",
        handle: "Subrata001",
        isVerified: true,
        bio: "Product Designer & Frontend Tinkerer. Building thoughtful web experiences and design systems.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
    }
}) {
    return (
        <div className="relative pb-4 border-b border-gray-200">
            {/* Banner */}
            <div className="h-48 w-full overflow-hidden bg-gray-100">
                <img
                    src={user.banner}
                    alt="Profile cover banner"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="px-6">
                {/* Avatar & Action Buttons */}
                <div className="flex justify-between items-end -mt-16 mb-4">
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 object-cover shadow-sm"
                        />
                        {/* Edit / Status Badge */}
                        <button
                            aria-label="Change avatar"
                            className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-white flex items-center justify-center transition"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-full transition">
                            Message
                        </button>
                        <button
                            aria-label="More options"
                            className="w-9 h-9 border border-gray-300 hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-700 transition"
                        >
                            •••
                        </button>
                    </div>
                </div>

                {/* Identity */}
                <div>
                    <div className="flex items-center gap-1.5">
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                            {user.name}
                        </h1>
                        {user.isVerified && (
                            <svg
                                className="w-4 h-4 text-blue-500 fill-current"
                                viewBox="0 0 20 20"
                                aria-label="Verified account"
                            >
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 font-normal">
                        @{user.handle}
                    </p>
                </div>

                {/* Bio */}
                <p className="mt-3 text-sm leading-relaxed text-gray-700 max-w-xl">
                    {user.bio}
                </p>
            </div>
        </div>
    );
}