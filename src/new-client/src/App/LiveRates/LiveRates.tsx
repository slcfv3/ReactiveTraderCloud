import { Subscribe } from '@react-rxjs/core'
import styled from 'styled-components/macro'
import { Loader } from "components/Loader"
import { MainPanel } from './MainPanel'
import { filteredSymbols$ } from 'services/currencyPairs'

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
`

const LiveRateWrapper = styled(Wrapper)`
  padding-right: 0;
  height: 100%;

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
  overflow-y: auto;
`

export const OverflowScroll = styled.div`
  overflow-y: scroll;
  height: 100%;
`

export const LiveRates: React.FC = () => (
  <LiveRateWrapper>
    
      <OverflowScroll>
        <MainPanel/>
      </OverflowScroll>
    
  </LiveRateWrapper>
)
