import React from 'react'
import { NotionalInput } from '../Notional'
import { PriceControls } from '../PriceControls/PriceControls'
import { TileHeader } from '../TileHeader'
import {
  NotionalInputWrapper,
  SpotTileWrapper,
  SpotTileStyle,
  ReserveSpaceGrouping,
} from './styled'


export const SpotTile: React.FC = () => {
  const handleRfqRejected = () => {
    
  }
  const currencyPair = {
    symbol: 'USD/JPY',
    ratePrecision: 0,
    pipsPosition: 2,
    base: 'USD',
    terms: 'JPY'
  }

  const notional = 100000

  const date = '12-07-2020'



  return (
    <SpotTileWrapper shouldMoveDate={false}>
      <SpotTileStyle
        className="spot-tile"
        data-qa="spot-tile__tile"
        data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
      >
        <ReserveSpaceGrouping>
          <TileHeader
            ccyPair={currencyPair}
            date={date}
          />
          <PriceControls/>
        </ReserveSpaceGrouping>
        <ReserveSpaceGrouping>
          <NotionalInputWrapper>
            <NotionalInput
              notional={notional}
              currencyPairBase={currencyPair.base}
              currencyPairSymbol={currencyPair.symbol}
            />
          </NotionalInputWrapper>
        </ReserveSpaceGrouping>
      </SpotTileStyle>
    </SpotTileWrapper>
  )
}
