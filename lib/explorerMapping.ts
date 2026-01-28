// Mapping of our project slugs to Web3Privacy Explorer slugs
// See docs/EXPLORER_COMPARISON.md for full analysis

export const EXPLORER_SLUG_MAP: Record<string, string> = {
  // Exact matches (29)
  'cake-wallet': 'cake-wallet',
  'concordium': 'concordium',
  'darkfi': 'darkfi',
  'deeper-network': 'deeper-network',
  'elusiv': 'elusiv',
  'fileverse': 'fileverse',
  'findora': 'findora',
  'firo': 'firo',
  'fluidkey': 'fluidkey',
  'hopr': 'hopr',
  'iden3': 'iden3',
  'iron-fish': 'iron-fish',
  'mobilecoin': 'mobilecoin',
  'monero': 'monero',
  'nym': 'nym',
  'oasis-network': 'oasis-network',
  'orchid': 'orchid',
  'oxen': 'oxen',
  'rotki': 'rotki',
  'secret-network': 'secret-network',
  'semaphore': 'semaphore',
  'sentinel': 'sentinel',
  'starkex': 'starkex',
  'suterusu': 'suterusu',
  'wasabi-wallet': 'wasabi-wallet',
  'xx-network': 'xx-network',
  'zano': 'zano',
  'zcash': 'zcash',
  'zeal': 'zeal',

  // Different slugs (6)
  'mask-network': 'mask',
  'mysterium-network': 'mysterium',
  'sienna-network': 'sienna',
  'tornado-cash': 'tornadocash',
  'webb-protocol': 'webb',
  'miden': 'miden-wallet',
};

export function getExplorerUrl(slug: string): string | null {
  const explorerSlug = EXPLORER_SLUG_MAP[slug];
  if (!explorerSlug) return null;
  return `https://explorer.web3privacy.info/project/${explorerSlug}`;
}
