# Dynamic Selector Management System

## Overview

The Dynamic Selector Management System is a config-driven scraping solution that allows all CSS/XPath selectors to be managed externally without code changes. This system provides automatic failover, self-healing capabilities, and real-time selector updates.

## Features

### 1. Config-Driven Selectors

- All selectors stored in `src/scrapers/config/selectors.json`
- Hot-reloading without application restart
- Version control and change tracking
- Support for multiple sources (ESPNcricinfo, Cricbuzz, Flashscore, Crex.live)

### 2. Dynamic Loading

- Selectors loaded at runtime from external config
- Automatic config file watching for changes
- In-memory caching for performance
- Config validation and error handling

### 3. Auto-Detection & Self-Healing

- Automatic detection of selector failures
- Fuzzy matching to find alternative selectors
- Fallback selector chains (primary → fallback → global)
- Human verification flags for suggested fixes

### 4. Failover Logic

- Primary source with backup sources
- Automatic switching on failures
- Configurable reliability thresholds
- Detailed logging of all failover events

### 5. Integration with Existing System

- Works with current backend API
- Maintains same JSON output format
- Compatible with existing match management
- No breaking changes to existing functionality

## Configuration Structure

### Selectors Configuration (`selectors.json`)

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-15T10:00:00Z",
  "sources": {
    "espn": {
      "name": "ESPNcricinfo",
      "baseUrl": "https://www.espncricinfo.com",
      "selectors": {
        "team1Name": ".team-1 .team-name, .team-1 h3, .team-1 .name",
        "team1Score": ".team-1 .score, .team-1 .runs, .team-1 [data-testid='score']",
        "team1Wickets": ".team-1 .wickets, .team-1 .wicket-count, .team-1 [data-testid='wickets']",
        "team1Overs": ".team-1 .overs, .team-1 .over-count, .team-1 [data-testid='overs']"
      },
      "fallbackSelectors": {
        "team1Name": [".team1", ".batting-team", "[data-team='1']"],
        "team1Score": [".score-team1", ".runs-team1", "[data-score='team1']"]
      }
    }
  },
  "globalFallbacks": {
    "teamName": ["[class*='team'] [class*='name']", "[class*='team'] h3"],
    "score": ["[class*='score']", "[class*='runs']", "[data-score]"],
    "wickets": ["[class*='wicket']", "[class*='out']", "[data-wickets]"],
    "overs": ["[class*='over']", "[class*='ball']", "[data-overs]"]
  },
  "autoDetection": {
    "enabled": true,
    "fuzzyMatchThreshold": 0.8,
    "maxAttempts": 5,
    "searchPatterns": {
      "teamName": ["team", "name", "title"],
      "score": ["score", "runs", "total"],
      "wickets": ["wicket", "out", "fall"],
      "overs": ["over", "ball", "progress"]
    }
  }
}
```

## API Endpoints

### Selector Management

#### Get Configuration

```http
GET /api/selectors/config
```

#### Get All Sources

```http
GET /api/selectors/sources
```

#### Get Source Selectors

```http
GET /api/selectors/sources/{source}
```

#### Get Specific Selector

```http
GET /api/selectors/sources/{source}/{field}
```

#### Update Selector

```http
PUT /api/selectors/sources/{source}/{field}
Content-Type: application/json

{
  "selector": ".new-selector",
  "validate": true
}
```

#### Get Failures

```http
GET /api/selectors/failures?source=espn&field=team1Name&limit=50
```

#### Clear Failures

```http
DELETE /api/selectors/failures
```

#### Get Auto-Detection Status

```http
GET /api/selectors/auto-detection/status
```

#### Get Global Fallbacks

```http
GET /api/selectors/global-fallbacks
```

#### Reload Configuration

```http
POST /api/selectors/reload
```

#### System Health

```http
GET /api/selectors/health
```

## Usage Examples

### 1. Basic Scraping with Dynamic Selectors

```typescript
// The scraper automatically uses dynamic selectors
const result = await scrapersService.scrapeMatchData(matchId);
```

### 2. Updating a Selector

```typescript
// Via API
const response = await fetch("/api/selectors/sources/espn/team1Name", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    selector: ".new-team-name-selector",
    validate: true,
  }),
});
```

### 3. Monitoring Failures

```typescript
// Get recent failures
const failures = await fetch("/api/selectors/failures?limit=10");
```

## Architecture

### Components

1. **DynamicSelectorManagerService**: Core service managing selector configuration
2. **CrexScraper**: New scraper for Crex.live with dynamic selector support
3. **SelectorManagementController**: API endpoints for managing selectors
4. **Base Scrapers**: Updated to use dynamic selectors

### Flow

1. **Initialization**: Load selectors from `selectors.json`
2. **Scraping**: Use selectors from config, try fallbacks if needed
3. **Failure Detection**: Record failures and attempt auto-detection
4. **Self-Healing**: Update selectors in memory, flag for verification
5. **Monitoring**: Track failures and system health

## Error Handling

### Selector Failures

- Primary selector fails → Try fallback selectors
- Fallback selectors fail → Try global fallbacks
- All fail → Record failure for auto-detection

### Auto-Detection

- Analyze DOM structure
- Use fuzzy matching with search patterns
- Suggest new selectors
- Flag for human verification

### Failover

- Source becomes unreliable → Switch to backup
- All sources fail → Return error with details
- Log all failover events

## Monitoring & Logging

### Metrics Tracked

- Total selector failures
- Auto-detection success rate
- Failover frequency
- Config reload events
- System uptime

### Log Levels

- **INFO**: Normal operations, config loads
- **WARN**: Selector failures, fallback usage
- **ERROR**: Complete failures, system issues
- **DEBUG**: Detailed selector attempts

## Best Practices

### 1. Selector Design

- Use multiple selectors per field (comma-separated)
- Include fallback selectors for each field
- Use data attributes when available
- Avoid overly specific selectors

### 2. Configuration Management

- Version control your `selectors.json`
- Test selectors before updating
- Monitor failure rates
- Regular backup of configurations

### 3. Monitoring

- Set up alerts for high failure rates
- Monitor auto-detection success
- Track failover frequency
- Regular health checks

### 4. Maintenance

- Regular review of failed selectors
- Update selectors based on website changes
- Clean up old failure logs
- Optimize fallback chains

## Troubleshooting

### Common Issues

1. **Selector Not Found**

   - Check if field exists in config
   - Verify source is configured
   - Check for typos in field names

2. **High Failure Rate**

   - Review website changes
   - Update selectors
   - Check network connectivity
   - Verify proxy configuration

3. **Auto-Detection Not Working**

   - Ensure auto-detection is enabled
   - Check fuzzy match threshold
   - Verify search patterns
   - Review DOM structure

4. **Config Not Reloading**
   - Check file permissions
   - Verify file path
   - Check for JSON syntax errors
   - Restart application if needed

### Debug Commands

```bash
# Check config status
curl -X GET "http://localhost:3000/api/selectors/health"

# View recent failures
curl -X GET "http://localhost:3000/api/selectors/failures?limit=10"

# Get source selectors
curl -X GET "http://localhost:3000/api/selectors/sources/espn"

# Test selector update
curl -X PUT "http://localhost:3000/api/selectors/sources/espn/team1Name" \
  -H "Content-Type: application/json" \
  -d '{"selector": ".test-selector"}'
```

## Future Enhancements

1. **Machine Learning**: Train models to predict selector changes
2. **Visual Selector Builder**: GUI for creating selectors
3. **A/B Testing**: Test multiple selector strategies
4. **Performance Optimization**: Cache successful selectors
5. **Advanced Validation**: Semantic validation of extracted data
6. **Integration APIs**: Webhook notifications for selector changes
7. **Analytics Dashboard**: Real-time monitoring interface
8. **Selector Marketplace**: Share and rate selectors

## Security Considerations

1. **Access Control**: Only admins can update selectors
2. **Validation**: All selectors validated before use
3. **Rate Limiting**: Prevent abuse of update endpoints
4. **Audit Logging**: Track all selector changes
5. **Backup**: Regular backup of configurations
6. **Input Sanitization**: Validate selector syntax
7. **Error Handling**: Don't expose internal errors
8. **Monitoring**: Alert on suspicious activity
