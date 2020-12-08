import { scale, geom, layout, Selection } from "d3"
import { Observable } from "rxjs"
import { map, scan, withLatestFrom } from "rxjs/operators"
import { colors } from "theme"
import { CurrencyPairPosition } from "services/analytics"
import { CurrencyPair } from "services/currencyPairs"
import { formatNumber } from "utils/formatNumber"

export interface Scales {
  x: scale.Linear<number, number>
  y: scale.Linear<number, number>
  r: scale.Linear<number, number>
}

export interface CCYPosition {
  symbol: string
  baseTradedAmount: number
}

export interface BubbleChartNode extends layout.force.Node {
  id: string
  r: number
  cx: number
  color: string
}

const currencyPairs$ = new Observable<Record<string, CurrencyPair>>()
const positions$ = new Observable<Record<string, CurrencyPairPosition>>()
const size$ = new Observable<{ width: number; height: number }>()

const formattedPositions$ = positions$.pipe(
  withLatestFrom(currencyPairs$),
  map(([positions, currencyPairs]) =>
    Object.entries(positions).reduce(
      (acc, [symbol, { baseTradedAmount, counterTradedAmount }]) => {
        const ccyPair = currencyPairs[symbol]
        const baseCurrency = ccyPair ? ccyPair.base : ""
        const counterCurrency = ccyPair ? ccyPair.terms : ""

        acc[baseCurrency] = (acc[baseCurrency] || 0) + baseTradedAmount

        acc[counterCurrency] = (acc[counterCurrency] || 0) + counterTradedAmount

        return acc
      },
      {} as Record<string, number>,
    ),
  ),
  map((aggregatedPositions) =>
    Object.entries(aggregatedPositions)
      .map(([key, val]) => ({
        symbol: key,
        baseTradedAmount: val,
      }))
      .filter((posPerCCY: CCYPosition) => posPerCCY.baseTradedAmount !== 0),
  ),
)

const scales$ = formattedPositions$.pipe(
  withLatestFrom(size$),
  map(([positionData, { width, height }]) => {
    const ratio: number = 12.5
    const minR: number = 15
    const maxR: number = 60
    const offset: number = maxR / 2
    const baseValues: number[] = positionData.map((val) =>
      Math.abs(val.baseTradedAmount),
    )
    const maxValue: number = Math.max(...baseValues) || 0
    const minValue: number =
      Math.min(...baseValues) !== maxValue ? Math.min(...baseValues) : 0
    return {
      x: scale
        .linear()
        .domain([0, positionData.length])
        .range([-(width / ratio), width / ratio - offset]),
      y: scale
        .linear()
        .domain([0, positionData.length])
        .range([-(height / ratio), height / ratio]),
      r: scale.sqrt().domain([minValue, maxValue]).range([minR, maxR]),
    }
  }),
)

export const nodes$ = scales$.pipe(
  withLatestFrom(formattedPositions$),
  scan((acc, [scales, positionsData]) => {
    positionsData.forEach((dataObj: CCYPosition, index: number) => {
      const color =
        dataObj.baseTradedAmount > 0
          ? colors.accents.positive.base
          : colors.accents.negative.base
      const existingNode = acc[dataObj.symbol]
      if (existingNode) {
        existingNode.r = getRadius(dataObj, scales)
        existingNode.cx = scales.x(index)
        existingNode.color = color
      } else {
        acc[dataObj.symbol] = {
          color,
          id: dataObj.symbol,
          r: getRadius(dataObj, scales),
          cx: scales.x(index),
        }
      }
    })
    return acc
  }, {} as Record<string, BubbleChartNode>),
  map((x) => Object.values(x)),
)

export function updateNodes(
  nodeGroup: Selection<any>,
  nodes: BubbleChartNode[],
): void {
  const nodeMap: Record<string, { x: number; y: number }> = {}
  nodeGroup.each(collide(0.1, nodes)).attr({
    transform: (d: BubbleChartNode) => {
      if (
        d.x !== undefined &&
        d.y !== undefined &&
        !isNaN(d.x) &&
        !isNaN(d.y)
      ) {
        nodeMap[d.id] = { x: d.x, y: d.y }
        return "translate(" + d.x + "," + d.y + ")"
      } else {
        nodeMap[d.id] = { x: 0, y: 0 }
        return "translate(0, 0)"
      }
    },
    id: (d: BubbleChartNode) => d.id,
  })

  nodes.forEach((node: BubbleChartNode) => {
    const newSettings = nodeMap[node.id]
    if (newSettings) {
      node.x = newSettings.x
      node.y = newSettings.y
    }
  })
}

export function drawCircles(
  nodeGroup: Selection<any>,
  duration: number = 800,
): void {
  nodeGroup
    .transition()
    .duration(duration)
    .attr({ r: (d: BubbleChartNode) => d.r })
    .style("filter", "url(#drop-shadow)")
    .style({ fill: (d: BubbleChartNode) => d.color })
}

export function drawLabels(nodeGroup: Selection<any>): void {
  nodeGroup
    .attr({ x: 0, y: 3, class: "analytics__positions-label" })
    .text((d: BubbleChartNode) => d.id)
}

export const getRadius = (currValue: CCYPosition, scales: Scales) =>
  scales.r(Math.abs(currValue.baseTradedAmount))

export function getPositionValue(
  id: string,
  positionsData: CCYPosition[],
): string {
  const index: number = positionsData.findIndex(
    (pos: CCYPosition) => pos.symbol === id,
  )

  if (index >= 0) {
    return formatNumber(positionsData[index].baseTradedAmount)
  }
  return ""
}

export function addShadow(svg: Selection<any>): void {
  const definitions = svg.append("defs")

  const filter = definitions
    .append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%")

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 1.5)
    .attr("result", "blur")

  filter
    .append("feOffset")
    .attr("in", "blur")
    .attr("dx", 1)
    .attr("dy", 1)
    .attr("result", "offsetBlur")

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode").attr("in", "offsetBlur")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

export function collide(alpha: number, nodes: BubbleChartNode[]) {
    const ny1: number = d.y - radius
    const ny2: number = d.y + radius

    return quadtree.visit(
      (quad: any, x1: number, y1: number, x2: number, y2: number) => {
        if (quad.point && quad.point !== d) {
          let x: number = d.x - quad.point.x
          let y: number = d.y - quad.point.y
          let l: number = Math.sqrt(x * x + y * y)
          radius = d.r + quad.point.r + offset
          if (l < radius) {
            l = ((l - radius) / l) * alpha
            d.x -= x *= l
            d.y -= y *= l
            quad.point.x += x
            quad.point.y += y
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
      },
    )
  }
}
