import styled from "styled-components/macro"
import { FaFilter, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa"
import {
  onSortFieldSelect,
  TableSort,
  ColConfig,
  DistinctValues,
  ColField,
  colConfigs,
} from "../TradesState"
import { SetFilter } from "./SetFilter"
import { useRef, useState } from "react"
import { usePopUpMenu } from "utils"
import { Trade } from "services/trades"

const TableHeadCell = styled.th<{ numeric: boolean }>`
  text-align: ${({ numeric }) => (numeric ? "right" : "left")};
  ${({ numeric }) => (numeric ? "padding-right: 1.5rem;" : null)};
  font-weight: unset;
  top: 0;
  position: sticky;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
  cursor: pointer;

  svg {
    width: 0.675rem;
    vertical-align: text-bottom;
  }

  span.spacer {
    min-width: 0.675rem;
    display: inline-block;
  }

  span.spacer-2 {
    min-width: 1rem;
    display: inline-block;
  }
`

export const TableHeadCellContainer: React.FC<
  ColConfig & {
    field: ColField
    tableSort: TableSort
    filterOptions: DistinctValues
    appliedFilters: DistinctValues
  }
> = ({
  field,
  filterType,
  tableSort,
  headerName,
  valueFormatter,
  filterOptions,
  appliedFilters,
}) => {
  const [showFilter, setShowFilter] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const numeric =
    colConfigs[field].filterType === "number" && field !== "tradeId"
  return (
    <TableHeadCell
      onClick={() => onSortFieldSelect(field)}
      onMouseEnter={() => filterType === "set" && setShowFilter(true)}
      onMouseLeave={() => setShowFilter(false)}
      numeric={numeric}
    >
      {displayMenu && (
        <SetFilter
          field={field}
          selected={appliedFilters[field as keyof Trade]}
          ref={ref}
          options={
            [...filterOptions[field as keyof Trade]].map((value) =>
              valueFormatter === undefined ? value : valueFormatter(value),
            ) as string[]
          }
        />
      )}
      {numeric &&
        (showFilter ? (
          <FaFilter
            onClick={(e) => {
              e.stopPropagation()
              setDisplayMenu((current) => !current)
            }}
          />
        ) : (
          <span className="spacer" />
        ))}
      {tableSort.field === field && numeric ? (
        tableSort.direction === "ASC" ? (
          <FaLongArrowAltUp />
        ) : (
          <FaLongArrowAltDown />
        )
      ) : null}
      {headerName}
      {tableSort.field === field && !numeric ? (
        tableSort.direction === "ASC" ? (
          <FaLongArrowAltUp />
        ) : (
          <FaLongArrowAltDown />
        )
      ) : null}
      {!numeric &&
        (showFilter ? (
          <FaFilter
            onClick={(e) => {
              e.stopPropagation()
              setDisplayMenu((current) => !current)
            }}
          />
        ) : (
          <span className="spacer" />
        ))}
    </TableHeadCell>
  )
}
