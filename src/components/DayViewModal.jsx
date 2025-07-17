import React from "react";

export default function DayViewModal({ date, bookings, onClose, onAssign }) {
  const formattedDate = new Date(date).toDateString();

  const groupedByPartner = {};
  const unassigned = [];

  bookings.forEach((b) => {
    if (b.partner) {
      if (!groupedByPartner[b.partner]) {
        groupedByPartner[b.partner] = [];
      }
      groupedByPartner[b.partner].push(b);
    } else {
      unassigned.push(b);
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative">
        <h2 className="text-xl font-semibold mb-2">Bookings on {formattedDate}</h2>

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          &times;
        </button>

        {bookings.length === 0 ? (
          <p className="text-gray-500 mt-4">No bookings for this day.</p>
        ) : (
          <>
            {/* Unassigned */}
            {unassigned.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Unassigned Bookings</h3>
                <ul className="divide-y divide-gray-200">
                  {unassigned.map((b) => (
                    <li key={b.id} className="py-3 flex justify-between items-start">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Time:</span> {b.time}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Car:</span> {b.car}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Service:</span> {b.service}
                        </p>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => onAssign(b)}
                          className="text-green-600 hover:underline text-sm font-medium"
                        >
                          + Assign Partner
                        </button>
                        <p className={`text-xs mt-1 ${
                          b.status === "Active" ? "text-green-600" :
                          b.status === "Pending" ? "text-yellow-500" :
                          "text-orange-600"
                        }`}>
                          {b.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Assigned */}
            {Object.entries(groupedByPartner).map(([partner, partnerBookings]) => (
              <div key={partner} className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">👤 {partner}</h3>
                <ul className="divide-y divide-gray-200">
                  {partnerBookings.map((b) => (
                    <li key={b.id} className="py-3 flex justify-between items-start">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Time:</span> {b.time}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Car:</span> {b.car}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Service:</span> {b.service}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs mt-1 ${
                          b.status === "Active" ? "text-green-600" :
                          b.status === "Pending" ? "text-yellow-500" :
                          "text-orange-600"
                        }`}>
                          {b.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
