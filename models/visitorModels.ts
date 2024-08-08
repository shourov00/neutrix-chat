interface Visitor {
  siteId?: string
  blocked?: boolean
  color?: string
  device?: Device[]
  fruit?: string
  geo?: Geo[]
  ip?: string[]
  lastSessionId?: string
  locale?: string[]
  mood?: number
  referrer?: Referrer
  starred?: boolean
  url?: Url
  visits?: number
  name?: string
}

interface Device {
  browserName?: string
  browserFull?: string
  osName?: string
  osFull?: string
  deviceType?: string
}

interface Location {
  lat?: number
  lon?: number
}

interface Geo {
  city?: string
  countryIso?: string
  countryName?: string
  continentCode?: string
  continentName?: string
  postalCode?: string
  regionName?: string
  regionCode?: string
  timezone?: string
  location?: Location
}

interface Referrer {
  known?: boolean
  domain?: string
  source?: string
  medium?: string
  term?: string
  uri?: string
}

interface Url {
  hash?: string
  host?: string
  path?: string
  port?: string
  protocol?: string
  search?: string
  href?: string
}
