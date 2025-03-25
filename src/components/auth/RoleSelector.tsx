
import React from 'react';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from 'react-hook-form';
import { SignUpFormValues } from '@/types/auth/signUp';

interface RoleSelectorProps {
  form: UseFormReturn<SignUpFormValues>;
  selectedRole: 'parent' | 'tutor' | null;
  handleRoleChange: (value: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  form, 
  selectedRole, 
  handleRoleChange 
}) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>I am a:</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={handleRoleChange}
              value={field.value}
              className="flex flex-col space-y-1"
            >
              <div className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer ${selectedRole === 'parent' ? 'border-primary bg-primary/5' : 'border-input'}`}>
                <RadioGroupItem value="parent" id="parent" />
                <label
                  htmlFor="parent"
                  className="flex flex-col cursor-pointer"
                >
                  <span className="font-medium">Parent</span>
                  <span className="text-sm text-muted-foreground">
                    I'm looking for tutors or babysitters for my child
                  </span>
                </label>
              </div>
              
              <div className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer ${selectedRole === 'tutor' ? 'border-primary bg-primary/5' : 'border-input'}`}>
                <RadioGroupItem value="tutor" id="tutor" />
                <label
                  htmlFor="tutor"
                  className="flex flex-col cursor-pointer"
                >
                  <span className="font-medium">Tutor/Babysitter</span>
                  <span className="text-sm text-muted-foreground">
                    I want to offer tutoring or babysitting services
                  </span>
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
          <FormDescription>
            You'll be able to specify your exact services in your profile
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default RoleSelector;
