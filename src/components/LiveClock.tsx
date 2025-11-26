import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time in IST
  const formatTimeIST = (date: Date) => {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg crypto-glow">
      <div className="flex items-center space-x-3">
        <Clock className="w-5 h-5 text-blue-600" />
        <div>
          <h3 className="text-sm font-medium text-gray-800">IST Time</h3>
          <p className="text-lg font-bold text-blue-600">{formatTimeIST(time)}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveClock;