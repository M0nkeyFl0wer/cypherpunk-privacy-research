# Technical Overview

*Research Date: 2025-10-05*
*Constitution v2.0.0 Compliance: ✅*

---

## Technology Stack

### Primary Technologies

- **communication_protocol:** Waku v2 (peer-to-peer messaging)
- **blockchain:** Ethereum Mainnet
- **token_standard:** ERC-20 (SNT)
- **programming_languages:** {'mobile_app': 'Clojure/ClojureScript', 'framework': 'React Native, re-frame, reagent', 'waku_nim': 'Nim (nwaku implementation)', 'waku_go': 'Go (go-waku implementation)', 'backend': 'Go (status-go)'}
- **platforms:** ['iOS (App Store)', 'Android (Google Play, F-Droid)', 'Desktop (Windows, macOS, Linux)']
- **repositories:** {'waku_protocol': [{'name': 'nwaku', 'description': 'Nim implementation of Waku protocol', 'url': 'https://github.com/waku-org/nwaku', 'stars': 228, 'forks': 76, 'language': 'Nim', 'confidence': 0.95}, {'name': 'go-waku', 'description': 'Go implementation of Waku v2 protocol', 'url': 'https://github.com/waku-org/go-waku', 'confidence': 0.9}], 'status_apps': {'mobile': {'url': 'https://github.com/status-im/status-mobile', 'stars': 3999, 'forks': 1004, 'watchers': 3999, 'language': 'Clojure', 'license': 'Mozilla Public License 2.0 (MPL-2.0)', 'created': '2016-02-22', 'updated': '2025-10-01', 'confidence': 0.95}, 'desktop': {'url': 'https://github.com/status-im/status-desktop', 'stars': 338, 'forks': 87, 'watchers': 338, 'language': 'QML', 'open_issues': 918, 'updated': '2025-10-03', 'confidence': 0.95}, 'backend': {'url': 'https://github.com/status-im/status-go', 'stars': 752, 'forks': 261, 'watchers': 752, 'language': 'Go', 'license': 'Mozilla Public License 2.0 (MPL-2.0)', 'open_issues': 318, 'updated': '2025-10-03', 'confidence': 0.95}}}
- **waku_protocol_features:** {'relay': 'Pubsub approach with focus on privacy and censorship-resistance', 'filter': 'Lightweight subscription for bandwidth-restricted devices', 'lightpush': 'Push messages without running full relay protocol', 'store': 'Retrieve message history from other nodes', 'confidence': 0.9}
- **encryption:** End-to-end encryption, Perfect Forward Secrecy, peer-to-peer architecture
- **privacy_features:** ['No centralized servers storing message history', 'User controls personal data sharing', 'State-of-the-art encryption technology (Double Ratchet)', 'No third-party access to communications', 'Anonymous Filter Subscription (in development)', 'Anonymous Query for Store protocol (in development)']
