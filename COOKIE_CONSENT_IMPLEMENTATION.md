# Cookie Consent Implementation

This document describes the cookie consent implementation in the Majdst Codes Community Web App.

## Overview

The application implements a **GDPR-compliant** cookie consent system that:
- Respects user privacy preferences
- Integrates with Microsoft Clarity analytics
- Provides granular control over cookie categories
- Persists preferences in localStorage
- Follows web accessibility standards (WCAG 2.1)

## Architecture

### Components

#### **CookieConsent Component** (`src/components/common/CookieConsent.tsx`)
- Main UI component for the cookie consent banner
- Displays main banner on first visit
- Provides detailed settings modal for customization
- Accessible with proper ARIA labels and semantic HTML

**Features:**
- Two-view design: Quick choices + Detailed settings
- Cookie category toggles with visual feedback
- Links to privacy and cookie policies
- Backdrop overlay for modal focus
- Mobile-responsive design

#### **useCookieConsent Hook** (`src/hooks/useCookieConsent.ts`)
- Manages cookie consent state and localStorage persistence
- Provides methods for accepting, rejecting, and customizing preferences
- Handles initialization and preference updates

**Key Methods:**
```typescript
acceptAll()              // Accept all cookie types
acceptNecessary()        // Accept only necessary cookies
updateConsent()          // Update specific preferences
resetConsent()          // Clear preferences and show banner again
isConsentGiven()        // Check if a category is allowed
```

#### **Clarity Service** (`src/services/clarity.service.ts`)
- Manages Microsoft Clarity integration
- Controls Clarity initialization based on analytics consent
- Respects user privacy preferences

**Key Functions:**
```typescript
updateClarityConsent(analyticsConsent: boolean)  // Enable/disable Clarity
isClarityActive()                                 // Check Clarity status
startClarity()                                    // Initialize Clarity
stopClarity()                                     // Handle consent rejection
```

### Data Storage

**localStorage Key:** `majdst_cookie_consent`

**Stored Object:**
```typescript
interface CookieConsent {
  analytics: boolean;      // Session tracking & analytics
  marketing: boolean;      // Advertising & campaigns
  functional: boolean;     // Enhanced features & personalization
  necessary: boolean;      // Always true, required for site
  timestamp: number;       // When consent was given
  version: string;         // Consent version (v1.0)
}
```

**Example:**
```json
{
  "necessary": true,
  "functional": true,
  "analytics": true,
  "marketing": false,
  "timestamp": 1715511234000,
  "version": "1.0"
}
```

## User Flow

### First Visit (No Consent)
1. User visits site
2. Cookie banner appears at bottom
3. User sees three options:
   - **Necessary Only**: Only essential cookies
   - **Customize**: Granular control per category
   - **Accept All**: All cookie types enabled

### Making a Choice
- **If "Necessary Only"**: Banner closes, minimal tracking
- **If "Accept All"**: Banner closes, full analytics enabled
- **If "Customize"**: Detailed settings modal opens
  - User toggles each category on/off
  - Clicks "Save Preferences"
  - Choices are persisted to localStorage

### Subsequent Visits
- Browser reads stored preference from localStorage
- Banner doesn't show (user already chose)
- Clarity initializes based on saved analytics preference

### Changing Preferences
Users can click "Customize" in the main banner to adjust preferences at any time.

## Integration Points

### App Bootstrap (`src/app/main.tsx`)
```typescript
// Clarity initialization checks localStorage for consent
if (consent.analytics) {
  clarity.init(projectId);
}
```

### App Component (`src/app/App.tsx`)
```typescript
<App>
  <Router />
  <CookieConsent />  // Rendered at root level
</App>
```

## Styling

**Stylesheet:** `src/styles/cookie-consent.css`

**Features:**
- Modern, clean design with smooth animations
- Dark mode support via CSS variables
- Fully responsive (mobile, tablet, desktop)
- Keyboard accessible with focus indicators
- Respects `prefers-reduced-motion` for animations
- Touch-friendly toggle switches

**CSS Variables:**
```css
--cookie-bg              // Background color
--cookie-text            // Text color
--cookie-primary         // Primary action color
--cookie-secondary       // Secondary action color
--cookie-border          // Border color
--cookie-shadow          // Box shadow
--cookie-z-index         // Stacking context
```

## Configuration

### Environment Variables

Create `.env` file in project root:

```bash
VITE_CLARITY_PROJECT_ID=your-clarity-project-id
```

**If not set:** Clarity won't initialize (gracefully skipped).

### Getting Your Clarity Project ID

1. Visit [Microsoft Clarity](https://clarity.microsoft.com/)
2. Create a new project
3. Copy the Project ID
4. Add to `.env` file

## Accessibility

**WCAG 2.1 Compliance:**
- ✅ Semantic HTML (`alertdialog`, `role="presentation"`)
- ✅ ARIA labels for all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Color contrast (WCAG AA)
- ✅ Screen reader compatible
- ✅ Respects `prefers-reduced-motion`

**Testing:**
```bash
# Run accessibility audit
npm run test -- --testPathPattern=Cookie
```

## Security & Privacy

**Data Handling:**
- Preferences stored **locally in browser only**
- No server transmission of raw cookie data
- Timestamps included for audit trail
- Versioned consent for future upgrades

**Privacy Considerations:**
- Necessary cookies always enabled (required for functionality)
- Analytics requires explicit opt-in (not pre-checked)
- Granular categories for user control
- Easy to reset/revoke consent
- Respects browser's "Do Not Track" intent

## Best Practices Implemented

✅ **Explicit Consent**: Not pre-ticked (except Necessary)
✅ **Granular Control**: Individual cookie categories
✅ **Easy Rejection**: "Necessary Only" prominent option
✅ **Transparent**: Clear descriptions of each category
✅ **Persistent**: Preferences remembered across sessions
✅ **Changeable**: Users can modify anytime
✅ **Mobile-First**: Responsive design
✅ **Accessible**: Full keyboard & screen reader support
✅ **Links**: Quick access to privacy/cookie policies

## Testing

### Manual Testing

```bash
# Clear localStorage to test fresh
localStorage.removeItem('majdst_cookie_consent');
window.location.reload();

# Check stored preferences
console.log(JSON.parse(localStorage.getItem('majdst_cookie_consent')));

# Verify Clarity status
console.log((window as any).clarity);
```

### Build

```bash
npm run build  # Verify no TypeScript errors
npm run dev    # Test in development
npm run preview # Test production build locally
```

## Deployment Checklist

- [ ] `.env` file configured with `VITE_CLARITY_PROJECT_ID`
- [ ] Cookie policy page created (`/cookies`)
- [ ] Privacy policy page created (`/privacy`)
- [ ] Tested in all major browsers
- [ ] Tested on mobile devices
- [ ] Accessibility audit passed
- [ ] Analytics dashboard set up in Clarity
- [ ] Production build verified

## Troubleshooting

### Cookie Banner Not Showing
- Check if localStorage has `majdst_cookie_consent` key
- Run: `localStorage.removeItem('majdst_cookie_consent')`
- Reload page

### Clarity Not Initializing
- Verify `VITE_CLARITY_PROJECT_ID` is set in `.env`
- Check browser console for errors
- Ensure analytics consent is enabled

### Styles Not Applied
- Check that `src/styles/cookie-consent.css` is imported
- Verify CSS file syntax (no missing braces)
- Clear browser cache: `Ctrl+Shift+Delete`

## Future Enhancements

- [ ] Cookie consent version migration (handle consent upgrades)
- [ ] Server-side preference storage (for logged-in users)
- [ ] Cookie list with descriptions
- [ ] Export/import preferences
- [ ] Integration with GTM (Google Tag Manager)
- [ ] CMP provider integration
- [ ] Analytics event tracking for consent changes

## References

- [GDPR Cookies Guide](https://gdpr-info.eu/issues/cookies/)
- [Ezoic Cookie Consent Guide](https://www.ezoic.com/blog/cookie-consent/)
- [Microsoft Clarity Documentation](https://clarity.microsoft.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
