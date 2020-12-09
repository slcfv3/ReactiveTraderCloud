import React from 'react'
import { AnalyticsTile } from './Tiles/AnalyticsTile/AnalyticsTile'
import { SpotTile } from './Tiles/SpotTile/SpotTile'

interface Props{
  id: string
}

export const TileSwitch: React.FC<Props> = ({id}) => {
  
  const isAnalytics = true

  return (
    <>
    <div>symbol: {id}</div>
    {isAnalytics? <AnalyticsTile/> : <SpotTile/>}
    </>
  )
}
