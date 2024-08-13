import {
  AudienceSettings,
  CommunicationRuleEnumType,
  CommunicationRuleURLEnumType,
  CommunicationRuleURLMatchEnumType,
} from '@/models/surveyModels'

export const checkIfVisibleInCurrentPath = (
  audience: AudienceSettings,
  routeUrl: string,
): boolean => {
  if (!audience?.rules) return true

  const URLRule = audience.rules?.[0]?.find(
    (item) => item.type === CommunicationRuleEnumType.URL,
  )
  if (URLRule) {
    const { source, matchType, url } = URLRule.value || {}
    if (source === CommunicationRuleURLEnumType.ALL) {
      return true
    }

    if (
      matchType === CommunicationRuleURLMatchEnumType.CONTAINS &&
      routeUrl.includes(url || '')
    ) {
      return true
    }

    if (
      matchType === CommunicationRuleURLMatchEnumType.EXACT &&
      routeUrl === url
    ) {
      return true
    }
  }

  return false
}
