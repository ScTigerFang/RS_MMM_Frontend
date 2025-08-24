// src/components/Money Making Page/MethodsTable.js
import React from "react";
import { useFilters, useSortBy, useTable } from "react-table";
import styles from "../../Styling/MethodsTable.module.css";
import { formatHourlyProfit } from "../../utils";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function filterIntensity(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue
      ? rowValue.shortDescription.toLowerCase().includes(filterValue.toLowerCase()) ||
      rowValue.longDescription.toLowerCase().includes(filterValue.toLowerCase())
      : false;
  });
}

const SortIcon = ({ column }) => {
  const handleSortUpClick = (e) => {
    e.stopPropagation();
    column.toggleSortBy(false);
  };

  const handleSortDownClick = (e) => {
    e.stopPropagation();
    column.toggleSortBy(true);
  };

  return (
    <>
      <span className={styles.sortIconUp} onClick={handleSortUpClick}>
        {column.isSorted && !column.isSortedDesc ? "  ▲" : "  △"}
      </span>
      <span className={styles.sortIconDown} onClick={handleSortDownClick}>
        {column.isSorted && column.isSortedDesc ? " ▼" : " ▽"}
      </span>
    </>
  );
};

const MethodsTable = ({ data, onEdit = () => { } }) => {
  const processData = React.useMemo(
    () =>
      (data || []).map((row, index) => ({
        ...row,
        rank: index + 1,
        _createdTS: row?.createdDatetime ? new Date(row.createdDatetime).getTime() : null,
      })),
    [data]
  );

  const newestCreatedTS = React.useMemo(() => {
    const vals = processData.map(r =>
      typeof r._createdTS === "number" ? r._createdTS : -Infinity
    );
    const max = vals.length ? Math.max(...vals) : null;
    return Number.isFinite(max) ? max : null;
  }, [processData]);


  // 3) Columns (can show badges based on those timestamps)
  const columns = React.useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
        disableSortBy: true,
        disableFilters: true,
        width: 50,
      },
      {
        Header: "Method",
        accessor: "method",
        Cell: ({ row, value }) => {
          const isNewestCreated =
            row.original._createdTS != null && row.original._createdTS === newestCreatedTS;

          return (
            <div className={styles.methodCell}>
              <span>{value}</span>
              {isNewestCreated && (
                <span className={`${styles.badge} ${styles.badgeNew}`} aria-label="Newest method">
                  NEW
                </span>
              )}
            </div>
          );
        },
      },
      {
        Header: "Hourly Profit",
        accessor: "hourlyProfit",
        Cell: (value) => formatHourlyProfit(value.cell.value),
      },
      {
        Header: "Skill or Area",
        accessor: "skillOrArea",
        Filter: DefaultColumnFilter,
      },
      {
        Header: "Intensity",
        accessor: "intensity",
        Filter: DefaultColumnFilter,
        filter: filterIntensity,
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
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) => (
          <button className={styles.primaryButton} onClick={() => onEdit(row.original)}>
            Edit
          </button>
        ),
        disableFilters: true,
        disableSortBy: true,
      },
    ],
    [onEdit, newestCreatedTS]
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: processData,
      defaultColumn,
    },
    useFilters,
    useSortBy
  );

  return (
    <>
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={styles.tableHeader}>
                  {column.render("Header")}
                  <span>
                    <SortIcon column={column} />
                  </span>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const isNewestCreated = row.original._createdTS != null && row.original._createdTS === newestCreatedTS;
            const isNewestUpdated =
              row.original._updatedTS != null;

            const rowClass =
              styles.tableRow +
              " " +
              (isNewestCreated ? styles.rowNew : "") +
              " " +
              (!isNewestCreated && isNewestUpdated ? styles.rowUpdated : "");

            return (
              <tr {...row.getRowProps()} className={rowClass}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className={styles.tableCell}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

export default MethodsTable;
