
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { fetchTutorRate, updateTutorRate } from '@/services/api/tutorRateService';

interface HourlyRateSetupProps {
  userId: string;
}

const HourlyRateSetup: React.FC<HourlyRateSetupProps> = ({ userId }) => {
  const [isFree, setIsFree] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setIsLoading(true);
        const rate = await fetchTutorRate(userId);
        
        // Consider 0 as a "free" service rate
        if (rate === 0) {
          setIsFree(true);
          setHourlyRate(0);
        } else {
          setIsFree(false);
          setHourlyRate(rate);
        }
      } catch (error) {
        console.error('Error fetching tutor rate:', error);
        toast.error('Failed to load your hourly rate');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [userId]);

  const handleSaveRate = async () => {
    try {
      setIsSaving(true);
      const rateToSave = isFree ? 0 : (hourlyRate || 0);
      await updateTutorRate(userId, rateToSave);
      toast.success('Hourly rate updated successfully');
    } catch (error) {
      console.error('Error updating tutor rate:', error);
      toast.error('Failed to update hourly rate');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      setHourlyRate(null);
    } else {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        setHourlyRate(parsedValue);
      }
    }
  };

  const handleFreeToggle = (checked: boolean) => {
    setIsFree(checked);
    if (checked) {
      setHourlyRate(0);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Hourly Rate</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set your tutoring rate per hour, or offer your services for free
        </p>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
      ) : (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              id="free-switch" 
              checked={isFree} 
              onCheckedChange={handleFreeToggle} 
            />
            <Label htmlFor="free-switch">Offer services for free</Label>
          </div>

          {!isFree && (
            <div className="flex items-end gap-2 mb-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    id="hourly-rate"
                    value={hourlyRate === null ? '' : hourlyRate}
                    onChange={handleRateChange}
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-7"
                    placeholder="Enter your hourly rate"
                  />
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSaveRate} 
            disabled={isSaving || (hourlyRate === null && !isFree)}
          >
            {isSaving ? 'Saving...' : 'Save Rate'}
          </Button>
        </>
      )}
    </div>
  );
};

export default HourlyRateSetup;
