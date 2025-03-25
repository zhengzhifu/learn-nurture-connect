
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ParentInfoFormProps {
  numChildren: number;
  preferredCommunication: string;
  handleParentDataChange: (field: string, value: string | number) => void;
}

const ParentInfoForm: React.FC<ParentInfoFormProps> = ({ 
  numChildren, 
  preferredCommunication,
  handleParentDataChange
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Parent Information</CardTitle>
        <CardDescription>Additional details for parent accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="num_children">Number of Children</Label>
          <Input 
            id="num_children" 
            type="number"
            min="0"
            value={numChildren}
            onChange={(e) => handleParentDataChange('num_children', parseInt(e.target.value) || 0)}
            placeholder="Enter number of children"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="preferred_communication">Preferred Communication Method</Label>
          <Select
            value={preferredCommunication}
            onValueChange={(value) => handleParentDataChange('preferred_communication', value)}
          >
            <SelectTrigger id="preferred_communication">
              <SelectValue placeholder="Select communication method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParentInfoForm;
