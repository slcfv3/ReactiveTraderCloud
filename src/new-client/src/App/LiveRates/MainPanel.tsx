import React, { useState } from 'react'
import { bind } from '@react-rxjs/core'
import styled from 'styled-components/macro'
import { TileSwitch } from './TileSwitch'
import { MainHeader } from './MainHeader'
import { useLocalStorage } from './util'
import { tilesSubscription$ } from '../../services/tiles'
import { ExternalWindowProps, TileView } from './types'

const PanelItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 0.25rem;
`

const PanelItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
`

interface SpotTile {
  key: string
  externalWindowProps: ExternalWindowProps
  tornOff: boolean
}

const ALL = 'ALL'
const [useTilesSubscription] = bind(tilesSubscription$)

export const MainPanel: React.FC = () => {
  const [currency, setCurrencyOption] = useState(ALL)
  const [tileView, setTileView] = useLocalStorage('tileView', TileView.Analytics)
  //const spotTiles = useTilesSubscription()
  const spotTiles = [{
    key: '1a',
    externalWindowProps: 'SSL_OP_ALL',
    tornOff: false
  },
  {
    key: '1b',
    externalWindowProps: 'SSL_OP_ALL',
    tornOff: false
  },{
    key: '1c',
    externalWindowProps: 'SSL_OP_ALL',
    tornOff: false
  }]
  const currencyOptions = ['USD', 'GBP']
  return (
    <div data-qa="workspace__tiles-workspace">
      <MainHeader
        currencyOptions={currencyOptions}
        currency={currency}
        defaultOption={ALL}
        tileView={tileView as TileView}
      />
      <PanelItems data-qa="workspace__tiles-workspace-items">
      {spotTiles
          .filter(({ key }) => key.includes(currency) || currency === ALL)
          .map(({ key, externalWindowProps, tornOff }) => (
            <PanelItem>
                <TileSwitch id={key}/>
            </PanelItem>
          ))}
      </PanelItems>
    </div>
  )
}
