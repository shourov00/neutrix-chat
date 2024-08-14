import {
  AudienceSettings,
  CommunicationRuleEnumType,
  CommunicationRuleURLEnumType,
  CommunicationRuleURLMatchEnumType,
} from '@/models/surveyModels'
import { getDeviceType } from '@/utils/announcement.utils'

/**
 * Function to check if a certain component should be visible based on the current path (URL) or current device and audience settings.
 * @param {AudienceSettings} audience - Audience settings that include visibility rules.
 * @param {string} routeUrl - Current route URL to check against the rules.
 * @returns {boolean} - Returns true if the component should be visible, false otherwise.
 */
export const checkIfVisibleInCurrentPath = (
  audience: AudienceSettings,
  routeUrl: string,
): boolean => {
  if (!audience?.rules) return true

  const URLRule = audience.rules?.[0]?.find(
    (item) => item.type === CommunicationRuleEnumType.URL,
  )
  const deviceRule = audience.rules?.[2]?.find(
    (item) => item.type === CommunicationRuleEnumType.DEVICE,
  )

  const currentDevice = getDeviceType()

  let shouldReturn = false

  if (URLRule) {
    const { source, matchType, url } = URLRule.value || {}
    if (source === CommunicationRuleURLEnumType.ALL) {
      shouldReturn = true
    }

    if (
      matchType === CommunicationRuleURLMatchEnumType.CONTAINS &&
      routeUrl.includes(url || '')
    ) {
      shouldReturn = true
    }

    if (
      matchType === CommunicationRuleURLMatchEnumType.EXACT &&
      routeUrl === url
    ) {
      shouldReturn = true
    }
  }

  if (deviceRule && shouldReturn) {
    const { device } = deviceRule.value || {}
    if (device === currentDevice) {
      shouldReturn = true
    }
  }

  return shouldReturn
}
