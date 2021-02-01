import React, { useState, useRef, useEffect } from "react"
import { usePopUpMenu } from "utils/usePopUpMenu"
import styled from "styled-components/macro"
import {
  ColField,
  comparatorConfigs,
  ComparatorType,
  onColFilterEnterNum,
  NumFilterContent,
} from "../TradesState"

export const MultiSelectWrapper = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  display: inline-block;

  @media (max-width: 400px) {
    display: none;
  }
`

export const MultiSelectMenu = styled.div`
  position: absolute;
  width: fit-content;
  min-height: 100%;
  max-height: 8rem;
  overflow-y: auto;
  top: 0px;
  right: 0px;
  background-color: ${({ theme }) => theme.primary.base};
  padding: 6px;
  box-shadow: ${({ theme }) => theme.core.textColor} 0px 0px 0.3125rem 0px;
`

export const MultiSelectOption = styled.div<{
  selected: boolean
  children: React.ReactNode
}>`
  padding: 8px 8px 5px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  background-color: ${({ selected, theme }) =>
    selected ? theme.core.activeColor : "inherit"};
  border-radius: 2px;
  margin-bottom: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
    font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
    text-decoration: underline;
  }
`
export const DropdownWrapper = styled.div`
  display: block;
  position: relative;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  outline: none;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  transition: all 200ms ease;

  .dd-placeholder {
    padding-right: 20px;
  }

  i {
    font-size: 10px;
  }
`

export const DropdownMenu = styled.div`
  border-radius: 4px;
  position: absolute;
  top: 40px;
  left: 0px;
  background-color: ${({ theme }) => theme.primary.base};
  padding: 6px;
  box-shadow: 0 7px 26px 0 rgba(23, 24, 25, 0.5);
  z-index: 100;
  width: 100%;
`

export const DropdownOption = styled.div`
  padding: 8px 8px 5px 8px;
  font-weight: normal;
  background-color: inherit;
  border-radius: 2px;
  margin-bottom: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
    font-weight: normal;
    text-decoration: underline;
  }

  i {
    padding-left: 20px;
  }
`
const Input = styled.input`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 80px;
  padding: 2px 0;
  color: ${({ theme }) => theme.core.textColor};
  border-bottom: 1.5px solid ${({ theme }) => theme.primary[5]};
  caret-color: ${({ theme }) => theme.primary.base};
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
`

interface SetFilterProps {
  field: ColField
  selected: NumFilterContent
}

export const NumFilter: React.FC<SetFilterProps> = ({ field, selected }) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(innerRef)
  const [comparator, setComparator] = useState("Equals")
  const value1 = useRef<string | null>(null)
  const value2 = useRef<string | null>(null)
  useEffect(() => {
    if (selected.value1) {
      value1.current = selected.value1.toString()
    }
    if (selected.value2) {
      value2.current = selected.value2.toString()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const toggle = () => setDisplayMenu(!displayMenu)
  const changeValue1 = (value: string) => {
    value1.current = value
    const filterDetails = {
      comparator: comparator as ComparatorType,
      value1: value1.current ? parseInt(value1.current) : null,
    }
    if (comparator !== "InRange") {
      onColFilterEnterNum([field, filterDetails])
      console.log("filter sent", parseInt(value1.current as string))
    }
  }

  const changeValue2 = (value: string) => {
    value2.current = value
    const filterDetails = {
      comparator: comparator as ComparatorType,
      value1: value1.current ? parseInt(value1.current) : null,
      value2: value2.current ? parseInt(value2.current) : null,
    }
    onColFilterEnterNum([field, filterDetails])
  }
  return (
    <MultiSelectWrapper ref={innerRef}>
      <MultiSelectMenu>
        <DropdownWrapper onClick={toggle}>
          <div className="dd-placeholder">{comparator}</div>

          {displayMenu && (
            <DropdownMenu>
              {Object.keys(comparatorConfigs).map((comparator) => {
                return (
                  <DropdownOption
                    key={comparator}
                    className="compare-option"
                    onClick={() => setComparator(comparator)}
                  >
                    {comparatorConfigs[comparator as ComparatorType]}
                  </DropdownOption>
                )
              })}
            </DropdownMenu>
          )}
        </DropdownWrapper>
        <br></br>
        <Input onChange={({ target: { value } }) => changeValue1(value)} />
        {comparator === "InRange" && (
          <Input onChange={({ target: { value } }) => changeValue2(value)} />
        )}
      </MultiSelectMenu>
    </MultiSelectWrapper>
  )
}
