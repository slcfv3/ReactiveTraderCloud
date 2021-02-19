import { Subscribe } from "@react-rxjs/core"
import { render, screen, act, fireEvent } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"
import { Tiles } from "../Tiles"
import { MainHeader } from "./MainHeader"
import { liveRates$ } from "../LiveRates"
import { CurrencyPair } from "services/currencyPairs"
import { TestThemeProvider } from "utils/testUtils"

jest.mock("services/currencyPairs/currencyPairs")

const currenciesMock: string[] = ["EUR", "USD"]

const currencyPairMock1: CurrencyPair = {
  symbol: "EURUSD",
  base: "EUR",
  terms: "USD",
  ratePrecision: 5,
  pipsPosition: 4,
}

const currencyPairMock2: CurrencyPair = {
  symbol: "GBP/JPY",
  base: "GBP",
  terms: "JPY",
  ratePrecision: 5,
  pipsPosition: 2,
}

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <Subscribe source$={liveRates$} fallback="No data">
        <MainHeader />
        <Tiles />
      </Subscribe>
    </TestThemeProvider>,
  )

const _ccpp = require("services/currencyPairs/currencyPairs")

describe("Tile", () => {
  beforeEach(() => {
    _ccpp.__resetMocks()
  })

  xit("should load all the currency buttons", async () => {
    const currenciesMock$ = new BehaviorSubject<string[]>(currenciesMock)
    _ccpp.__setCurrenciesMock(currenciesMock$)

    renderComponent()

    expect(screen.getAllByRole("menuButton")[0].textContent).toBe(`ALL`)
    expect(screen.getAllByRole("menuButton")[1].textContent).toBe(`EUR`)
    expect(screen.getAllByRole("menuButton")[2].textContent).toBe(`USD`)
  })

  xit("should filter the tiles based on selection", async () => {
    const currenciesMock$ = new BehaviorSubject<string[]>(currenciesMock)
    _ccpp.__setCurrenciesMock(currenciesMock$)

    _ccpp.__setCurrencyPairMock(currencyPairMock1.symbol, currencyPairMock1)
    _ccpp.__setCurrencyPairMock(currencyPairMock2.symbol, currencyPairMock2)

    renderComponent()

    expect(screen.getAllByRole("tile").length).toBe(2)
    act(() => {
      fireEvent.click(screen.getAllByRole("menuButton")[1])
    })

    expect(screen.getAllByRole("tile").length).toBe(1)
    expect(screen.getAllByRole("tile")[0].textContent).toBe(`EUR`)
  })

  xit("should show the charts in tiles once click toggle view button", async () => {
    const currenciesMock$ = new BehaviorSubject<string[]>(currenciesMock)
    _ccpp.__setCurrenciesMock(currenciesMock$)

    _ccpp.__setCurrencyPairMock(currencyPairMock1.symbol, currencyPairMock1)
    _ccpp.__setCurrencyPairMock(currencyPairMock2.symbol, currencyPairMock2)

    renderComponent()

    act(() => {
      fireEvent.click(screen.getAllByRole("toggleButton")[0])
    })

    expect(screen.getAllByRole("tileChart").length).toBe(2)

    act(() => {
      fireEvent.click(screen.getAllByRole("toggleButton")[0])
    })

    expect(screen.getAllByRole("tileChart").length).toBe(0)
  })
})
