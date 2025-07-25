

import { useState, useMemo } from "react"
import DataTable from "react-data-table-component"
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa"
import { Tooltip as ReactTooltip } from "react-tooltip"

// Export utilities
const exportData = {
  csv: (data, columns, filename = "data") => {
    const headers = columns.map(col => `"${col.name.replace(/"/g, '""')}"`).join(",")
    const rows = data.map(item => 
      columns.map(col => {
        const value = col.selector ? col.selector(item) : ""
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(",")
    ).join("\n")
    
    downloadFile(`${headers}\n${rows}`, `${filename}.csv`, "text/csv")
  },

  excel: (data, columns, filename = "data") => {
    exportData.csv(data, columns, `${filename}.xls`)
  },

  pdf: (data, columns, filename = "data") => {
    const printWindow = window.open("", "", "height=600,width=800")
    if (!printWindow) return
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            table {border-collapse: collapse; width: 100%;} 
            th, td {border: 1px solid #ddd; padding: 8px; text-align: left;} 
            th {background-color: #f2f2f2;}
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <tr>${columns.map(col => `<th>${col.name}</th>`).join("")}</tr>
            ${data.map(item => 
              `<tr>${columns.map(col => 
                `<td>${col.selector ? col.selector(item) : ""}</td>`
              ).join("")}</tr>`
            ).join("")}
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  },

  copy: (data, columns) => {
    const text = [
      columns.map(col => col.name).join("\t"),
      ...data.map(item => 
        columns.map(col => col.selector ? col.selector(item) : "").join("\t")
      )
    ].join("\n")

    navigator.clipboard.writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch(console.error)
  }
}

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e9ecef",
      fontWeight: "600",
      fontSize: "0.875rem",
      color: "#212529",
    },
  },
  headCells: {
    style: {
      padding: "1rem",
      borderBottom: "1px solid #e9ecef",
    },
  },
  cells: {
    style: {
      padding: "1rem",
      fontSize: "0.875rem",
      borderBottom: "1px solid #e9ecef",
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e9ecef",
      padding: "1rem",
    },
  },
}

const paginationOptions = {
  selectAllRowsItem: true,
  selectAllRowsItemText: "All",
}

const Table = ({
  columns,
  data = [],
  loading = false,
  title = "",
  onAddClick,
  addButtonText = "Add New",
  onEditClick,
  onDeleteClick,
  categories = [],
  locations = [],
}) => {
  const [filterText, setFilterText] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = !filterText || columns.some(column => {
        const value = column.selector?.(item)
        return value?.toString().toLowerCase().includes(filterText.toLowerCase())
      })
      
      const matchesLocation = selectedLocation === "All Locations" || 
        item.city?.toLowerCase() === selectedLocation.toLowerCase()
      
      const matchesCategory = selectedCategory === "All Categories" || 
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      
      return matchesSearch && matchesLocation && matchesCategory
    })
  }, [data, filterText, selectedLocation, selectedCategory, columns])

  const columnsWithActions = useMemo(() => {
    if (!onEditClick && !onDeleteClick) return columns
    
    return [
      ...columns,
      {
        name: "Actions",
        cell: row => (
          <div className="flex gap-2">
            {onEditClick && (
              <ActionButton 
                icon={<FaEdit />} 
                onClick={() => onEditClick(row)} 
                tooltip="Edit" 
                color="text-blue-500 hover:text-blue-700" 
              />
            )}
            {onDeleteClick && (
              <ActionButton 
                icon={<FaTrash />} 
                onClick={() => onDeleteClick(row)} 
                tooltip="Delete" 
                color="text-red-500 hover:text-red-700" 
              />
            )}
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: "100px",
      },
    ]
  }, [columns, onEditClick, onDeleteClick])

  return (
    <div className="w-full bg-white shadow rounded-lg overflow-hidden">
      <div className="p-5">
         <div className="flex items-center justify-between gap-4 mb-6 w-full overflow-x-auto">
  {/* Export Buttons */}
  <div className="flex gap-2">
    <ExportButton type="csv" onClick={() => exportData.csv(filteredData, columns, title)} />
    <ExportButton type="pdf" onClick={() => exportData.pdf(filteredData, columns, title)} />
    <ExportButton type="excel" onClick={() => exportData.excel(filteredData, columns, title)} />
    <ExportButton type="copy" onClick={() => exportData.copy(filteredData, columns)} />
  </div>

  {/* Search bar with icon */}
  <div className="relative min-w-[200px] max-w-[250px] w-full">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      placeholder="Search..."
      value={filterText}
      onChange={e => setFilterText(e.target.value)}
    />
  </div>
</div>


        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <DataTable
            columns={columnsWithActions}
            data={filteredData}
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            paginationComponentOptions={paginationOptions}
            persistTableHead
            highlightOnHover
            pointerOnHover
            responsive
            noDataComponent={<EmptyState onAddClick={onAddClick} addButtonText={addButtonText} />}
          />
        )}
      </div>
      <ReactTooltip id="tooltip" effect="solid" />
    </div>
  )
}

const ActionButton = ({ icon, onClick, tooltip, color }) => (
  <button
    onClick={onClick}
    className={`${color}`}
    data-tooltip-id="tooltip"
    data-tooltip-content={tooltip}
  >
    {icon}
  </button>
)

const ExportButton = ({ type, onClick }) => {
  const buttonStyles = {
    csv: "bg-blue-500 hover:bg-blue-600",
    pdf: "bg-green-500 hover:bg-green-600",
    excel: "bg-indigo-500 hover:bg-indigo-600",
    copy: "bg-yellow-500 hover:bg-yellow-600"
  }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm text-white rounded ${buttonStyles[type]}`}
    >
      {type.toUpperCase()}
    </button>
  )
}

const EmptyState = ({ onAddClick, addButtonText }) => (
  <div className="text-center py-12">
    <h5 className="mt-2 text-sm font-medium text-gray-900">No records found</h5>
    {onAddClick && (
      <div className="mt-6">
        <button
          onClick={onAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="-ml-1 mr-2 h-5 w-5" />
          {addButtonText}
        </button>
      </div>
    )}
  </div>
)

export default Table