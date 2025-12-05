# 🎨 Complete Color Scheme - VeggieRoulette App

## 🌿 **PRIMARY COLOR PALETTE (Earth Tones Theme)**

### **Main Colors**

| Color Name | Hex Code | Usage | Visual |
|------------|----------|-------|--------|
| **Dark Green (Background)** | `#365441` | Main app background color | 🟢 Dark Green |
| **Primary Headers** | `#2C4A34` | Header backgrounds, borders, primary text on light backgrounds | 🟢 Darker Green |
| **Sage/Light Green** | `#E8F3E0` | Card backgrounds, light text on dark backgrounds | 🟢 Light Sage |
| **Terracotta (Accent)** | `#C85E51` | Buttons, accent elements, edit/action buttons | 🟠 Terracotta |

---

## 🎨 **SECONDARY COLORS**

### **Text Colors**

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **White** | `#ffffff` | Text on dark backgrounds, icons on headers |
| **Light Text** | `#E8F3E0` | Text on dark green backgrounds |
| **Light Text Alt** | `#cee4b0` | Text on splash/login screens |
| **Dark Text** | `#2C4A34` | Primary text on light backgrounds |
| **Gray Text** | `#6b7280` | Secondary text, placeholders |
| **Dark Gray** | `#666666` | Muted text (rarely used) |
| **Black** | `#000000` | Text (rarely used, mostly replaced) |

### **Status & Accent Colors**

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Success Green** | `#16a34a` | Success states, online indicators, positive actions |
| **Warning Orange** | `#f97316` | Warning states, pending items |
| **Error Red** | `#ef4444` | Error states, delete actions, danger |
| **Info Blue** | `#2563eb` | Information (rarely used) |
| **Purple** | `#a855f7` | Special accents (rarely used) |

### **Background Colors**

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Beige/Light** | `#FDFBF5` | Light backgrounds (rarely used, mostly replaced) |
| **Light Green** | `#C6D5C6` | Alternative light background (rarely used) |
| **White** | `#ffffff` | Card backgrounds, input fields |
| **Light Sage** | `#d4d9c8` | Unread notification backgrounds |

---

## 🎨 **SPECIAL COLORS (Programmatic Elements)**

### **Bag/Brown Colors** (For programmatic bag illustrations)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Brown Bag** | `#d4a574` | Bag body color |
| **Brown Bag Border** | `#8b6f47` | Bag border color |

### **Produce Colors** (For programmatic illustrations)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Orange Produce** | `#f97316` | Carrots, oranges |
| **Green Produce** | `#16a34a` | Leafy greens, vegetables |
| **Red Produce** | `#ef4444` | Tomatoes, apples |
| **Purple Produce** | `#a855f7` | Eggplants, grapes |

### **Illustration Colors** (Splash/Login screens)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Yellow Box** | `#fde68a` | Cardboard box color |
| **Brown Box Border** | `#92400e` | Box border |
| **Yellow Face** | `#fcd34d` | Seller avatar face |
| **Yellow Hat** | `#fbbf24` | Seller avatar hat |
| **Brown Hat Border** | `#d97706` | Hat border |

### **Rating/Star Colors**

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Gold Star** | `#fbbf24` | Filled stars, ratings |
| **Gray Star** | `#9ca3af` | Empty stars |

---

## 📊 **COLOR USAGE BREAKDOWN**

### **By Component Type**

#### **Headers**
- Background: `#2C4A34` (Primary Headers)
- Text: `#ffffff` (White)
- Icons: `#ffffff` (White)

#### **Main Backgrounds**
- Primary: `#365441` (Dark Green)
- Cards: `#E8F3E0` (Sage/Light Green)
- Borders: `#2C4A34` (Primary Headers)

#### **Buttons**
- Primary/Action: `#C85E51` (Terracotta)
- Success: `#16a34a` (Success Green)
- Danger: `#ef4444` (Error Red)
- Text on buttons: `#ffffff` (White)

#### **Text**
- On dark backgrounds: `#ffffff` or `#E8F3E0`
- On light backgrounds: `#2C4A34`
- Secondary text: `#6b7280`

#### **Status Indicators**
- Success/Online: `#16a34a`
- Warning/Pending: `#f97316`
- Error/Offline: `#ef4444` or `#9ca3af`

---

## 🎨 **TAILWIND CONFIG COLORS**

From `tailwind.config.js`:
```javascript
colors: {
  sage: '#E8F3E0',
  'bg-primary': '#365441',
  'dark-green': '#2C4A34',
  terracotta: '#C85E51',
}
```

**Note:** These are defined but most code uses inline hex colors for consistency.

---

## 📋 **QUICK REFERENCE**

### **Most Used Colors (Top 5)**
1. `#365441` - Main background
2. `#2C4A34` - Headers, borders, dark text
3. `#E8F3E0` - Cards, light backgrounds, light text
4. `#C85E51` - Buttons, accents
5. `#ffffff` - White text, icons

### **Color Harmony**
- **Primary Palette:** Green tones (earth theme)
- **Accent:** Terracotta (warm, earthy)
- **Neutrals:** White, grays for text
- **Status:** Green (success), Orange (warning), Red (error)

---

## 🎯 **DESIGN PRINCIPLES**

1. **Earth Tones Theme**: All colors follow a natural, earthy palette
2. **High Contrast**: Dark green backgrounds with light text for readability
3. **Consistent Borders**: `#2C4A34` used for all card borders
4. **Accent for Actions**: `#C85E51` (Terracotta) for primary actions
5. **Status Colors**: Standard green/orange/red for status indicators

---

## 💡 **RECOMMENDATIONS FOR YOUR BRANDING**

When replacing logos and branding:
- **Logo colors** should complement the earth-tone palette
- **Avoid bright neon colors** - stick to natural tones
- **Test logo visibility** on both `#365441` (dark) and `#E8F3E0` (light) backgrounds
- **Consider logo variants** - one for dark backgrounds, one for light if needed

---

**Last Updated:** Based on current codebase analysis

