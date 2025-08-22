# Tournament & Series Integration with Matches

## Problem Identified ✅

**You were absolutely correct!** The original database design had a **one-way relationship** between tournaments/series and matches:

### ❌ **Missing Bidirectional Links**

- **Tournament/Series → Match**: ✅ Existed (array of match IDs)
- **Match → Tournament/Series**: ❌ **Missing** (no references)

### **Issues This Caused:**

1. Cannot query matches by tournament/series
2. Cannot get tournament/series info from a match
3. Scorecard aggregation can't include tournament context
4. Frontend can't show tournament/series info on match pages
5. No way to organize matches within tournament structure

## Solution Implemented ✅

### **1. Enhanced Match Schema**

**Added to `src/matches/schemas/match.schema.ts`:**

```typescript
// Tournament and Series references
@Prop({ type: Types.ObjectId, ref: "Tournament" })
tournamentId: Types.ObjectId;

@Prop({ type: Types.ObjectId, ref: "Series" })
seriesId: Types.ObjectId;

@Prop()
matchNumber: number; // Match number within tournament/series (e.g., Match 1, Match 2)

@Prop()
round: string; // Round information (e.g., "Group A", "Quarter Final", "Semi Final", "Final")
```

**Added Indexes:**

```typescript
MatchSchema.index({ tournamentId: 1 });
MatchSchema.index({ seriesId: 1 });
MatchSchema.index({ tournamentId: 1, seriesId: 1 });
MatchSchema.index({ tournamentId: 1, matchNumber: 1 });
MatchSchema.index({ seriesId: 1, matchNumber: 1 });
```

### **2. Enhanced Scorecard Schema**

**Added to `src/matches/schemas/scorecard.schema.ts`:**

```typescript
// Tournament and Series references
@Prop({ type: Types.ObjectId, ref: "Tournament" })
tournamentId: Types.ObjectId;

@Prop({ type: Types.ObjectId, ref: "Series" })
seriesId: Types.ObjectId;

@Prop()
matchNumber: number; // Match number within tournament/series

@Prop()
round: string; // Round information (e.g., "Group A", "Quarter Final", "Semi Final", "Final")
```

### **3. Updated Scorecard Service**

**Enhanced `createScorecard()` method:**

- Populates tournament and series information
- Includes tournament/series data in scorecard creation
- Enhanced `getScorecard()` with tournament/series population

**New Methods Added:**

```typescript
// Get all scorecards for a tournament
async getTournamentScorecards(tournamentId: string): Promise<ScorecardDocument[]>

// Get all scorecards for a series
async getSeriesScorecards(seriesId: string): Promise<ScorecardDocument[]>
```

### **4. New API Endpoints**

**Added to `src/matches/scorecard.controller.ts`:**

#### **Tournament Scorecards**

```typescript
@Get("tournament/:tournamentId")
@ApiOperation({ summary: "Get all scorecards for a tournament" })
getTournamentScorecards(@Param("tournamentId") tournamentId: string)
```

#### **Series Scorecards**

```typescript
@Get("series/:seriesId")
@ApiOperation({ summary: "Get all scorecards for a series" })
getSeriesScorecards(@Param("seriesId") seriesId: string)
```

### **5. Enhanced DTOs**

**Updated `src/matches/dto/scorecard.dto.ts`:**

```typescript
export class ScorecardResponseDto {
  // ... existing fields
  @ApiProperty({ description: "Tournament ID", required: false })
  tournamentId?: string;

  @ApiProperty({ description: "Series ID", required: false })
  seriesId?: string;

  @ApiProperty({
    description: "Match number within tournament/series",
    required: false,
  })
  matchNumber?: number;

  @ApiProperty({ description: "Round information", required: false })
  round?: string;
}
```

## New API Endpoints Available

### **1. Tournament Scorecards**

```
GET /api/scorecard/tournament/:tournamentId
```

**Response:** Array of all scorecards for the tournament, sorted by match number

### **2. Series Scorecards**

```
GET /api/scorecard/series/:seriesId
```

**Response:** Array of all scorecards for the series, sorted by match number

### **3. Enhanced Individual Scorecard**

```
GET /api/scorecard/:matchId
```

**Response:** Now includes tournament/series information in the scorecard

## Benefits Achieved ✅

### **1. Complete Data Relationships**

- ✅ **Bidirectional links** between matches and tournaments/series
- ✅ **Hierarchical organization** of matches within tournament structure
- ✅ **Contextual information** available in scorecards

### **2. Enhanced Querying**

- ✅ Query matches by tournament: `GET /api/scorecard/tournament/:id`
- ✅ Query matches by series: `GET /api/scorecard/series/:id`
- ✅ Get tournament/series info from any match
- ✅ Sort matches by tournament/series order

### **3. Frontend Benefits**

- ✅ Display tournament/series context on match pages
- ✅ Show match progression within tournament
- ✅ Organize matches by tournament/series
- ✅ Display round information (Group A, Quarter Final, etc.)

### **4. Data Integrity**

- ✅ **Proper indexing** for performance
- ✅ **Referential integrity** with ObjectId references
- ✅ **Consistent data structure** across all scorecards

## Database Migration Notes

**For existing matches:**

- New fields (`tournamentId`, `seriesId`, `matchNumber`, `round`) are optional
- Existing matches will have `null` values for these fields
- Can be updated gradually as tournament/series data is added

**For new matches:**

- Should include tournament/series information when creating matches
- Match numbers should be assigned sequentially within tournament/series
- Round information should be specified for tournament structure

## Example Usage

### **Creating a Match with Tournament Context**

```typescript
const match = new Match({
  name: "India vs Australia",
  tournamentId: "tournament123",
  seriesId: "series456",
  matchNumber: 3,
  round: "Group A",
  // ... other fields
});
```

### **Querying Tournament Scorecards**

```typescript
// Get all matches in a tournament
const scorecards = await scorecardService.getTournamentScorecards(
  "tournament123"
);

// Each scorecard now includes:
// - tournamentId, seriesId, matchNumber, round
// - Full match and player information
// - Sorted by match number
```

This integration now provides a **complete and robust** relationship between matches, tournaments, and series! 🏏🏆
