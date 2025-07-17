import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 px-6 py-4">
  <img src="/Icon.svg" alt="Sazup Logo" className="w-10 h-10 object-contain" />
  <span className="font-bold text-lg">Sazup</span>
</div>

        <nav className="px-6 pt-2 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded font-medium ${
              location.pathname === "/" ? "bg-gray-100 text-[#05A54B]" : "text-gray-700 hover:text-[#05A54B]"
            }`}
          >
            Bookings
          </Link>
          <Link
  to="/schedule"
  className={`block px-3 py-2 rounded font-medium ${
    location.pathname.startsWith("/schedule") &&
    location.pathname === "/schedule"
      ? "bg-gray-100 text-[#05A54B]"
      : "text-gray-700 hover:text-[#05A54B]"
  }`}
>
  Schedule
</Link>
<Link
  to="/partners"
  className={`block px-3 py-2 rounded font-medium ${
    location.pathname === "/partners"
      ? "bg-gray-100 text-[#05A54B]"
      : "text-gray-700 hover:text-[#05A54B]"
  }`}
>
  Partners
</Link>


        </nav>
      </div>
      <div className="px-6 py-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div>
            <p className="text-sm font-semibold">Arthur Taylor</p>
            <p className="text-xs text-gray-500">arthur@alignui.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
