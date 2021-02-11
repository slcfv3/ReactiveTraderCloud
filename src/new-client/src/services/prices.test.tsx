import {
  whenRpc,
  whenStream,
  whenGetPrice,
  getRemoteProcedureCall$,
  reset,
} from "utils/mockClient"

import {
  getPrice$,
  usePrice,
  getHistoricalPrices$,
  useHistoricalPrices,
  PriceMovementType,
  getTest$,
  useTest,
  Price,
} from "./prices"
import { testScheduler } from "utils/testScheduler"
import { BehaviorSubject, of, Subject } from "rxjs"
import { render, screen, act as reactAct } from "@testing-library/react"
import { act, renderHook } from "@testing-library/react-hooks"
import { Subscribe } from "@react-rxjs/core"

const mockSource = {
  a: {
    Symbol: "EURCAD",
    Bid: 1.53816,
    Ask: 1.53834,
    Mid: 1.53825,
    CreationTimestamp: 5318479648168,
    ValueDate: "2021-02-10T19:10:28.4919591+00:00",
  },
  b: {
    Symbol: "EURCAD",
    Bid: 1.53836,
    Ask: 1.53844,
    Mid: 1.5384,
    CreationTimestamp: 5318479648168,
    ValueDate: "2021-02-10T19:10:28.4919591+00:00",
  },
  c: {
    Symbol: "EURCAD",
    Bid: 1.53805,
    Ask: 1.53811,
    Mid: 1.53808,
    CreationTimestamp: 5318479648168,
    ValueDate: "2021-02-10T19:10:28.4919591+00:00",
  },
}

const mockResult = {
  a: {
    ask: 1.53834,
    bid: 1.53816,
    creationTimestamp: 5318479648168,
    mid: 1.53825,
    symbol: "EURCAD",
    valueDate: "2021-02-10T19:10:28.4919591+00:00",
    movementType: PriceMovementType.NONE,
  },
  b: {
    ask: 1.53844,
    bid: 1.53836,
    creationTimestamp: 5318479648168,
    mid: 1.5384,
    symbol: "EURCAD",
    valueDate: "2021-02-10T19:10:28.4919591+00:00",
    movementType: PriceMovementType.UP,
  },
  c: {
    ask: 1.53811,
    bid: 1.53805,
    creationTimestamp: 5318479648168,
    mid: 1.53808,
    symbol: "EURCAD",
    valueDate: "2021-02-10T19:10:28.4919591+00:00",
    movementType: PriceMovementType.DOWN,
  },
}
const mockHistorySource = {
  a: [
    {
      ask: 1.53834,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:10:28.4919591+00:00",
    },
    {
      ask: 1.53844,
      bid: 1.53836,
      creationTimestamp: 5318479648168,
      mid: 1.5384,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:11:28.4919591+00:00",
    },
    {
      ask: 1.53811,
      bid: 1.53805,
      creationTimestamp: 5318479648168,
      mid: 1.53808,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:12:28.4919591+00:00",
    },
  ],
  b: [
    {
      ask: 1.53835,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:10:28.4919591+00:00",
    },
    {
      ask: 1.53844,
      bid: 1.53836,
      creationTimestamp: 5318479648168,
      mid: 1.5384,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:11:28.4919591+00:00",
    },
    {
      ask: 1.53811,
      bid: 1.53805,
      creationTimestamp: 5318479648168,
      mid: 1.53808,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:12:28.4919591+00:00",
    },
  ],
}

const mockHistoryResult = {
  a: [
    {
      ask: 1.53834,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:10:28.4919591+00:00",
    },
    {
      ask: 1.53844,
      bid: 1.53836,
      creationTimestamp: 5318479648168,
      mid: 1.5384,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:11:28.4919591+00:00",
    },
    {
      ask: 1.53811,
      bid: 1.53805,
      creationTimestamp: 5318479648168,
      mid: 1.53808,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:12:28.4919591+00:00",
    },
  ],
  b: [
    {
      ask: 1.53834,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:10:28.4919591+00:00",
    },
    {
      ask: 1.53844,
      bid: 1.53836,
      creationTimestamp: 5318479648168,
      mid: 1.5384,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:11:28.4919591+00:00",
    },
    {
      ask: 1.53811,
      bid: 1.53805,
      creationTimestamp: 5318479648168,
      mid: 1.53808,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:12:28.4919591+00:00",
    },
    {
      ask: 1.53834,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:10:28.4919591+00:00",
      movementType: PriceMovementType.NONE,
    },
  ],
  c: [
    {
      ask: 1.53835,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:10:28.4919591+00:00",
    },
    {
      ask: 1.53844,
      bid: 1.53836,
      creationTimestamp: 5318479648168,
      mid: 1.5384,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:11:28.4919591+00:00",
    },
    {
      ask: 1.53811,
      bid: 1.53805,
      creationTimestamp: 5318479648168,
      mid: 1.53808,
      symbol: "EURCAD",
      valueDate: "2021-02-09T19:12:28.4919591+00:00",
    },
  ],
}

const sampleSymbol = "EURCAD"

const renderUsePrice = (sampleSymbol: string) => {
  return renderHook(() => usePrice(sampleSymbol), {
    wrapper: ({ children }) => (
      <Subscribe source$={getPrice$(sampleSymbol)}>{children}</Subscribe>
    ),
  })
}

const renderUseHistoricalPrices = (sampleSymbol: string) => {
  return renderHook(() => useHistoricalPrices(sampleSymbol), {
    wrapper: ({ children }) => (
      <Subscribe source$={getHistoricalPrices$(sampleSymbol)}>
        {children}
      </Subscribe>
    ),
  })
}

const renderUseTest = (sampleSymbol: string) => {
  return renderHook(() => useTest(sampleSymbol), {
    wrapper: ({ children }) => (
      <Subscribe source$={getTest$(sampleSymbol)}>{children}</Subscribe>
    ),
  })
}

describe("services/prices", () => {
  describe("usePrice", () => {
    beforeEach(() => {
      reset()
    })
    it("returns an initial Price", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenStream(
        "pricing",
        "getPriceUpdates",
        { symbol: sampleSymbol },
        mockStream,
      )

      const { result } = renderUsePrice(sampleSymbol)

      expect(result.current).toEqual(mockResult.a)
    })
    it("returns a price indicating price increase", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenStream(
        "pricing",
        "getPriceUpdates",
        { symbol: sampleSymbol },
        mockStream,
      )
      const { result } = renderUsePrice(sampleSymbol)

      expect(result.current).toEqual(mockResult.a)

      reactAct(() => {
        mockStream.next(mockSource.b)
      })
      expect(result.current).toEqual(mockResult.b)
    })
    it("returns a price indicating price drop", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenStream(
        "pricing",
        "getPriceUpdates",
        { symbol: sampleSymbol },
        mockStream,
      )
      const { result } = renderUsePrice(sampleSymbol)

      expect(result.current).toEqual(mockResult.a)

      reactAct(() => {
        mockStream.next(mockSource.c)
      })
      expect(result.current).toEqual(mockResult.c)
    })
  })
  describe("getHistoricalPrices$", () => {
    beforeEach(() => {
      reset()
    })

    it("returns historical prices at beginning", () => {
      const executeStream$ = getHistoricalPrices$(sampleSymbol)
      testScheduler().run(({ expectObservable, cold }) => {
        const input = cold("    ---b", mockHistorySource)
        const expectedOutput = "---c"

        whenRpc("priceHistory", "getPriceHistory", sampleSymbol, input)
        expectObservable(executeStream$).toBe(expectedOutput, mockHistoryResult)
      })
    })

    it("returns new price concat historical price after new price comes", () => {
      const executeStream$ = getHistoricalPrices$(sampleSymbol)
      testScheduler().run(({ expectObservable, cold }) => {
        const input = cold("     ---a", mockHistorySource)
        const expectedOutput = " ---a"

        whenRpc("priceHistory", "getPriceHistory", sampleSymbol, input)
        //whenGetPrice(sampleSymbol, priceInput)
        expectObservable(executeStream$).toBe(expectedOutput, mockHistoryResult)
      })
    })
  })
})
