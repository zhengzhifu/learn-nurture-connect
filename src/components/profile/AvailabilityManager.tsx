
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Button from '@/components/ui-custom/Button';
import { Availability } from '@/types/auth';
import { fetchUserAvailability, addAvailability, removeAvailability } from '@/services/api/availabilityService';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';

interface AvailabilityManagerProps {
  userId: string;
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ userId }) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  useEffect(() => {
    if (userId) {
      loadAvailabilities();
    }
  }, [userId]);

  const loadAvailabilities = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserAvailability(userId);
      setAvailabilities(data);
    } catch (error) {
      console.error('Error loading availabilities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAvailability = async () => {
    if (!startTime || !endTime) {
      toast.error('Please select both start and end times');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      const newAvailability = await addAvailability(userId, selectedDay, startTime, endTime);
      if (newAvailability) {
        setAvailabilities([...availabilities, newAvailability]);
        toast.success('Availability added successfully');
      }
    } catch (error) {
      console.error('Error adding availability:', error);
    }
  };

  const handleRemoveAvailability = async (id: string) => {
    try {
      await removeAvailability(id);
      setAvailabilities(availabilities.filter(a => a.id !== id));
      toast.success('Availability removed successfully');
    } catch (error) {
      console.error('Error removing availability:', error);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Availability</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="day">Day</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger id="day">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          type="button" 
          onClick={handleAddAvailability}
          className="mt-2"
        >
          Add Availability
        </Button>
      </div>
      
      {availabilities.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {availabilities.map((availability) => (
                <tr key={availability.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{availability.day_of_week}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(availability.start_time)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(availability.end_time)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleRemoveAvailability(availability.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-4 border rounded-md text-muted-foreground">
          No availability set. Add your available times above.
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
