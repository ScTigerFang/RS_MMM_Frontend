// src/components/MethodsTable.js
import React from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import { formatHourlyProfit } from "../utils"; // Add this line
import styles from "./MethodsTable.module.css"; // Import the CSS module

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MethodsTable = ({ data }) => {

  const columns = React.useMemo(
    () => [
      {
        Header: "Rank",
        id: "rank",
        accessor: (row, rowIndex) => rowIndex + 1,
        disableSortBy: true,
        disableFilters: true,
        width: 50,
      },
      { Header: "Method", accessor: "method" },
      {
        Header: "Hourly Profit",
        accessor: "hourlyProfit",
        Cell: (value) => formatHourlyProfit(value.cell.value),
      },
      { Header: "Skill or Area", accessor: "skillOrArea" },
      {
        Header: "Intensity", 
        accessor: "intensity",
        Cell: ({ row }) => (
          <div className={styles.intensityCell}>
            {row.values.intensity && (
              <>
                <span>{row.values.intensity.shortDescription}</span>
                <div className={styles.tooltip}>{row.values.intensity.longDescription}</div>
              </>
            )}
          </div>
        ),
      },
      { Header: "Notes", accessor: "notes" },
      {
        Header: "Created",
        id: "created",
        accessor: (row) => formatDate(row.createdDatetime),
        Cell: ({ row }) => (
          <a href={row.original.videoLink} target="_blank" rel="noreferrer">
            {row.values.created}
          </a>
        ),
        disableFilters: true,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useFilters,
      useSortBy
    );

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={styles.tableHeader}
              >
                {column.render("Header")}
                <span className={styles.sortIcon}>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className={styles.tableRow}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()} className={styles.tableCell}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MethodsTable;
