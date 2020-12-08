import { select, layout, Selection, event as d3Event } from "d3"
import { useLayoutEffect, useRef } from "react"
import { drawCircles, drawLabels, nodes$ } from "./chartUtil"

export interface BubbleChartNode extends layout.force.Node {
  id: string
  r: number
  cx: number
  color: string
}

export const NewComponent: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const chartDiv = wrapperRef.current!
    const getSize = () => chartDiv.getBoundingClientRect()

    // const svg: Selection<SVGElement> = select(chartDiv).select("svg")
    const { width, height } = getSize()
    const svg = select(chartDiv)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    svg.remove() // clear all child nodes

    const tooltip = select(chartDiv)
      .append("div")
      .style("visibility", "hidden")
      .attr("class", "analytics__positions-tooltip")

    const positionTooltip = (
      node: BubbleChartNode,
      event: MouseEvent,
    ): void => {
      if (typeof node.x === "undefined" || typeof node.y === "undefined") {
        return
      }
      const posX: number =
        (event ? event.offsetX : node.x) -
        (tooltip[0][0] as any).clientWidth / 2
      const posY: number = event ? event.offsetY : node.y
      const id: string = node.id
      tooltip.style("top", posY + 15 + "px").style("left", posX + "px")
      tooltip.text(
        `${id} ${""}`,
        // `${id} ${/*getPositionValue(id, this.state.prevPositionsData)*/}`,
      )
    }

    svg
      .selectAll("g.node")
      .on("mouseover", (dataObj: BubbleChartNode) => {
        tooltip.style("visibility", "visible")
        positionTooltip(dataObj, d3Event as MouseEvent)
      })
      .on("mousemove", (dataObj: BubbleChartNode) => {
        positionTooltip(dataObj, d3Event as MouseEvent)
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"))

    // Add shadow
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

    const force = layout
      .force()
      .nodes([] /*this.state.nodes*/)
      .links([])
      .size([width, height])
      .charge((_) => -1)
      .gravity(0.1)

    const subscription = nodes$.subscribe((nodes) => {
      const nodeGroup = svg
        .selectAll("g.node")
        .data(nodes, (d: BubbleChartNode) => d.id)

      nodeGroup.enter().append("g").attr("class", "node").call(force.drag)

      if (nodeGroup.selectAll("circle").empty()) {
        const circleNodeGroup = nodeGroup.append("circle")
        const labelGroup = nodeGroup.append("text")
        drawCircles(circleNodeGroup, 0)
        drawLabels(labelGroup)
        force.nodes(nodes).start()
      } else {
        const circle = nodeGroup.selectAll("circle")
        drawCircles(circle)

        setTimeout(() => {
          force.start()
        }, 200)
      }
      nodeGroup.exit().remove()
    })
    return () => subscription.unsubscribe()
  }, [])

  return () => <div ref={wrapperRef} />
}
