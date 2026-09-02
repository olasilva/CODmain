// src/data/pricing.js
//
// Single source of truth for campus/plan pricing, built from the two fee
// flyers (Wuye Center Program, Lugbe Campus Program & Fees). Both
// CourseSelection.jsx and Payment.jsx import from here so the numbers can
// never drift out of sync between the picker and the checkout screen.

export const PRICING = {
  "Lugbe Campus": {
    "4 Days Weekly (Regular)": {
      monthly: 40000,
      termly: 100000,
      daily: 10000,
      description: "After School Sessions and Weekends classes",
    },
    "2 Days Weekly (Steady)": {
      monthly: 30000,
      termly: 80000,
      daily: null,
      description: "After School Sessions and Weekends classes",
    },
    "1 Day Weekly (Flexible)": {
      monthly: 20000,
      termly: 50000,
      daily: null,
      description: "Saturday classes",
    },
    "Daily Fee": {
      monthly: null,
      termly: null,
      daily: 10000,
      description: "Single day session",
    },
  },
  "Wuye Center": {
    "Saturday Classes": {
      monthly: 65000,
      termly: 160000,
      daily: null,
      description: "9am to 12pm",
    },
  },
};

// Campus metadata used to render the Step 1 picker in CourseSelection.jsx.
export const CAMPUSES = [
  {
    id: "Lugbe Campus",
    name: "Lugbe Campus",
    tagline: "After School Sessions and Weekends classes",
  },
  {
    id: "Wuye Center",
    name: "Wuye Center",
    tagline: "Saturday Classes, 9am – 12pm",
  },
];

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Returns a short "from ₦X" tag for a plan, preferring the cheapest
// recurring figure available (monthly > daily > termly) for at-a-glance
// display on plan cards.
export function planPriceTag(plan) {
  if (!plan) return "";
  if (plan.monthly) return `₦${plan.monthly.toLocaleString()}/mo`;
  if (plan.daily) return `₦${plan.daily.toLocaleString()}/session`;
  if (plan.termly) return `₦${plan.termly.toLocaleString()}/term`;
  return "";
}