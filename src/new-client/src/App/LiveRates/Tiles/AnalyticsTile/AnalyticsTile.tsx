import React from 'react'
import { PriceControls}  from '../PriceControls/PriceControls'
import { NotionalInput } from '../Notional'
import { AnalyticsTileChart } from './AnalyticsTileChart'
import { TileHeader } from '../TileHeader'
import {
  AnalyticsTileStyle,
  AnalyticsTileContent,
  GraphNotionalWrapper,
  LineChartWrapper,
  PriceControlWrapper,
  AnalyticsTileWrapper
} from './styled'
import { useCurrencyPairs } from 'services/currencyPairs'

interface Props{
  id: string
}
//const [useCurrencyPairs] = bind(currencyPairs$)
export const AnalyticsTile: React.FC<Props> = ({id}) => {
  /*const currencyPair = {
    symbol: 'USD/JPY',
    ratePrecision: 0,
    pipsPosition: 2,
    base: 'USD',
    terms: 'JPY'
  }*/
  const currencyPairs = useCurrencyPairs()
  const currencyPair = currencyPairs[id]
  const date = '12-07-2020'
  const isTimerOn = false
  const historicPrices = [{
    ask: 0,
    bid: 0,
    mid: 0,
    creationTimestamp: 0,
    symbol: 'USD/JPY',
    valueDate: '12-07-2020',
    priceMovementType: undefined,
    priceStale: false
  }]
  const notional = 100000
  return (
    <AnalyticsTileWrapper
      shouldMoveDate={false}
    >
      <AnalyticsTileStyle
        className="spot-tile"
        data-qa="analytics-tile__spot-tile"
        data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
      >
        <TileHeader
          ccyPair={currencyPair}
          date={date}
        />
        <AnalyticsTileContent>
            <GraphNotionalWrapper isTimerOn={isTimerOn}>
            <LineChartWrapper isTimerOn={isTimerOn}>
                <AnalyticsTileChart history={historicPrices} />
            </LineChartWrapper>
            <NotionalInput
                notional={notional}
                currencyPairBase={currencyPair.base}
                currencyPairSymbol={currencyPair.symbol}
            />
            
            </GraphNotionalWrapper>
            <PriceControlWrapper>
            <PriceControls/>
            </PriceControlWrapper>
        </AnalyticsTileContent>
      </AnalyticsTileStyle>
    </AnalyticsTileWrapper>
  )
}
