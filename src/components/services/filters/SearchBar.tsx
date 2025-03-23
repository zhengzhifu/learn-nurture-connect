
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch
}) => {
  return (
    <form onSubmit={onSearch} className="flex items-center w-full md:w-auto">
      <Input
        type="search"
        placeholder="Search for services..."
        className="mr-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button type="submit" variant="outline" size="sm">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
