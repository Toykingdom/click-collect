import React from 'react';

const OrderSearch = ({ searchQuery, setSearchQuery, handleSearch, handleClearFilter }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        className="px-4 py-2 border border-gray-200 rounded mr-2"
        placeholder="Search by order/store"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={handleSearch}
      >
        Search
      </button>
      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClearFilter}
      >
        Clear
      </button>
    </div>
  );
};

export default OrderSearch;
