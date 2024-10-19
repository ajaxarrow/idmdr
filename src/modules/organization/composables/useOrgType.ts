export const useOrgType = () => {
  const getOrganizationType = (x: number) => {
    switch(x) {
      case 1:
        return "Government";
      case 2:
        return "Private";
      case 3:
        return "Public";
      case 4:
        return "Internatonal";
      case 5:
        return "Public";
      case 6:
        return "Others";
      default:
        return "Unknown";
    }
  }

  const getOrganizationSubType = (x: number) => {
    switch(x) {
      case 1:
        return "Academia";
      case 2:
        return "Research";
      case 3:
        return "Agency";
      case 4:
        return "Institutional";
      default:
        return "Unknown";
    }
  }
  return {
    getOrganizationType,
    getOrganizationSubType
  }
}