export const exportToCSV = (data, columns, filename = 'data') => {
    // Implement CSV export logic
    // Example using a library like papaparse or custom implementation
    console.log('Exporting to CSV', data, columns, filename);
  };
  
  export const exportToExcel = (data, columns, filename = 'data') => {
    // Implement Excel export logic
    // Example using a library like xlsx
    console.log('Exporting to Excel', data, columns, filename);
  };
  
  export const exportToPDF = (data, columns, filename = 'data') => {
    // Implement PDF export logic
    // Example using a library like jspdf or pdfmake
    console.log('Exporting to PDF', data, columns, filename);
  };
  
  export const copyToClipboard = (data, columns) => {
    // Implement copy to clipboard logic
    const text = data.map(row => 
      columns.map(col => col.selector ? col.selector(row) : '')
        .join('\t')
    ).join('\n');
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard');
  };
  
  export const printTable = (data, columns, title = '') => {
    // Implement print logic
    const printWindow = window.open('', '_blank');
    const html = `
      <html>
        <head>
          <title>Print ${title}</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${columns.map(col => `<td>${col.selector ? col.selector(row) : ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };