#!/bin/bash
# Zano Privacy Project - Research Commands Reference
# Date: 2025-10-07
# Constitutional Research v2.0.0

# =============================================================================
# GitHub Repository Research
# =============================================================================

# Fetch repository metadata
curl -s "https://api.github.com/repos/hyle-team/zano" | \
  jq -r '{name, full_name, description, html_url, homepage, created_at, updated_at, pushed_at, stargazers_count, watchers_count, forks_count, language, topics, license}'

# Fetch README content
curl -s "https://raw.githubusercontent.com/hyle-team/zano/master/README.md" | head -100

# Get top contributors
curl -s "https://api.github.com/repos/hyle-team/zano/contributors" | \
  jq -r '.[0:10] | .[] | {login, contributions, html_url}'

# Research specific contributors
curl -s "https://api.github.com/users/cryptozoidberg" | \
  jq -r '{login, name, company, blog, location, bio}'

curl -s "https://api.github.com/users/sowle" | \
  jq -r '{login, name, company, blog, location, bio}'

# =============================================================================
# Website Data Extraction
# =============================================================================

# Extract website metadata
curl -sL "https://zano.org" | grep -Eo '<meta[^>]*>' | head -30

# Fetch about page
curl -sL "https://zano.org/about" 2>/dev/null | head -200

# Check documentation site
curl -sL "https://docs.zano.org" 2>/dev/null | head -100

# Find logo files
curl -sL "https://zano.org" | grep -Eo 'zano.*\.(png|jpg|svg)' | head -5

# Extract social media links
curl -sL "https://zano.org" | \
  grep -Eo '(twitter|discord|telegram|reddit|github|medium)\.com/[a-zA-Z0-9_/-]+' | \
  sort -u

# =============================================================================
# CoinGecko Market Data
# =============================================================================

# Fetch comprehensive coin data
curl -s "https://api.coingecko.com/api/v3/coins/zano" | \
  jq -r '{id, symbol, name, description: .description.en[0:500], homepage: .links.homepage[0], blockchain_site: .links.blockchain_site[0:3], official_forum_url: .links.official_forum_url[0:3], twitter_screen_name, telegram_channel_identifier, subreddit_url, github: .links.repos_url.github[0], market_cap_rank, coingecko_rank, community_score}'

# Get logo URLs
curl -s "https://api.coingecko.com/api/v3/coins/zano" | jq -r '.image'

# Fetch detailed market and technical data
curl -s "https://api.coingecko.com/api/v3/coins/zano" | \
  jq -r '{market_data: {current_price_usd: .market_data.current_price.usd, market_cap_usd: .market_data.market_cap.usd, total_volume: .market_data.total_volume.usd, circulating_supply: .market_data.circulating_supply, total_supply: .market_data.total_supply, max_supply: .market_data.max_supply}, genesis_date: .genesis_date, hashing_algorithm: .hashing_algorithm, categories: .categories}'

# =============================================================================
# Blockchain Explorer
# =============================================================================

# Check blockchain explorer
curl -s "https://explorer.zano.org" | head -100 | \
  grep -Eo 'blockchain|network|chain' | head -5

# =============================================================================
# Documentation Research
# =============================================================================

# Extract Discord link from docs
curl -sL "https://docs.zano.org" | grep -Eo 'discord\.gg/[a-zA-Z0-9]+' | head -1

# Extract privacy features from documentation
curl -sL "https://docs.zano.org/docs/learn/what-is-zano" 2>/dev/null | \
  grep -o '<[^>]*>[^<]*privacy[^<]*<' | head -5

# Get GitHub topics
curl -s "https://api.github.com/repos/hyle-team/zano" | jq -r '.topics'

# =============================================================================
# Data Verification Commands
# =============================================================================

# Verify website is accessible
curl -I -s "https://zano.org" | head -1

# Verify GitHub repository exists
curl -I -s "https://github.com/hyle-team/zano" | head -1

# Verify documentation site
curl -I -s "https://docs.zano.org" | head -1

# Verify blockchain explorer
curl -I -s "https://explorer.zano.org" | head -1

# =============================================================================
# File Organization
# =============================================================================

# Create directory structure
mkdir -p /home/flower/web3privacy-research/deliverables/zano/sources

# List research files
ls -lah /home/flower/web3privacy-research/deliverables/zano/

# =============================================================================
# Data Quality Checks
# =============================================================================

# Validate JSON output
cat /home/flower/web3privacy-research/deliverables/zano/sources/verified_data.json | jq '.'

# Count sources
cat /home/flower/web3privacy-research/deliverables/zano/sources/verified_data.json | \
  jq '.source_registry | length'

# Check constitutional compliance
cat /home/flower/web3privacy-research/deliverables/zano/sources/verified_data.json | \
  jq '.constitutional_compliance'

# Calculate average confidence
cat /home/flower/web3privacy-research/deliverables/zano/sources/verified_data.json | \
  jq '.metadata.confidence_score_average'

# =============================================================================
# Quick Reference Commands
# =============================================================================

# View research summary
cat /home/flower/web3privacy-research/deliverables/zano/sources/research_summary.md

# Check all deliverables
find /home/flower/web3privacy-research/deliverables/zano -type f -name "*.json" -o -name "*.md"

# Count total data points collected
cat /home/flower/web3privacy-research/deliverables/zano/sources/verified_data.json | \
  jq '[.tier1_core_data, .tier2_detailed_data, .tier3_extended_data] | [.. | objects | select(has("confidence"))] | length'

# List all gaps
cat /home/flower/web3privacy-research/deliverables/zano/sources/verified_data.json | \
  jq '.gaps_identified[] | {field, severity, reason}'

# =============================================================================
# Notes
# =============================================================================

# All commands follow constitutional requirements:
# - Real data only (no fabrication)
# - Multi-source verification
# - Confidence scoring
# - Gap reporting

# Research Date: 2025-10-07
# Constitutional Version: 2.0.0
# Researcher: Research Agent
