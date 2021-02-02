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
import { NumFilter } from "./NumFilter"
import { useRef, useState, useEffect } from "react"
import { usePopUpMenu } from "utils"
import { Trade } from "services/trades"
import { useNumberFilters } from "../TradesState/filterState"
import Popup from "components/Popup"

const TableHeadCell = styled.th<{ numeric: boolean; width: number }>`
  text-align: ${({ numeric }) => (numeric ? "right" : "left")};
  ${({ numeric }) => (numeric ? "padding-right: 1.5rem;" : null)};
  width: ${({ width }) => `${width} px`};
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
const AlignedFilterIcon = styled(FaFilter)`
  margin-left: 0.2rem;
  margin-right: 0.1rem;
`

export const ContactUsPopup = styled(Popup)`
  box-shadow: 0 7px 26px 0 rgba(23, 24, 25, 0.5);
  bottom: calc(2rem + 0.25rem);
  border-radius: 0.5rem;
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
  const ref = useRef<HTMLTableHeaderCellElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const numeric = filterType === "number" && field !== "tradeId"
  const numFilters = useNumberFilters()
  const [comparator, setComparator] = useState("Equals")
  const value1 = useRef<string | null>(null)
  const value2 = useRef<string | null>(null)

  useEffect(() => {
    const selected = numFilters[field as keyof Trade]
    if (selected.value1) {
      value1.current = selected.value1.toString()
    }
    if (selected.value2) {
      value2.current = selected.value2.toString()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <TableHeadCell
      onClick={() => onSortFieldSelect(field)}
      onMouseEnter={() => setShowFilter(true)}
      onMouseLeave={() => setShowFilter(false)}
      numeric={numeric}
      width={colConfigs[field].width}
      ref={ref}
    >
      {displayMenu &&
        (numeric ? (
          <NumFilter
            field={field}
            comparator={comparator}
            setComparator={setComparator}
            value1={value1}
            value2={value2}
          />
        ) : (
          <SetFilter
            field={field}
            selected={appliedFilters[field as keyof Trade]}
            options={
              [...filterOptions[field as keyof Trade]].map((value) =>
                valueFormatter === undefined ? value : valueFormatter(value),
              ) as string[]
            }
          />
        ))}
      {numeric &&
        (showFilter ? (
          <AlignedFilterIcon
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
          <AlignedFilterIcon
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
