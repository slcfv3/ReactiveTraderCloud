import ContactUsButton from "./ContactUsButton"
import { merge } from "rxjs"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { serviceStatus$, applicationStatus$ } from "./StatusButton/StatusButton"
import { Subscribe } from "@react-rxjs/core"

const footer$ = merge(serviceStatus$, applicationStatus$)
export const Footer: React.FC = () => (
  <StatusBar>
    <Subscribe source$={footer$}>
      <ContactUsButton />
      <StatusButton />
    </Subscribe>
  </StatusBar>
)
