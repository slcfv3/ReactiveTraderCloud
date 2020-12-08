import React from 'react'
import { Direction } from 'services/trades'
import { toRate } from '../../util'
import { PriceButton } from './PriceButton'
import { PriceMovement } from './PriceMovement'
import {
  PriceControlsStyle,
  PriceButtonDisabledPlaceholder,
  Icon
} from './styled'

const PriceButtonDisabledBanIcon: React.FC = ({ children }) => (
  <PriceButtonDisabledPlaceholder data-qa="price-controls__price-button-disabled">
    <Icon className="fas fa-ban fa-flip-horizontal" />
    {children}
  </PriceButtonDisabledPlaceholder>
)

export const PriceControls: React.FC = () => {
  
  const isAnalyticsView = true
  const priceStale = false
  const isRfqStateRequested = false
  const isRfqStateCanRequest = true
  const isTradeExecutionInFlight = false
  const priceMovement = 'Up'
  const spreadValue = '3'
  const showPriceMovement = true
  const bidRate = toRate(0, 0, 0)
  const askRate = toRate(0, 0, 0)

  const showPriceButton = (
    btnDirection: Direction,
    price: number,
    rate: ReturnType<typeof toRate>
  ) => {
    return priceStale ? (
      <PriceButtonDisabledBanIcon>Pricing unavailable</PriceButtonDisabledBanIcon>
    ) : !isRfqStateRequested ? (
      <PriceButton
        
        direction={btnDirection}
        big={rate.bigFigure}
        pip={rate.pips}
        tenth={rate.pipFraction}
        rawRate={rate.rawRate}
      />
    ) : null
  }

  return isAnalyticsView ? (
    <PriceControlsStyle
      data-qa="analytics-tile-price-control__header"
      isAnalyticsView={isAnalyticsView}
      isTradeExecutionInFlight={isTradeExecutionInFlight}
    >
      <PriceMovement
        priceMovementType={priceMovement}
        spread={spreadValue}
        show={showPriceMovement}
        isAnalyticsView={isAnalyticsView}
        isRequestRFQ={Boolean(isRfqStateCanRequest || isRfqStateRequested)}
      />
      <div>
        {showPriceButton(Direction.Sell, 0, bidRate)}
        {showPriceButton(Direction.Buy, 0, askRate)}
      </div>
    </PriceControlsStyle>
  ) : (
    <PriceControlsStyle isAnalyticsView={isAnalyticsView}>
      {showPriceButton(Direction.Sell, 0, bidRate)}
      
      <PriceMovement
        priceMovementType={priceMovement}
        spread={spreadValue}
        show={showPriceMovement}
        isAnalyticsView={isAnalyticsView}
        isRequestRFQ={Boolean(isRfqStateCanRequest || isRfqStateRequested)}
      />
      
      {showPriceButton(Direction.Buy, 0, askRate)}
     
    </PriceControlsStyle>
  )
}
