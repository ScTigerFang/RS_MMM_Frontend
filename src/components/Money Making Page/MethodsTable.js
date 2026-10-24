import { useMemo } from "react";
import { useFilters, useSortBy, useTable } from "react-table";
import styles from "../../Styling/MethodsTable.module.css";
import { formatHourlyProfit } from "../../utils";
import Icon from "../Icon";

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function filterIntensity(rows, id, value) {
  const query = value.toLowerCase();
  return rows.filter((row) => {
    const intensity = row.values[id];
    return Boolean(
      intensity &&
        ((intensity.shortDescription || "").toLowerCase().includes(query) ||
          (intensity.longDescription || "").toLowerCase().includes(query)),
    );
  });
}

function ColumnFilter({ column: { Header, filterValue, setFilter } }) {
  return (
    <input
      className={styles.filter}
      type="search"
      aria-label={"Filter " + Header}
      value={filterValue || ""}
      placeholder="Search…"
      onChange={(event) => setFilter(event.target.value || undefined)}
    />
  );
}

export default function MethodsTable({ data, onEdit }) {
  const processData = useMemo(
    () => data.map((row, index) => ({ ...row, rank: index + 1 })),
    [data],
  );
  const newestTimestamp = useMemo(
    () =>
      processData.reduce(
        (newest, row) =>
          Math.max(newest, new Date(row.createdDatetime).getTime() || 0),
        0,
      ),
    [processData],
  );
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "rank",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: "Method",
        accessor: "method",
        Cell: ({ row, value }) => (
          <div className={styles.methodCell}>
            <span>{value}</span>
            {newestTimestamp > 0 &&
            new Date(row.original.createdDatetime).getTime() ===
              newestTimestamp ? (
              <span className={styles.badge}>New</span>
            ) : null}
          </div>
        ),
      },
      {
        Header: "Hourly profit",
        accessor: "hourlyProfit",
        Cell: ({ value }) => (
          <span className={styles.profit}>
            {formatHourlyProfit(value)}
            <small> GP / hr</small>
          </span>
        ),
      },
      { Header: "Skill / area", accessor: "skillOrArea" },
      {
        Header: "Intensity",
        accessor: "intensity",
        filter: filterIntensity,
        sortType: (a, b, id) =>
          (a.values[id]?.intensityId || 0) - (b.values[id]?.intensityId || 0),
        Cell: ({ value }) =>
          value ? (
            <span
              className={styles.intensityCell}
              data-intensity-level={value.intensityId}
              tabIndex="0"
            >
              <span className={styles.intensityDot} aria-hidden="true" />
              {value.shortDescription}
              <span className={styles.tooltip}>{value.longDescription}</span>
            </span>
          ) : (
            "—"
          ),
      },
      { Header: "Notes", accessor: "notes" },
      {
        Header: "Added / guide",
        accessor: "createdDatetime",
        disableFilters: true,
        Cell: ({ row, value }) => (
          <div className={styles.guideCell}>
            <span>{formatDate(value)}</span>
            {/^https?:\/\//i.test(row.original.videoLink || "") ? (
              <a href={row.original.videoLink} target="_blank" rel="noreferrer">
                Watch guide <Icon name="external" />
              </a>
            ) : null}
          </div>
        ),
      },
      {
        Header: "Edit",
        id: "actions",
        disableFilters: true,
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            className={styles.editButton}
            aria-label={"Edit " + row.original.method}
            onClick={() => onEdit(row.original)}
          >
            Edit <Icon name="arrow" />
          </button>
        ),
      },
    ],
    [newestTimestamp, onEdit],
  );
  const defaultColumn = useMemo(() => ({ Filter: ColumnFilter }), []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setAllFilters,
    state,
  } = useTable(
    { columns, data: processData, defaultColumn },
    useFilters,
    useSortBy,
  );

  return (
    <>
      <div className={styles.tableToolbar}>
        <span role="status">
          {rows.length} of {data.length} methods
        </span>
        <span>
          {state.filters.length ? (
            <button onClick={() => setAllFilters([])}>
              Clear filters <Icon name="close" />
            </button>
          ) : (
            "Filter columns"
          )}
        </span>
      </div>
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Money making methods. Scroll horizontally to see all columns."
        tabIndex="0"
      >
        <table {...getTableProps()} className={styles.table}>
          <caption className={styles.srOnly}>
            RuneScape money making methods with hourly profit, skill, intensity,
            notes, and video guides.
          </caption>
          <thead>
            {headerGroups.map((group) => (
              <tr
                {...group.getHeaderGroupProps()}
                key={group.getHeaderGroupProps().key}
              >
                {group.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    key={column.id}
                    scope="col"
                    aria-sort={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    {column.canSort ? (
                      <button
                        {...column.getSortByToggleProps()}
                        className={styles.sortButton}
                        title={undefined}
                        aria-label={"Sort by " + column.Header}
                      >
                        {column.render("Header")}
                        <span aria-hidden="true">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              "↓"
                            ) : (
                              "↑"
                            )
                          ) : (
                            <Icon name="sort" />
                          )}
                        </span>
                      </button>
                    ) : (
                      <span className={styles.headerLabel}>
                        {column.render("Header")}
                      </span>
                    )}
                    {column.canFilter ? column.render("Filter") : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
            {!rows.length ? (
              <tr>
                <td colSpan={columns.length} className={styles.noResults}>
                  <Icon name="document" />
                  <h3>
                    {data.length ? "No matching methods" : "No methods yet"}
                  </h3>
                  <p>
                    {data.length
                      ? "Try another search, or clear your filters."
                      : "Add a method to get started."}
                  </p>
                  {data.length ? (
                    <button
                      className="button button--outline"
                      onClick={() => setAllFilters([])}
                    >
                      Clear filters
                    </button>
                  ) : null}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
