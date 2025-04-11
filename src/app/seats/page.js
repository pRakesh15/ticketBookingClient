"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  getSeats,
  bookSeats,
  getRecommendedSeats,
  resetAllSeats,
} from "@/lib/allApi";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function SeatBooking() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  const fetchSeats = async () => {
    try {
      setIsLoading(true);
      const seatData = await getSeats();
      setSeats(seatData);
      setBookedSeats(
        seatData.filter((s) => s.is_booked).map((s) => s.seat_number)
      );
    } catch (err) {
      toast.error("Failed to fetch seats.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading && isAuthenticated) {
      fetchSeats();
    }
  }, [loading, isAuthenticated]);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;

    const alreadySelected = selectedSeats.includes(seatNumber);

    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 7) {
        toast.error("You can only select up to 7 seats.");
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    try {
      setIsBooking(true);
      await bookSeats(selectedSeats);
      toast.success("Seats booked successfully!");
      setSelectedSeats([]);
      fetchSeats();
    } catch (err) {
      toast.error(err.message || "Failed to book seats.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleRecommendation = async () => {
    const num = parseInt(numberOfSeats);
    if (isNaN(num) || num < 1 || num > 7) {
      toast.error("Please enter a number between 1 and 7.");
      return;
    }

    try {
      setRecommendationLoading(true);
      const data = await getRecommendedSeats(num);

      const recommendedSeats = data?.seats;

      if (!recommendedSeats || recommendedSeats.length === 0) {
        toast.error("No suitable seats found.");
        return;
      }

      const recommendedSeatNumbers = recommendedSeats.map(
        (seat) => seat.seatNumber
      );

      setSelectedSeats(recommendedSeatNumbers);

      // ✅ Auto book seats after recommendation
      await bookSeats(recommendedSeatNumbers);
      toast.success("Recommended seats booked successfully!");
      setSelectedSeats([]);
      fetchSeats();
    } catch (err) {
      toast.error(err.message || "Failed to recommend/book seats.");
    } finally {
      setRecommendationLoading(false);
    }
  };

  const handelCancelAllSeat = async () => {
    try {
      const data = await resetAllSeats();
      toast.success(data?.message || "All seats reset!");
      setSelectedSeats([]);
      fetchSeats();
    } catch (err) {
      toast.error(err.message || "Failed to reset seats.");
    }
  };

  const getSeatColor = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return "bg-yellow-400";
    if (selectedSeats.includes(seatNumber)) return "bg-blue-500 text-white";
    return "bg-green-500";
  };

  const renderSeats = () => {
    const totalSeats = 80;
    const seatsPerRow = 7;
    const elements = [];

    for (let i = 1; i <= totalSeats; i++) {
      elements.push(
        <button
          key={i}
          className={`${getSeatColor(
            i
          )} rounded-md w-11 h-8 flex items-center justify-center font-medium transition-colors`}
          onClick={() => handleSeatClick(i)}
          disabled={bookedSeats.includes(i)}
        >
          {i}
        </button>
      );
    }

    const rows = [];
    for (let i = 0; i < elements.length; i += seatsPerRow) {
      rows.push(
        <div key={i} className="flex gap-2 mb-2">
          {elements.slice(i, i + seatsPerRow)}
        </div>
      );
    }

    return rows;
  };

  if (loading || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Seat Booking</h1>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Seat Grid */}
          <div className="bg-white p-6 rounded-lg shadow-md">{renderSeats()}</div>

          {/* Booking Panel */}
          <div className="flex flex-col gap-3 items-center justify-center">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-center">
                Book Seats
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Enter number of seats..."
                  value={numberOfSeats}
                  onChange={(e) => setNumberOfSeats(e.target.value)}
                  className="flex-grow bg-amber-50 rounded-xs px-2 py-1"
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-[4px] text-white cursor-pointer"
                  onClick={handleRecommendation}
                  disabled={recommendationLoading}
                >
                  {recommendationLoading ? "Booking..." : "Book"}
                </button>
                {selectedSeats.length > 0 && (
                  <button
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-[4px] text-white cursor-pointer"
                    onClick={handleBooking}
                    disabled={isBooking}
                  >
                    {isBooking ? "Booking..." : "Book Selected Seat"}
                  </button>
                )}
              </div>

              <button
                className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-[4px] text-white cursor-pointer"
                onClick={handelCancelAllSeat}
                disabled={recommendationLoading}
              >
                {recommendationLoading ? "Canceling..." : "Reset Booking"}
              </button>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-2">
              <div className="bg-yellow-400 p-3 rounded-md font-medium text-center">
                Booked Seats = {bookedSeats.length}
              </div>
              <div className="bg-green-500 p-3 rounded-md font-medium text-center text-white">
                Available Seats = {80 - bookedSeats.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
