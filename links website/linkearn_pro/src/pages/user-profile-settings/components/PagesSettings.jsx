import React, { useState } from 'react';

const pageOptions = [
  { pages: 1, cpm: 80 },
  { pages: 2, cpm: 160 },
  { pages: 3, cpm: 240 },
  { pages: 4, cpm: 320 },
  { pages: 5, cpm: 400 },
];

const PagesSettings = () => {
  // const [selectedPages, setSelectedPages] = useState(1);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        CPM Per Page
      </h2>

     

      <div className="border border-border bg-muted p-4 rounded-md">
        <h3 className="text-sm font-medium text-text-primary mb-2">Page(s) - CPM</h3>
        <ul className="text-sm text-text-secondary space-y-1">
          {pageOptions.map((option) => (
            <li key={option.pages}>
              {option.pages} {option.pages === 1 ? 'page' : 'pages'} - ₹{option.cpm} CPM
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PagesSettings;
