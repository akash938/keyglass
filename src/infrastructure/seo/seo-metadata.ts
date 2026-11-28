export interface FaqItem {
  question: string;
  answer: string;
}

export interface DeviceSupportCard {
  title: string;
  badge: string;
  description: string;
  highlights: string[];
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I test my keyboard online with KeyGlass?",
    answer:
      "Simply start pressing keys on your physical or mobile keyboard. Each key lights up in Apple Blue while held down and turns Emerald Green once verified. Select your matching layout (100% Full Size, 80% TKL, 75% MacBook/Laptop, or 60% Compact) and OS legends (macOS or Windows) at the top bar to test every single switch.",
  },
  {
    question: "Does this keyboard tester work on MacBook, Windows, Linux, iPad, and Mobile phones?",
    answer:
      "Yes. KeyGlass works universally on every modern browser across macOS (MacBook Air, MacBook Pro, Apple Magic Keyboard), Windows 11/10 desktops and laptops (Dell, ThinkPad, HP, ASUS, Razer), Linux, Chromebooks, iPads, iPhones, and Android devices. On touch devices, tap the Mobile Input button to test virtual touch keyboards or paired Bluetooth keyboards.",
  },
  {
    question: "What is N-Key Rollover (NKRO) and how do I run a keyboard ghosting test?",
    answer:
      "N-Key Rollover (NKRO) measures how many keys your keyboard can register simultaneously without dropping signals (ghosting). To test it, press and hold multiple keys at the same time (for example, W + A + Shift + Space + 4 + 5). KeyGlass displays your Live Simultaneous Keys count and records your Peak NKRO score in real time.",
  },
  {
    question: "How does the Mechanical Switch Chatter / Double-Click Detector work?",
    answer:
      "Keyboard chatter occurs when a worn or dusty mechanical switch sends two rapid keydown signals from a single physical press. KeyGlass automatically measures the exact millisecond interval between non-repeat presses of the same key. If a double actuation occurs faster than 55ms, the key is highlighted in red and logged as a chatter warning.",
  },
  {
    question: "Why don't keys like Mac Fn (Globe) or F11 always register on a single tap?",
    answer:
      "macOS intercepts single-tap Globe (fn) for Emoji/Input Source and unmodified F11 for Show Desktop at the OS level before any browser sees them. Hold fn + delete (or fn + return / fn + arrow keys) to verify fn immediately, and hold Control + fn + F11 (or Control + F11 with standard function keys enabled) to verify F11 without changing System Settings—or uncheck Show Desktop (F11) in System Settings → Keyboard → Keyboard Shortcuts → Mission Control. On Chrome/Edge, use FS Lock for W3C Fullscreen Keyboard Lock.",
  },
  {
    question: "Can I also test my laptop touchpad and mouse buttons here?",
    answer:
      "Yes. KeyGlass includes an Apple Glass Touchpad & Mouse Button Tester right below the keyboard that tests Left, Right, Middle, and Side M4/M5 mouse clicks, scroll directions, pinch zoom, live polling rate (Hz), multi-touch contacts, and mouse switch double-click chatter (<80ms).",
  },
  {
    question: "Is KeyGlass safe and private? Does it record or upload what I type?",
    answer:
      "KeyGlass is 100% private and runs entirely inside your browser's local memory. Zero keystrokes are logged, stored on servers, or transmitted over the internet. Once you click Reset or close the tab, your session diagnostics vanish immediately.",
  },
  {
    question: "What do event.key, event.code, and event.location mean in the Key Inspector?",
    answer:
      "event.code identifies the exact physical key position on the keyboard (e.g., KeyQ or ShiftRight) regardless of language layout. event.key shows the character or action produced by your active OS layout. event.location distinguishes Standard (0), Left modifier (1), Right modifier (2), and Numpad (3) keys.",
  },
];

export const DEVICE_SUPPORT_CARDS: DeviceSupportCard[] = [
  {
    title: "MacBook & Magic Keyboard",
    badge: "macOS Ready",
    description:
      "Authentic Command (⌘), Option (⌥), Control (⌃), Globe (fn), Delete, and Return keycaps with instant macOS auto-detection.",
    highlights: ["MacBook Air & Pro", "Magic Keyboard & Trackpad", "iPad Magic Keyboard"],
  },
  {
    title: "Mechanical & Gaming Boards",
    badge: "NKRO + Chatter",
    description:
      "Diagnose Cherry MX, Gateron, Optical, and Hall-Effect switches with sub-millisecond chatter detection and live rollover counts.",
    highlights: ["Full 104 / TKL / 75% / 60%", "Anti-Ghosting Rollover", "Switch Chatter (<55ms)"],
  },
  {
    title: "Windows, Linux & Mice",
    badge: "Universal HID",
    description:
      "Verify dead keys, stuck modifiers, function rows, numpads, touchpads, and 5-button gaming mice on any desktop or laptop.",
    highlights: ["Hard Capture Key Lock", "5-Button Mouse & Polling Hz", "Hold Latency Tracking"],
  },
  {
    title: "Phones, Tablets & Bluetooth",
    badge: "Touch + Wireless",
    description:
      "Built-in mobile input bridge and multi-touch pad let you test iOS, Android, and portable Bluetooth keyboards effortlessly.",
    highlights: ["iPhone & Android Support", "Multi-Touch Pad Tester", "Responsive Glass Deck"],
  },
];

export function buildStructuredData(siteUrl: string) {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "KeyGlass Online Keyboard, Mouse & Touchpad Tester",
    alternateName: ["KeyGlass", "Online Keyboard Test", "Free Keyboard Tester"],
    url: siteUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (macOS, Windows, Linux, ChromeOS, iOS, Android)",
    browserRequirements: "Requires JavaScript. Works in Chrome, Safari, Firefox, and Edge.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-time visual keyboard test for 100% Full Size, 80% TKL, 75% MacBook/Laptop, and 60% Compact keyboards",
      "Physical keyboard-only keycap diagnostics with automatic Key Lock capture",
      "macOS and Windows/Linux automatic keycap legend switching with Fn/Globe and F11 support",
      "N-Key Rollover (NKRO) and Anti-Ghosting simultaneous key counter",
      "Mechanical switch chatter detector (<55ms) and mouse double-click chatter detector (<80ms)",
      "Apple Glass Touchpad & 5-button mouse response tester with polling rate (Hz) and scroll gestures",
      "100% client-side privacy with zero keystroke logging",
    ],
    description:
      "Free online keyboard, mouse, and touchpad tester for all devices. Test MacBook, Windows, mechanical, gaming, laptop, Bluetooth, and mobile keyboards with live NKRO, chatter detection, and key diagnostics.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Test Your Keyboard, Mouse & Touchpad Online",
    description:
      "Check every key, touchpad gesture, and mouse button on your Mac, Windows, mechanical, laptop, or mobile device for dead switches, ghosting, and chatter.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose your keyboard layout and OS",
        text: "Select 100% Full Size, 80% TKL, 75% MacBook/Laptop, or 60% Compact along with macOS or Windows legends.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Press every physical key on your keyboard",
        text: "Press keys individually to verify responsiveness. Active keys glow blue and verified keys turn green.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Test N-Key Rollover, Switch Chatter & Mouse/Touchpad",
        text: "Hold multiple keys simultaneously to check NKRO anti-ghosting, tap switches to detect chatter, and test trackpad gestures and mouse buttons below.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Review diagnostics or copy your test report",
        text: "Inspect key codes, latency, and coverage percentage, then copy a full summary report with one click.",
      },
    ],
  };

  return [webAppSchema, faqSchema, howToSchema];
}
