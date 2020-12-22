import ContactUsButton from "./ContactUsButton"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton/StatusButton"
import { serviceStatus$ } from "./StatusButton/serviceStatus"
import { Subscribe } from "@react-rxjs/core"

export const Footer: React.FC = () => (
  <StatusBar>
    <Subscribe source$={serviceStatus$}>
      <ContactUsButton />
      <StatusButton />
    </Subscribe>
  </StatusBar>
)
