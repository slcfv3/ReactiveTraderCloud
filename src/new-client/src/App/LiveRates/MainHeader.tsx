import React from 'react'
import { Header, LeftNav, LeftNavItemFirst, NavItem, RightNav, LeftNavTitle } from './styled'
import { TileView } from './types'

interface Props {
  currencyOptions: string[]
  tileView: TileView
  currency: string
  defaultOption: string
}

export const MainHeader: React.FC<Props> = ({
  defaultOption,
  tileView,
  currency,
  currencyOptions,
}) => {
  const options = [defaultOption, ...currencyOptions]
  const onCurrencyChange = () => {}
  return (
    <Header>
      <LeftNav>
        <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
        {options.map(currencyOption => (
          <NavItem
            key={currencyOption}
            active={currencyOption === currency}
            data-qa="workspace-header__nav-item"
            data-qa-id={`currency-option-${currencyOption.toLowerCase()}`}
            onClick={() => onCurrencyChange()}
          >
            {currencyOption}
          </NavItem>
        ))}
      </LeftNav>

    </Header>
  )
}
