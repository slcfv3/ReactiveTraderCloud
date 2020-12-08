import React from 'react'
import { bind } from '@react-rxjs/core'
import styled from 'styled-components/macro'
import { history$ } from 'services/analytics'
import { map } from 'rxjs/operators'
import { formatNumber } from 'utils/formatNumber'

type Accents = 'positive' | 'negative'

const USDspan = styled.span`
  opacity: 0.6;
  font-size: 14px;
  margin-right: 10px;
`
const LastPositionStyle = styled.span<{ color: Accents }>`
  font-size: 14px;
  color: ${({ theme, color }) => theme.accents[color].base};
`

const [useLastPosition, lastPosition$] = bind(
  history$.pipe(
    map(history => Number(history[history.length - 1]?.usPnl.toFixed(2) ?? 0))
  )
)

export const LastPosition: React.FC = () => {
  const lastPos = useLastPosition()

  let lastPosition = formatNumber(lastPos)
  lastPosition += lastPos >= 0 ? '+' : ''
  const color: Accents = lastPos >= 0 ? 'positive' : 'negative'

  return (
    <div>
      <USDspan>USD</USDspan>
      <LastPositionStyle color={color}>{lastPosition}</LastPositionStyle>
    </div>
  )
}

export { lastPosition$ }
