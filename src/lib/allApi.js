//here we create all the api call functions 
//same like i can do it in the component also but by this we can make the code and the api call clean and reusable.


// client/lib/api.js

import axios from './axiosInstance';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all seats
export const getSeats = async () => {
  try {
    const { data } = await axios.get('/seat/allSeat');
    return data;
  } catch (error) {
    console.error('Error fetching seats:', error);
    throw error;
  }
};

// Book seats
export const bookSeats = async (seatNumbers) => {
  try {
    const { data } = await axios.post('/seat/bookingSeats', { seatNumbers }, {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    console.error('Error booking seats:', error);
    throw error;
  }
};

// Get user's bookings
export const getUserBookings = async () => {
  try {
    const { data } = await axios.get('/seat/getMyBookings', {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const { data } = await axios.post(`/seat/bookings/cancel/${bookingId}`, {}, {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// bOOK  seat's by recommendations
export const getRecommendedSeats = async (count) => {
    console.log(count)
  try {
    const { data } = await axios.post('/seat/bookSeatByRecommendation', { count },{
        headers: getAuthHeader(),
      });
    return data;
  } catch (error) {
    console.error('Error getting recommended seats:', error);
    throw error;
  }
};

// Reset all seats (admin function)
export const resetAllSeats = async () => {
  try {
    const { data } = await axios.post('/seat/reset', {}, {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    console.error('Error resetting seats:', error);
    throw error;
  }
};
