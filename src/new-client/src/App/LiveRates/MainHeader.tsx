import React from "react"
import {
  Header,
  LeftNav,
  LeftNavItemFirst,
  NavItem,
  RightNav
} from "./styled"
import { TileView } from "./types"
import {
  useSelectedCurrency,
  useCurrencies,
  onSelectCurrency,
  ALL_CURRENCIES
} from "services/currencyPairs"
interface Props {
  tileView: TileView
}

export const MainHeader: React.FC<Props> = ({ tileView }) => {
  const currencies = useCurrencies()
  const defaultOption: typeof ALL_CURRENCIES = ALL_CURRENCIES
  const currency = useSelectedCurrency()
  const options: (string|typeof ALL_CURRENCIES)[]= [defaultOption, ...currencies]

  return (
    <Header>
      <LeftNav>
        <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
        {options.map((currencyOption) => (
          <NavItem
            key={currencyOption.toString()}
            active={currencyOption === currency}
            data-qa="workspace-header__nav-item"
            data-qa-id={`currency-option-${currencyOption.toString().toLowerCase()}`}
            onClick={() => onSelectCurrency(currencyOption)}
          >
            {currencyOption === ALL_CURRENCIES ? 'ALL' : currencyOption}
          </NavItem>
        ))}
      </LeftNav>
      
    </Header>
  )
}
