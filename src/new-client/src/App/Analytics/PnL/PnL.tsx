import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { currentPositions$ } from "services/analytics"
import { Title } from "../styled"
import PNLBar from "./PNLBar"

const [usePnL, pnL$] = bind(
  currentPositions$.pipe(
    map((currentPositions) => {
      const basePnls = currentPositions.map((d) => d.basePnl)
      const max = Math.max(...basePnls)
      const min = Math.min(...basePnls)
      const maxVal = Math.max(Math.abs(max), Math.abs(min))

      return currentPositions.map(({ basePnl, symbol }) => ({
        key: symbol,
        symbol,
        basePnl,
        maxVal,
      }))
    }),
  ),
)

export { pnL$ }

export const PnL: React.FC = () => (
  <div>
    <Title>PnL</Title>
    {usePnL().map((pnlItem) => (
      <PNLBar {...pnlItem} />
    ))}
  </div>
)
