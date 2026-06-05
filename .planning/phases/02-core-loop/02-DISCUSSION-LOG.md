# Phase 2: Core Loop - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-05-29
**Phase:** 02-core-loop
**Areas discussed:** Submission flow, Video bonus mechanic, Leaderboard layout, Week navigation

---

## Submission Flow

### Upload UX

| Option | Description | Selected |
|--------|-------------|----------|
| Submit button on card | Add a 'Submit Video' button directly on the skill and fitness challenge cards. Tapping it opens the Cloudinary Upload Widget as a modal overlay. After successful upload, show inline confirmation with points awarded -- no page navigation. | ✓ |
| Separate submit page | Tapping 'Submit' navigates to /challenge/submit with the kid and challenge pre-selected. Full-page upload experience. | |
| You decide | Claude picks the best approach based on codebase patterns and mobile UX. | |

**User's choice:** Submit button on card
**Notes:** None

### Post-Upload Confirmation

| Option | Description | Selected |
|--------|-------------|----------|
| Inline success state | Submit button transforms into a green checkmark with '+1 point' and the kid's updated total. Card shows 'Submitted' state for the rest of the day. | ✓ |
| Confirmation modal | Brief modal overlay showing points awarded with a dismiss button. | |
| You decide | Claude picks based on mobile UX best practices. | |

**User's choice:** Inline success state
**Notes:** None

### Daily Cap UX

| Option | Description | Selected |
|--------|-------------|----------|
| Disabled button with message | Submit button grays out and shows 'Come back tomorrow!' underneath. Clear but not punishing. | ✓ |
| Hide buttons entirely | Once both are submitted for the day, hide the submit buttons completely. | |
| You decide | Claude picks the friendliest UX. | |

**User's choice:** Disabled button with message
**Notes:** None

---

## Video Bonus Mechanic

### Checkbox Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Below the embedded video | Checkbox below the YouTube instructional embed: 'I watched the video (+1 bonus point)'. One-time per kid per week. | ✓ |
| During submission flow | Checkbox appears after Cloudinary upload completes, before confirmation. | |
| You decide | Claude picks based on the flow. | |

**User's choice:** Below the embedded video
**Notes:** None

### No-Video Weeks

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-grant bonus for no-video weeks | Bonus point auto-awarded when no video exists. Keeps max-15 math consistent. | |
| Skip bonus for no-video weeks | No video = no bonus point that week. Simpler. | ✓ |
| You decide | Claude picks. | |

**User's choice:** Skip bonus for no-video weeks
**Notes:** Max points drops from 15 to 14 for weeks without instructional videos. Accepted tradeoff.

---

## Leaderboard Layout

### Design Fidelity

| Option | Description | Selected |
|--------|-------------|----------|
| Match the mockup closely | Use mockup as primary design reference. Adjust only where needed for real data. | |
| Inspired by mockup | Use mockup as loose inspiration. Developer has flexibility on layout. | ✓ |
| You decide | Claude reads the mockup and makes the call. | |

**User's choice:** Inspired by mockup
**Notes:** None

### Filter Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Tabs across the top | Horizontal Radix Tabs: All / Little Kicks / Starter / Advanced. Client-side filtering. | ✓ |
| Dropdown selector | Compact dropdown. Takes less horizontal space. | |
| You decide | Claude picks based on component library. | |

**User's choice:** Tabs across the top
**Notes:** None

### Access Control

| Option | Description | Selected |
|--------|-------------|----------|
| Public, no login | Anyone can view the leaderboard. It's a marketing surface. | ✓ |
| Auth required | Only logged-in families can see the leaderboard. | |

**User's choice:** Public, no login
**Notes:** Leaderboard only shows first name + last initial, so privacy is maintained.

---

## Week Navigation

### Week Visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Current + past weeks visible | Current week prominent at top. Past weeks collapsed below with submission status. Future weeks hidden. | ✓ |
| Current week only | Only show active week. | |
| All 8 weeks always visible | Full 8-week calendar as timeline. | |

**User's choice:** Current + past weeks visible
**Notes:** None

### Late Submissions

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, allow late submissions | Parents can submit for any past week. Points still count. Daily cap still enforced. | ✓ |
| No, current week only | Submissions locked to current week. | |
| You decide | Claude picks. | |

**User's choice:** Yes, allow late submissions
**Notes:** Keeps it inclusive for late joiners and families who went on vacation.

---

## Claude's Discretion

- Cloudinary Upload Widget configuration details
- Submissions table schema design
- Leaderboard SQL query structure
- Loading states, error handling, empty states
- Video embed responsive sizing
- Past-week card collapse/expand interaction pattern

## Deferred Ideas

None -- discussion stayed within phase scope.
