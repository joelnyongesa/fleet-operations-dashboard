export function exportToCSV(data, filename = 'export') {
  if (!data || data.length === 0) {
    alert('No data to export.');
    return;
  }

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  data.forEach(row => {
    const values = headers.map(header => {
      const val = row[header];
      return typeof val === 'string' && val.includes(',')
        ? `"${val}"`
        : val ?? '';
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
