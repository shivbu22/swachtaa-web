export const loopSteps = [
  {
    number: "01",
    title: "Report",
    text: "A photo, a place, and a few seconds. The work starts with evidence anyone can share.",
    label: "From the street",
  },
  {
    number: "02",
    title: "Verify",
    text: "Every report is checked for context, duplicates, and urgency before it enters the queue.",
    label: "With context",
  },
  {
    number: "03",
    title: "Route",
    text: "The right authority, team, and service clock are resolved from the place and the issue.",
    label: "To the owner",
  },
  {
    number: "04",
    title: "Resolve",
    text: "Field teams get a clear task, a fair priority, and a simple way to prove the work is done.",
    label: "In the field",
  },
  {
    number: "05",
    title: "Confirm",
    text: "People see what changed and can confirm it, reopen it, or add their voice to the next action.",
    label: "Back to people",
  },
] as const;

export const signalRows = [
  { id: "A1B2", issue: "Overflowing bin", area: "Market gate", status: "Assigned", time: "02:14" },
  { id: "C4D8", issue: "Mixed waste", area: "North square", status: "Verifying", time: "00:38" },
  { id: "E6F1", issue: "Blocked drain", area: "River road", status: "Resolved", time: "Done" },
] as const;

export const footerLinks = [
  { label: "How it works", href: "#the-loop" },
  { label: "For operators", href: "#operators" },
  { label: "Privacy", href: "#start" },
  { label: "Contact", href: "mailto:hello@swachta.org" },
] as const;
