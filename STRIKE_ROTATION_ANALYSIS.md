# 🔍 Strike Rotation Analysis - Missing Cases & Edge Cases

## 📋 Current Implementation Status

### ✅ **What's Currently Implemented:**

1. **Basic CRUD Operations**

   - ✅ Update strike rotation via API
   - ✅ Get current strike rotation
   - ✅ WebSocket real-time updates
   - ✅ Basic validation (MongoDB ObjectId)

2. **Schema Structure**
   - ✅ `currentPlayers.striker` (ObjectId)
   - ✅ `currentPlayers.nonStriker` (ObjectId)
   - ✅ `currentPlayers.bowler` (ObjectId)
   - ✅ `currentPlayers.lastUpdated` (Date)

## ❌ **Missing Cases & Edge Cases**

### 1. **Validation Cases**

#### **Player Existence Validation**

```typescript
// MISSING: Validate that players exist in the database
async updateStrikeRotation(matchId: string, strikeRotationDto: UpdateStrikeRotationDto): Promise<Match> {
  // Should validate:
  // 1. Striker exists in Players collection
  // 2. Non-striker exists in Players collection
  // 3. Bowler exists in Players collection
  // 4. All players are valid ObjectIds
}
```

#### **Player Team Validation**

```typescript
// MISSING: Validate players belong to correct teams
// Should check:
// 1. Striker and non-striker are from the same team (batting team)
// 2. Bowler is from the opposite team (bowling team)
// 3. Players are part of the match squads/playing XI
```

#### **Match State Validation**

```typescript
// MISSING: Validate match is in correct state for strike rotation
// Should check:
// 1. Match is LIVE (not SCHEDULED, COMPLETED, CANCELLED)
// 2. Match has started (currentInnings > 0)
// 3. Match is not in break/intermission
```

### 2. **Business Logic Cases**

#### **Automatic Strike Rotation on Runs**

```typescript
// MISSING: Automatic strike rotation on odd runs
// When runs scored are odd numbers (1, 3, 5), striker and non-striker should swap
// This should happen automatically in the balls service
```

#### **Wicket Fall Handling**

```typescript
// MISSING: Handle strike rotation when wicket falls
// 1. New batsman comes in at non-striker's end
// 2. Non-striker becomes striker
// 3. Update currentPlayers accordingly
```

#### **Over Change Handling**

```typescript
// MISSING: Handle strike rotation on over change
// 1. Striker and non-striker swap ends
// 2. Update currentPlayers accordingly
// 3. New bowler comes in
```

#### **Innings Change Handling**

```typescript
// MISSING: Handle strike rotation on innings change
// 1. Reset currentPlayers for new innings
// 2. New batting team's players become striker/non-striker
// 3. New bowling team's player becomes bowler
```

### 3. **Edge Cases**

#### **Player Substitution**

```typescript
// MISSING: Handle player substitutions
// 1. Retired hurt
// 2. Concussion substitute
// 3. Injury replacement
// 4. Update currentPlayers when substitutions happen
```

#### **Power Play/Field Restrictions**

```typescript
// MISSING: Handle fielding restrictions
// 1. Power play periods
// 2. Field restrictions
// 3. Impact on bowling changes
```

#### **DLS/Weather Interruptions**

```typescript
// MISSING: Handle match interruptions
// 1. Rain delays
// 2. DLS adjustments
// 3. Resume with correct players
```

### 4. **Data Integrity Cases**

#### **Concurrent Updates**

```typescript
// MISSING: Handle concurrent strike rotation updates
// 1. Race conditions
// 2. Optimistic locking
// 3. Conflict resolution
```

#### **Data Consistency**

```typescript
// MISSING: Ensure data consistency
// 1. Striker ≠ Non-striker
// 2. Bowler ≠ Striker and Bowler ≠ Non-striker
// 3. All players are from correct teams
```

## 🔧 **Required Implementation**

### 1. **Enhanced Validation Service**

```typescript
// src/matches/validators/strike-rotation.validator.ts
export class StrikeRotationValidator {
  async validateStrikeRotation(
    matchId: string,
    strikeRotationDto: UpdateStrikeRotationDto
  ): Promise<ValidationResult> {
    const validations = [
      this.validateMatchExists(matchId),
      this.validateMatchState(matchId),
      this.validatePlayersExist(strikeRotationDto),
      this.validatePlayerTeams(matchId, strikeRotationDto),
      this.validatePlayerUniqueness(strikeRotationDto),
      this.validatePlayerInSquad(matchId, strikeRotationDto),
    ];

    const results = await Promise.all(validations);
    return this.aggregateResults(results);
  }

  private async validateMatchExists(
    matchId: string
  ): Promise<ValidationResult> {
    const match = await this.matchModel.findById(matchId);
    return {
      valid: !!match,
      error: !match ? "Match not found" : null,
    };
  }

  private async validateMatchState(matchId: string): Promise<ValidationResult> {
    const match = await this.matchModel.findById(matchId);
    const validStates = ["LIVE", "IN_PROGRESS"];

    return {
      valid: validStates.includes(match?.status),
      error: !validStates.includes(match?.status)
        ? "Match is not in progress"
        : null,
    };
  }

  private async validatePlayersExist(
    dto: UpdateStrikeRotationDto
  ): Promise<ValidationResult> {
    const playerIds = [dto.striker, dto.nonStriker, dto.bowler].filter(Boolean);
    const players = await this.playerModel.find({ _id: { $in: playerIds } });

    return {
      valid: players.length === playerIds.length,
      error:
        players.length !== playerIds.length
          ? "One or more players not found"
          : null,
    };
  }

  private async validatePlayerTeams(
    matchId: string,
    dto: UpdateStrikeRotationDto
  ): Promise<ValidationResult> {
    const match = await this.matchModel
      .findById(matchId)
      .populate("teamAId")
      .populate("teamBId");

    // Validate striker and non-striker are from same team
    // Validate bowler is from opposite team
    // Implementation details...
  }

  private async validatePlayerUniqueness(
    dto: UpdateStrikeRotationDto
  ): Promise<ValidationResult> {
    const players = [dto.striker, dto.nonStriker, dto.bowler].filter(Boolean);
    const uniquePlayers = new Set(players);

    return {
      valid: uniquePlayers.size === players.length,
      error:
        uniquePlayers.size !== players.length
          ? "Duplicate players not allowed"
          : null,
    };
  }

  private async validatePlayerInSquad(
    matchId: string,
    dto: UpdateStrikeRotationDto
  ): Promise<ValidationResult> {
    const match = await this.matchModel.findById(matchId);
    const allSquadPlayers = [
      ...(match.squads?.teamA || []),
      ...(match.squads?.teamB || []),
    ];

    const playerIds = [dto.striker, dto.nonStriker, dto.bowler].filter(Boolean);
    const allInSquad = playerIds.every((id) => allSquadPlayers.includes(id));

    return {
      valid: allInSquad,
      error: !allInSquad ? "All players must be in match squad" : null,
    };
  }
}
```

### 2. **Automatic Strike Rotation Logic**

```typescript
// src/balls/services/strike-rotation.service.ts
export class StrikeRotationService {
  async handleAutomaticStrikeRotation(
    matchId: string,
    ballData: any
  ): Promise<void> {
    const match = await this.matchesService.findById(matchId);

    // Handle odd runs - swap striker and non-striker
    if (ballData.eventType === "runs" && ballData.runs % 2 === 1) {
      await this.swapStrikerAndNonStriker(matchId);
    }

    // Handle over change - swap striker and non-striker
    if (ballData.eventType === "over_change") {
      await this.swapStrikerAndNonStriker(matchId);
    }

    // Handle wicket fall
    if (ballData.eventType === "wicket") {
      await this.handleWicketFall(matchId, ballData);
    }

    // Handle innings change
    if (ballData.eventType === "innings_change") {
      await this.handleInningsChange(matchId, ballData);
    }
  }

  private async swapStrikerAndNonStriker(matchId: string): Promise<void> {
    const match = await this.matchesService.findById(matchId);
    const currentStriker = match.currentPlayers?.striker;
    const currentNonStriker = match.currentPlayers?.nonStriker;

    await this.matchesService.updateStrikeRotation(matchId, {
      striker: currentNonStriker,
      nonStriker: currentStriker,
    });
  }

  private async handleWicketFall(
    matchId: string,
    ballData: any
  ): Promise<void> {
    // Logic to handle new batsman coming in
    // Update currentPlayers with new batsman at non-striker's end
  }

  private async handleInningsChange(
    matchId: string,
    ballData: any
  ): Promise<void> {
    // Reset currentPlayers for new innings
    // Set new batting team's players as striker/non-striker
    // Set new bowling team's player as bowler
  }
}
```

### 3. **Enhanced DTOs with Validation**

```typescript
// src/matches/dto/strike-rotation.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import {
  IsMongoId,
  IsOptional,
  IsDate,
  ValidateIf,
  IsNotEmpty,
} from "class-validator";
import { IsPlayerInMatch } from "../validators/player-in-match.validator";

export class UpdateStrikeRotationDto {
  @ApiProperty({ description: "Striker player ID", required: false })
  @IsOptional()
  @IsMongoId()
  @IsPlayerInMatch("striker")
  striker?: string;

  @ApiProperty({ description: "Non-striker player ID", required: false })
  @IsOptional()
  @IsMongoId()
  @IsPlayerInMatch("nonStriker")
  nonStriker?: string;

  @ApiProperty({ description: "Bowler player ID", required: false })
  @IsOptional()
  @IsMongoId()
  @IsPlayerInMatch("bowler")
  bowler?: string;

  @ValidateIf((o) => o.striker || o.nonStriker || o.bowler)
  @IsNotEmpty({ message: "At least one player must be specified" })
  _atLeastOnePlayer?: boolean;
}
```

### 4. **Enhanced Service with All Cases**

```typescript
// src/matches/matches.service.ts
async updateStrikeRotation(
  matchId: string,
  strikeRotationDto: UpdateStrikeRotationDto
): Promise<Match> {
  // 1. Validate all cases
  const validationResult = await this.strikeRotationValidator
    .validateStrikeRotation(matchId, strikeRotationDto);

  if (!validationResult.valid) {
    throw new BadRequestException(validationResult.error);
  }

  // 2. Check for concurrent updates
  const match = await this.findById(matchId);
  if (match.currentPlayers?.lastUpdated > new Date(Date.now() - 5000)) {
    throw new ConflictException('Strike rotation was recently updated. Please refresh and try again.');
  }

  // 3. Build update data
  const updateData: any = {
    "currentPlayers.lastUpdated": new Date(),
  };

  if (strikeRotationDto.striker) {
    updateData["currentPlayers.striker"] = new Types.ObjectId(strikeRotationDto.striker);
  }
  if (strikeRotationDto.nonStriker) {
    updateData["currentPlayers.nonStriker"] = new Types.ObjectId(strikeRotationDto.nonStriker);
  }
  if (strikeRotationDto.bowler) {
    updateData["currentPlayers.bowler"] = new Types.ObjectId(strikeRotationDto.bowler);
  }

  // 4. Update with optimistic locking
  const updatedMatch = await this.matchModel
    .findByIdAndUpdate(
      matchId,
      updateData,
      {
        new: true,
        runValidators: true,
        // Optimistic locking
        versionKey: true
      }
    )
    .populate("teamAId", "name shortName")
    .populate("teamBId", "name shortName")
    .populate("currentPlayers.striker", "fullName shortName")
    .populate("currentPlayers.nonStriker", "fullName shortName")
    .populate("currentPlayers.bowler", "fullName shortName")
    .exec();

  if (!updatedMatch) {
    throw new NotFoundException("Match not found or was modified by another user");
  }

  // 5. Log the change for audit
  await this.auditService.logStrikeRotationChange(matchId, strikeRotationDto);

  return updatedMatch;
}
```

### 5. **Frontend Validation**

```typescript
// src/components/admin/LiveScoring.tsx
const validateStrikeRotation = (strikeRotation: any) => {
  const errors: string[] = [];

  // Check for duplicate players
  const players = [
    strikeRotation.striker,
    strikeRotation.nonStriker,
    strikeRotation.bowler,
  ];
  const uniquePlayers = new Set(players.filter(Boolean));
  if (uniquePlayers.size !== players.filter(Boolean).length) {
    errors.push("Duplicate players are not allowed");
  }

  // Check striker and non-striker are different
  if (strikeRotation.striker === strikeRotation.nonStriker) {
    errors.push("Striker and non-striker must be different players");
  }

  // Check bowler is different from batsmen
  if (
    strikeRotation.bowler === strikeRotation.striker ||
    strikeRotation.bowler === strikeRotation.nonStriker
  ) {
    errors.push("Bowler must be different from batsmen");
  }

  return errors;
};
```

## 🎯 **Priority Implementation Order**

### **Phase 1: Critical Validations**

1. ✅ Player existence validation
2. ✅ Player uniqueness validation
3. ✅ Match state validation
4. ✅ Basic team validation

### **Phase 2: Business Logic**

1. ✅ Automatic strike rotation on odd runs
2. ✅ Over change handling
3. ✅ Wicket fall handling
4. ✅ Innings change handling

### **Phase 3: Edge Cases**

1. ✅ Player substitution handling
2. ✅ Concurrent update protection
3. ✅ Audit logging
4. ✅ Frontend validation

### **Phase 4: Advanced Features**

1. ✅ Power play handling
2. ✅ DLS/weather interruptions
3. ✅ Advanced team validation
4. ✅ Performance optimization

## 📊 **Testing Scenarios**

### **Unit Tests Required**

```typescript
describe("StrikeRotationService", () => {
  it("should swap striker and non-striker on odd runs", () => {});
  it("should swap striker and non-striker on over change", () => {});
  it("should handle wicket fall correctly", () => {});
  it("should handle innings change correctly", () => {});
  it("should validate player uniqueness", () => {});
  it("should validate player teams", () => {});
  it("should handle concurrent updates", () => {});
  it("should prevent invalid player assignments", () => {});
});
```

### **Integration Tests Required**

```typescript
describe("StrikeRotation Integration", () => {
  it("should update strike rotation via API", () => {});
  it("should broadcast updates via WebSocket", () => {});
  it("should handle automatic updates from ball events", () => {});
  it("should maintain data consistency across services", () => {});
});
```

This comprehensive analysis shows that while the basic strike rotation functionality is implemented, there are many critical cases missing that are essential for a production-ready cricket scoring system! 🏏
