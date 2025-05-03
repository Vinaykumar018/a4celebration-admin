"use client"

import { useState, useMemo } from "react"
import DataTable from "react-data-table-component"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import { Tooltip as ReactTooltip } from "react-tooltip"

// Utility functions for exporting data
const exportToCSV = (data, columns, filename = "data") => {
  const headers = columns.map((col) => col.name)
  const csvRows = []

  csvRows.push(headers.join(","))

  data.forEach((item) => {
    const values = columns.map((col) => {
      const value = col.selector ? col.selector(item) : ""
      const escaped = ("" + value).replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(","))
  })

  const csvContent = csvRows.join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportToExcel = (data, columns, filename = "data") => {
  exportToCSV(data, columns, filename + ".xls")
}

const exportToPDF = (data, columns, filename = "data") => {
  const printWindow = window.open("", "", "height=600,width=800")
  printWindow.document.write("<html><head><title>" + filename + "</title>")
  printWindow.document.write(
    "<style>table {border-collapse: collapse; width: 100%;} th, td {border: 1px solid #ddd; padding: 8px; text-align: left;} th {background-color: #f2f2f2;}</style>",
  )
  printWindow.document.write("</head><body>")
  printWindow.document.write("<h1>" + filename + "</h1>")
  printWindow.document.write("<table>")

  printWindow.document.write("<tr>")
  columns.forEach((col) => {
    printWindow.document.write("<th>" + (col.name || "") + "</th>")
  })
  printWindow.document.write("</tr>")

  data.forEach((item) => {
    printWindow.document.write("<tr>")
    columns.forEach((col) => {
      const value = col.selector ? col.selector(item) : ""
      printWindow.document.write("<td>" + value + "</td>")
    })
    printWindow.document.write("</tr>")
  })

  printWindow.document.write("</table>")
  printWindow.document.write("</body></html>")
  printWindow.document.close()
  printWindow.print()
}

const copyToClipboard = (data, columns) => {
  const headers = columns.map((col) => col.name).join("\t")
  const rows = data
    .map((item) =>
      columns
        .map((col) => {
          const value = col.selector ? col.selector(item) : ""
          return value
        })
        .join("\t"),
    )
    .join("\n")

  const textToCopy = `${headers}\n${rows}`
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert("Copied to clipboard!")
    })
    .catch((err) => {
      console.error("Failed to copy: ", err)
    })
}

const GetTable = ({
  columns,
  data,
  loading,
  title,
  onAddClick,
  addButtonText,
  onEditClick,
  onDeleteClick,
  categories = [],
  locations = [],
}) => {
  const [filterText, setFilterText] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  // Custom styles to match the design in the image
  const customStyles = {
    table: {
      style: {
        borderCollapse: "collapse",
        width: "100%",
      },
    },
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

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  }

  // Filter items based on search text, location, and category
  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      // Text search filter
      const matchesSearch =
        !filterText ||
        columns.some((column) => {
          if (column.selector) {
            const value = column.selector(item)
            return value && value.toString().toLowerCase().includes(filterText.toLowerCase())
          }
          return false
        })

      // Location filter
      const matchesLocation =
        selectedLocation === "All Locations" ||
        (item.city && item.city.toLowerCase() === selectedLocation.toLowerCase())

      // Category filter
      const matchesCategory =
        selectedCategory === "All Categories" ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase())

      return matchesSearch && matchesLocation && matchesCategory
    })
  }, [data, filterText, selectedLocation, selectedCategory, columns])

  // Add action buttons to columns if needed
  const columnsWithActions = useMemo(() => {
    if (!onEditClick && !onDeleteClick) return columns

    return [
      ...columns,
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex space-x-2">
            {onEditClick && (
              <button
                onClick={() => onEditClick(row)}
                className="text-blue-500 hover:text-blue-700"
                data-tooltip-id="tooltip"
                data-tooltip-content="Edit"
              >
                <FaEdit />
              </button>
            )}
            {onDeleteClick && (
              <button
                onClick={() => onDeleteClick(row)}
                className="text-red-500 hover:text-red-700"
                data-tooltip-id="tooltip"
                data-tooltip-content="Delete"
              >
                <FaTrash />
              </button>
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

  // Export buttons component
  const ExportButtons = () => (
    <div className="common-flex space-x-2 mb-4">
      <button
        onClick={() => exportToCSV(filteredItems, columns, title)}
        className="px-4 py-2 btn-sm bg-info text-white rounded hover:bg-blue-600"
      >
        CSV
      </button>
      <button
        onClick={() => exportToPDF(filteredItems, columns, title)}
        className="px-4 py-2 btn-sm bg-success text-white rounded hover:bg-indigo-600"
      >
        PDF
      </button>
      <button
        onClick={() => exportToExcel(filteredItems, columns, title)}
        className="px-4 py-2 btn-sm bg-success text-white rounded hover:bg-green-600"
      >
        Excel
      </button>
      <button
        onClick={() => copyToClipboard(filteredItems, columns)}
        className="px-4 py-2 btn-sm bg-warning text-white rounded hover:bg-yellow-600"
      >
        Copy
      </button>
    </div>
  )

  // Filter dropdowns and search component
  const FilterControls = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative w-full md:w-64">
        <input
          type="text"
          className="border border-gray-300 rounded px-4 py-2 w-full form-control"
          placeholder="Search here"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    </div>
  )

  return (
    <div className="w-full">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-l-20 p-r-20">
          {/* Title and Add Button */}
          <div className="common-flex justify-between item-center">
            <ExportButtons />
            <FilterControls />
          </div>
          

          {/* Data Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <DataTable
              columns={columnsWithActions}
              data={filteredItems}
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponentOptions={paginationComponentOptions}
              persistTableHead
              highlightOnHover
              pointerOnHover
              responsive
              noDataComponent={
                <div className="text-center py-12">
                  <h5 className="mt-2 text-sm font-medium text-gray-900">No records found</h5>
                  {onAddClick && (
                    <div className="mt-6">
                      <button
                        onClick={onAddClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                        {addButtonText || "Add New"}
                      </button>
                    </div>
                  )}
                </div>
              }
            />
          )}
        </div>
      </div>
      <ReactTooltip id="tooltip" effect="solid" />
    </div>
  )
}

export default GetTable
