import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Ticket,
  CreditCard,
  ChevronRight,
  Bus,
  Menu,
  X
} from 'lucide-react';

import './App.css';

const ChaloBusApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBuses, setActiveBuses] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const routes = [
    {
      id: 1,
      number: '101',
      name: 'Kalyan - Mumbai CST',
      from: 'Kalyan Station',
      to: 'Mumbai CST',
      distance: '54 km',
      duration: '90 min',
      fare: 45,
      frequency: '5-10 min',
      stops: ['Kalyan Station', 'Dombivli', 'Thane', 'Mulund', 'Bhandup', 'Vikhroli', 'Ghatkopar', 'Kurla', 'Sion', 'Dadar', 'Mumbai CST'],
      activeBuses: 8
    },
    {
      id: 2,
      number: '205',
      name: 'Kalyan - Thane',
      from: 'Kalyan Station',
      to: 'Thane Station',
      distance: '18 km',
      duration: '35 min',
      fare: 25,
      frequency: '3-5 min',
      stops: ['Kalyan Station', 'Birla College', 'Dombivli', 'Kalwa', 'Mumbra', 'Thane Station'],
      activeBuses: 12
    },
    {
      id: 3,
      number: '310',
      name: 'Kalyan - Badlapur',
      from: 'Kalyan Station',
      to: 'Badlapur',
      distance: '15 km',
      duration: '30 min',
      fare: 20,
      frequency: '8-12 min',
      stops: ['Kalyan Station', 'Shahad', 'Ambivli', 'Titwala', 'Khadavli', 'Badlapur'],
      activeBuses: 6
    },
    {
      id: 4,
      number: '450',
      name: 'Kalyan - Navi Mumbai',
      from: 'Kalyan Station',
      to: 'Vashi',
      distance: '28 km',
      duration: '50 min',
      fare: 35,
      frequency: '10-15 min',
      stops: ['Kalyan Station', 'Dombivli', 'Airoli', 'Ghansoli', 'Kopar Khairane', 'Vashi'],
      activeBuses: 7
    },
    {
      id: 5,
      number: '120',
      name: 'Thane - Andheri',
      from: 'Thane Station',
      to: 'Andheri Station',
      distance: '22 km',
      duration: '45 min',
      fare: 30,
      frequency: '6-8 min',
      stops: ['Thane Station', 'Mulund', 'Bhandup', 'Kanjurmarg', 'Vikhroli', 'Powai', 'Jogeshwari', 'Andheri Station'],
      activeBuses: 10
    },
    {
      id: 6,
      number: '330',
      name: 'Mumbai CST - Bandra',
      from: 'Mumbai CST',
      to: 'Bandra',
      distance: '16 km',
      duration: '40 min',
      fare: 25,
      frequency: '5-7 min',
      stops: ['Mumbai CST', 'Fountain', 'Marine Lines', 'Churchgate', 'Grant Road', 'Mumbai Central', 'Lower Parel', 'Dadar', 'Mahim', 'Bandra'],
      activeBuses: 15
    }
  ];

  const generateLiveBuses = (route) => {
    return Array.from({ length: route.activeBuses }, (_, i) => ({
      id: `${route.number}-${i + 1}`,
      routeNumber: route.number,
      currentStop: route.stops[Math.floor(Math.random() * route.stops.length)],
      nextStop: route.stops[Math.min(Math.floor(Math.random() * route.stops.length) + 1, route.stops.length - 1)],
      eta: `${Math.floor(Math.random() * 15) + 2} min`,
      crowdLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      seats: Math.floor(Math.random() * 30) + 5,
      tracking: true
    }));
  };

  useEffect(() => {
    if (selectedRoute) {
      const buses = generateLiveBuses(selectedRoute);
      setActiveBuses(buses);
      
      const interval = setInterval(() => {
        setActiveBuses(generateLiveBuses(selectedRoute));
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [selectedRoute]);

  const bookTicket = (bus, route) => {
    setShowPayment(true);
  };

  const confirmPayment = () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    setPaymentProcessing(true);
    
    setTimeout(() => {
      const ticket = {
        id: Date.now(),
        routeNumber: selectedRoute.number,
        routeName: selectedRoute.name,
        from: selectedRoute.from,
        to: selectedRoute.to,
        busId: selectedBus.id,
        fare: selectedRoute.fare,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'Active',
        paymentMethod: selectedPayment
      };
      setUserTickets([...userTickets, ticket]);
      setBookingDetails(ticket);
      setPaymentProcessing(false);
      setShowPayment(false);
      setSelectedPayment(null);
      setCurrentView('ticket');
    }, 2000);
  };

  const filteredRoutes = routes.filter(route => 
    (searchFrom === '' || route.from.toLowerCase().includes(searchFrom.toLowerCase())) &&
    (searchTo === '' || route.to.toLowerCase().includes(searchTo.toLowerCase()))
  );

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 pb-20">
      <div className="bg-white/10 backdrop-blur-md p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bus className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Chalo Bus</h1>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {menuOpen && (
          <div className="bg-white/20 rounded-2xl p-4 mb-4">
            <button
              onClick={() => { setCurrentView('tickets'); setMenuOpen(false); }}
              className="w-full text-left text-white py-3 px-4 hover:bg-white/20 rounded-xl mb-2"
            >
              My Tickets
            </button>
            <button
              onClick={() => { setCurrentView('home'); setMenuOpen(false); }}
              className="w-full text-left text-white py-3 px-4 hover:bg-white/20 rounded-xl"
            >
              Find Routes
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <input
              type="text"
              placeholder="From (e.g., Kalyan Station)"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              className="flex-1 outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
          <div className="border-t border-gray-200 my-3"></div>
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-blue-600" />
            <input
              type="text"
              placeholder="To (e.g., Mumbai CST)"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              className="flex-1 outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-4">Available Routes</h2>
        <div className="space-y-3">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              onClick={() => {
                setSelectedRoute(route);
                setCurrentView('route-detail');
              }}
              className="bg-white rounded-2xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white rounded-xl px-4 py-2 font-bold text-lg">
                    {route.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{route.name}</h3>
                    <p className="text-sm text-gray-500">{route.distance} • {route.duration}</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Every {route.frequency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-semibold">{route.activeBuses} buses live</span>
                </div>
                <div className="text-blue-600 font-bold text-lg">₹{route.fare}</div>
              </div>
            </div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
            <Bus className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/80">No routes found. Try different locations.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRouteDetail = () => {
    if (!selectedRoute) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 pb-20">
        <div className="bg-white/10 backdrop-blur-md p-6 border-b border-white/20">
          <button onClick={() => setCurrentView('home')} className="text-white mb-4">
            ← Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white text-blue-600 rounded-xl px-4 py-2 font-bold text-2xl">
              {selectedRoute.number}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedRoute.name}</h2>
              <p className="text-white/80">{selectedRoute.distance} • {selectedRoute.duration}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg mb-4">
            <h3 className="font-bold text-gray-800 mb-4">Live Bus Tracking</h3>
            <div className="space-y-3">
              {activeBuses.slice(0, 4).map((bus, idx) => (
                <div
                  key={bus.id}
                  onClick={() => {
                    setSelectedBus(bus);
                    setCurrentView('bus-detail');
                  }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border border-green-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-gray-800">Bus #{idx + 1}</span>
                    </div>
                    <span className="text-sm bg-white px-3 py-1 rounded-full text-gray-700">
                      {bus.crowdLevel} crowd
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-600">Currently at: <span className="font-semibold text-gray-800">{bus.currentStop}</span></p>
                      <p className="text-gray-600">Next: <span className="font-semibold text-gray-800">{bus.nextStop}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-600 font-bold">{bus.eta}</p>
                      <p className="text-green-600 text-xs">{bus.seats} seats</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg mb-4">
            <h3 className="font-bold text-gray-800 mb-4">Route Stops</h3>
            <div className="space-y-2">
              {selectedRoute.stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${idx === 0 || idx === selectedRoute.stops.length - 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    {idx < selectedRoute.stops.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${idx === 0 || idx === selectedRoute.stops.length - 1 ? 'text-blue-600' : 'text-gray-700'}`}>
                      {stop}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBusDetail = () => {
    if (!selectedBus || !selectedRoute) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 pb-20">
        <div className="bg-white/10 backdrop-blur-md p-6 border-b border-white/20">
          <button onClick={() => setCurrentView('route-detail')} className="text-white mb-4">
            ← Back to Route
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Bus {selectedBus.id}</h2>
              <p className="text-white/80">Route {selectedRoute.number}</p>
            </div>
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              Live Location
            </h3>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 mb-4">
              <div className="text-center mb-4">
                <Bus className="w-16 h-16 text-blue-600 mx-auto mb-2 animate-bounce" />
                <p className="text-sm text-gray-600">Currently at</p>
                <p className="text-xl font-bold text-gray-800">{selectedBus.currentStop}</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-600">Next Stop</p>
                  <p className="font-bold text-blue-600">{selectedBus.nextStop}</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-gray-600">ETA</p>
                  <p className="font-bold text-green-600">{selectedBus.eta}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Seats Available</p>
                <p className="text-2xl font-bold text-blue-600">{selectedBus.seats}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Crowd Level</p>
                <p className="text-lg font-bold text-green-600">{selectedBus.crowdLevel}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Fare</p>
                <p className="text-2xl font-bold text-purple-600">₹{selectedRoute.fare}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => bookTicket(selectedBus, selectedRoute)}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-6 h-6" />
            Book Ticket - ₹{selectedRoute.fare}
          </button>

          {showPayment && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4">
              <div className="bg-white rounded-t-3xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Choose Payment Method</h3>
                  <button onClick={() => {
                    setShowPayment(false);
                    setSelectedPayment(null);
                  }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-blue-600">₹{selectedRoute.fare}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div
                    onClick={() => setSelectedPayment('UPI')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      selectedPayment === 'UPI' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">₹</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">UPI Payment</p>
                        <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                      </div>
                      {selectedPayment === 'UPI' && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedPayment('Debit Card')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      selectedPayment === 'Debit Card' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">Debit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                      </div>
                      {selectedPayment === 'Debit Card' && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedPayment('Credit Card')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      selectedPayment === 'Credit Card' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">Credit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                      </div>
                      {selectedPayment === 'Credit Card' && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={confirmPayment}
                  disabled={!selectedPayment || paymentProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${selectedRoute.fare}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTicket = () => {
    if (!bookingDetails) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ticket Booked!</h2>
              <p className="text-white/90">Your journey is confirmed</p>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Route Number</p>
                    <p className="text-2xl font-bold text-blue-600">{bookingDetails.routeNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Ticket ID</p>
                    <p className="text-sm font-mono text-gray-800">#{bookingDetails.id}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">From</p>
                    <p className="font-semibold text-gray-800">{bookingDetails.from}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                    <Bus className="w-6 h-6 text-blue-600 mx-2" />
                    <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">To</p>
                    <p className="font-semibold text-gray-800">{bookingDetails.to}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-semibold text-gray-800">{bookingDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="font-semibold text-gray-800">{bookingDetails.time}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 mb-4 text-white text-center">
                <p className="text-sm mb-1">Total Fare</p>
                <p className="text-3xl font-bold">₹{bookingDetails.fare}</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Paid via</p>
                    <p className="font-bold text-gray-800">{bookingDetails.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-green-600 font-semibold">Ticket Active</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="w-full mt-4 bg-white text-blue-600 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    );
  };

  const renderTickets = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 pb-20">
      <div className="bg-white/10 backdrop-blur-md p-6 border-b border-white/20">
        <button onClick={() => setCurrentView('home')} className="text-white mb-4">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-white">My Tickets</h2>
      </div>

      <div className="p-4">
        {userTickets.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
            <Ticket className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/80 mb-4">No tickets booked yet</p>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold"
            >
              Book Your First Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userTickets.reverse().map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-blue-600 text-white rounded-lg px-3 py-1 font-bold">
                    {ticket.routeNumber}
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                    {ticket.status}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{ticket.routeName}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                  <div>
                    <p className="text-xs">From</p>
                    <p className="font-semibold text-gray-800">{ticket.from}</p>
                  </div>
                  <div>
                    <p className="text-xs">To</p>
                    <p className="font-semibold text-gray-800">{ticket.to}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{ticket.date} • {ticket.time}</span>
                  <span className="text-blue-600 font-bold text-lg">₹{ticket.fare}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {currentView === 'home' && renderHome()}
      {currentView === 'route-detail' && renderRouteDetail()}
      {currentView === 'bus-detail' && renderBusDetail()}
      {currentView === 'ticket' && renderTicket()}
      {currentView === 'tickets' && renderTickets()}
    </div>
  );
};

export default ChaloBusApp;