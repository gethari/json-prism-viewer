
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface PropertySelectorProps {
  selectedProperties: string[];
  onPropertiesChange: (properties: string[]) => void;
}

const AVAILABLE_PROPERTIES = [
  { value: 'label', label: 'Label' },
  { value: 'name', label: 'Name' },
  { value: 'placeholder', label: 'Placeholder' },
  { value: 'tooltip', label: 'Tooltip' },
];

const PropertySelector: React.FC<PropertySelectorProps> = ({
  selectedProperties,
  onPropertiesChange,
}) => {
  const handlePropertyToggle = (property: string) => {
    const newProperties = selectedProperties.includes(property)
      ? selectedProperties.filter(p => p !== property)
      : [...selectedProperties, property];
    onPropertiesChange(newProperties);
  };

  const getDisplayText = () => {
    if (selectedProperties.length === 0) return 'Select properties';
    if (selectedProperties.length === 1) return `${selectedProperties.length} property selected`;
    return `${selectedProperties.length} properties selected`;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Properties to Analyze
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            type="button"
          >
            {getDisplayText()}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {AVAILABLE_PROPERTIES.map((property) => (
            <DropdownMenuCheckboxItem
              key={property.value}
              checked={selectedProperties.includes(property.value)}
              onCheckedChange={() => handlePropertyToggle(property.value)}
            >
              {property.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PropertySelector;
