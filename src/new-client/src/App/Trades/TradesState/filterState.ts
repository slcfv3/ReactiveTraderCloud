import { bind } from "@react-rxjs/core"
import { map, scan, startWith, tap } from "rxjs/operators"
import { mapObject } from "utils"
import { Trade, trades$ } from "services/trades"
import { ColField, colFields } from "./colConfig"
import { createListener } from "@react-rxjs/utils"

export type ComparatorType =
  | "Equals"
  | "NotEqual"
  | "Less"
  | "LessOrEqual"
  | "Greater"
  | "GreaterOrEqual"
  | "InRange"

export const comparatorConfigs: Record<ComparatorType, string> = {
  Equals: "Equals",
  NotEqual: "Not equal",
  Less: "Less than",
  LessOrEqual: "Less than or equals",
  Greater: "Greater than",
  GreaterOrEqual: "Greater than or equals",
  InRange: "In range",
}

export interface NumFilterContent {
  comparator: ComparatorType
  value1: number | null
  value2?: number | null
}

export type DistinctNums = {
  [K in ColField]: NumFilterContent
}

export const fieldNumContainer = colFields.reduce((valuesContainer, field) => {
  return {
    ...valuesContainer,
    [field]: {
      comparator: "Equals",
      value1: null,
    },
  }
}, {} as DistinctNums)

export type DistinctValues = {
  [K in ColField]: Set<Trade[K]>
}

export const fieldValuesContainer = Object.freeze(
  colFields.reduce((valuesContainer, field) => {
    return {
      ...valuesContainer,
      [field]: new Set(),
    }
  }, {} as DistinctValues),
)

const ClonedFieldValuesContainer = () =>
  mapObject(fieldValuesContainer, () => new Set()) as DistinctValues

export const [useDistinctFieldValues, distinctFieldValues$] = bind(
  trades$.pipe(
    map((trades) =>
      trades.reduce((distinctValues, trade) => {
        for (const field in trade) {
          ;(distinctValues[field as keyof Trade] as Set<unknown>).add(
            trade[field as keyof Trade],
          )
        }
        return distinctValues
      }, ClonedFieldValuesContainer()),
    ),
  ),
)

export const [colFilterNum$, onColFilterEnterNum] = createListener<
  [ColField, NumFilterContent]
>()

export const [useNumberFilters, numberFilters$] = bind(
  colFilterNum$.pipe(
    tap((value) => console.log("filter received", value)),
    scan((numberFilters, [field, filterSet]) => {
      return {
        ...numberFilters,
        [field]: filterSet,
      }
    }, fieldNumContainer),
    startWith(fieldNumContainer),
  ),
)

export const [useNumFilterEntries, numFilterEntries$] = bind(
  numberFilters$.pipe(
    map((numberFilters) =>
      Object.entries(numberFilters).filter(
        ([_, valueSet]) => valueSet.value1 !== null,
      ),
    ),
  ),
  [],
)

export const [colFilterSelections$, onColFilterSelect] = createListener<
  [ColField, Set<unknown>]
>()

export const [useAppliedFilters, appliedFilters$] = bind(
  colFilterSelections$.pipe(
    scan((appliedFilters, [field, filterSet]) => {
      return {
        ...appliedFilters,
        [field]: filterSet,
      }
    }, ClonedFieldValuesContainer()),
    startWith(ClonedFieldValuesContainer()),
  ),
)

export const [quickFilterInputs$, onQuickFilterInput] = createListener<string>()

export const [useAppliedFilterEntries, appliedFilterEntries$] = bind(
  appliedFilters$.pipe(
    map((appliedFilters) =>
      Object.entries(appliedFilters).filter(
        ([_, valueSet]) => valueSet.size !== 0,
      ),
    ),
  ),
  [],
)
