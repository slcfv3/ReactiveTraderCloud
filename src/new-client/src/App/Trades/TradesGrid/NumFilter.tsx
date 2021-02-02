import React, { useRef } from "react"
import { usePopUpMenu } from "utils/usePopUpMenu"
import styled from "styled-components/macro"
import {
  ColField,
  comparatorConfigs,
  ComparatorType,
  onColFilterEnterNum,
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
  right: 30px;
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
  width: 10rem;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  outline: none;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  transition: all 200ms ease;
  text-transform: none;
  text-align: left;

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
  width: 100%;
  padding: 2px 0;
  color: ${({ theme }) => theme.core.textColor};
  border-bottom: 1.5px solid ${({ theme }) => theme.primary[5]};
  caret-color: ${({ theme }) => theme.primary.base};
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
`

interface NumFilterProps {
  field: ColField
  comparator: string
  setComparator: React.Dispatch<React.SetStateAction<string>>
  value1: React.MutableRefObject<string | null>
  value2: React.MutableRefObject<string | null>
}

export const NumFilter: React.FC<NumFilterProps> = ({
  field,
  comparator,
  setComparator,
  value1,
  value2,
}) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(innerRef)

  const toggle = () => setDisplayMenu(!displayMenu)
  const changeValue1 = (value: string) => {
    value1.current = value
    const filterDetails = {
      comparator: comparator as ComparatorType,
      value1: value1.current ? parseInt(value1.current) : null,
    }
    if (comparator !== "InRange") {
      onColFilterEnterNum([field, filterDetails])
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
    <MultiSelectWrapper>
      <MultiSelectMenu>
        <DropdownWrapper onClick={toggle}>
          <div>{comparatorConfigs[comparator as ComparatorType]}</div>

          {displayMenu && (
            <DropdownMenu ref={innerRef}>
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
