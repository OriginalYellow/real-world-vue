const originalGridData = [
  { key: 'id', type: 'int', label: 'ID' },
  { key: 'issuer_name', type: 'string', label: 'Issuer' },
  { key: 'deal_name', type: 'string', label: 'Deal' },
  { key: 'bloomber_id', type: 'string', label: 'Bloomberg ID' },
  { key: 'total', type: 'decimal', label: 'Total' },
  { key: 'industry', type: 'string', label: 'Industry' },
  { key: 'status', type: 'string', label: 'Status' },
  { key: 'analysts', type: 'string[]', label: 'Analysts' },
  { key: 'doc_count', type: 'int', label: 'Docs' },
  { key: 'custom_deal_identifiers', type: 'string[]', label: 'Identifiers' }
];

const largeGridData = Array(100).fill(originalGridData).flat().map((item, index) => ({
  ...item,
  key: index.toString()
}));

export const fetchGridData = (): Promise<typeof largeGridData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(largeGridData);
    }, 500); // Simulate a 500ms delay
  });
};

export const fetchGridItemDetails = (key: string): Promise<Record<string, any>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomDetails = {
        description: `Detailed description for item ${key}`,
        createdAt: new Date().toISOString(),
        rating: Math.floor(Math.random() * 5) + 1,
        comments: Math.floor(Math.random() * 50),
        assignedTo: ['John Doe', 'Jane Smith', 'Bob Johnson'][Math.floor(Math.random() * 3)],
        priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      };
      resolve(randomDetails);
    }, 300);
  });
};