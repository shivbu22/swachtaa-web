"use client";

import { useId, useState } from "react";
import styles from "./WorkflowDemo.module.css";

const STAGES = [
  {
    number: "01",
    title: "Report",
    shortDescription: "Capture the signal",
    description:
      "A resident signal enters the queue with just enough context to start the right conversation.",
    owner: "Community signal",
    ownerNote: "The report is visible to the operator desk.",
  },
  {
    number: "02",
    title: "Verify",
    shortDescription: "Check the context",
    description:
      "An operator checks the issue, location, and urgency before it becomes owned work.",
    owner: "Verification desk",
    ownerNote: "This is a deliberate review step, not an automatic decision.",
  },
  {
    number: "03",
    title: "Route",
    shortDescription: "Choose the owner",
    description:
      "The report is matched to the responsible team or partner for this synthetic area.",
    owner: "Ward operations",
    ownerNote: "Routing is represented locally; no team is contacted from this demo.",
  },
  {
    number: "04",
    title: "Resolve",
    shortDescription: "Do the field work",
    description:
      "A field team gets a clear task and a fair priority, then records that the issue is addressed.",
    owner: "Field crew",
    ownerNote: "The completion state below is an example, not a live service update.",
  },
  {
    number: "05",
    title: "Confirm",
    shortDescription: "Close the loop",
    description:
      "The operator can close the loop with the person who reported it, or keep the signal open for another look.",
    owner: "Reporter + operator",
    ownerNote: "Confirmation is represented in this prototype; no message is sent.",
  },
] as const;

type StageIndex = 0 | 1 | 2 | 3 | 4;

type Ticket = {
  id: string;
  issue: string;
  area: string;
  received: string;
  priority: "Routine" | "Priority" | "Safety";
  channel: string;
  initialStage: StageIndex;
};

const TICKETS: readonly Ticket[] = [
  {
    id: "EX-104",
    issue: "Overflowing bin",
    area: "Market gate",
    received: "8 min ago",
    priority: "Priority",
    channel: "Street report",
    initialStage: 0,
  },
  {
    id: "EX-219",
    issue: "Mixed waste",
    area: "North square",
    received: "22 min ago",
    priority: "Routine",
    channel: "Resident report",
    initialStage: 1,
  },
  {
    id: "EX-307",
    issue: "Blocked drain",
    area: "River road",
    received: "1 hr ago",
    priority: "Safety",
    channel: "Field follow-up",
    initialStage: 4,
  },
];

const INITIAL_PROGRESS: Record<string, StageIndex> = Object.fromEntries(
  TICKETS.map((ticket) => [ticket.id, ticket.initialStage]),
) as Record<string, StageIndex>;

function getProgressLabel(index: number, currentStage: number) {
  if (index < currentStage) return "Complete";
  if (index === currentStage) return "Current";
  return "Locked";
}

export function WorkflowDemo() {
  const titleId = useId();
  const detailTitleId = useId();
  const [selectedId, setSelectedId] = useState(TICKETS[0].id);
  const [progressByTicket, setProgressByTicket] =
    useState<Record<string, StageIndex>>(INITIAL_PROGRESS);
  const [focusedStage, setFocusedStage] = useState<StageIndex>(
    TICKETS[0].initialStage,
  );

  const selectedTicket =
    TICKETS.find((ticket) => ticket.id === selectedId) ?? TICKETS[0];
  const currentStage =
    progressByTicket[selectedTicket.id] ?? selectedTicket.initialStage;
  const viewedStage = STAGES[focusedStage] ?? STAGES[currentStage];
  const isViewingCurrentStage = focusedStage === currentStage;
  const isComplete = currentStage === STAGES.length - 1;

  function selectTicket(id: string) {
    const nextTicket = TICKETS.find((ticket) => ticket.id === id);
    if (!nextTicket) return;

    const nextStage = progressByTicket[id] ?? nextTicket.initialStage;
    setSelectedId(id);
    setFocusedStage(nextStage);
  }

  function advanceWorkflow() {
    if (!isViewingCurrentStage) {
      setFocusedStage(currentStage);
      return;
    }

    if (isComplete) {
      setProgressByTicket((current) => ({
        ...current,
        [selectedTicket.id]: 0,
      }));
      setFocusedStage(0);
      return;
    }

    const nextStage = (currentStage + 1) as StageIndex;
    setProgressByTicket((current) => ({
      ...current,
      [selectedTicket.id]: nextStage,
    }));
    setFocusedStage(nextStage);
  }

  const primaryLabel = !isViewingCurrentStage
    ? `Return to ${STAGES[currentStage].title}`
    : isComplete
      ? "Reset this example"
      : `Advance to ${STAGES[currentStage + 1].title}`;

  return (
    <section
      id="operators"
      className={styles.section}
      aria-labelledby={titleId}
    >
      <div className={styles.shell}>
        <header className={styles.header} data-reveal>
          <div className={styles.headingBlock}>
            <div className={styles.eyebrowRow}>
              <p className={styles.eyebrow}>Operator sandbox</p>
              <span className={styles.exampleBadge}>Local example</span>
            </div>
            <h2 id={titleId}>A report is only the beginning.</h2>
            <p className={styles.intro}>
              Give every signal a visible owner, a next step, and a way to close
              the loop with the community.
            </p>
          </div>
          <div className={styles.headerAside}>
            <span className={styles.headerRule} aria-hidden="true" />
            <p>
              Explore a small, synthetic queue. Nothing here connects to a city
              service or sends a notification.
            </p>
          </div>
        </header>

        <div className={styles.demoFrame}>
          <aside className={styles.queue} aria-label="Example report queue">
            <div className={styles.queueHeader}>
              <div className={styles.queueMetaRow}>
                <p className={styles.sectionLabel}>Work queue</p>
                <span className={styles.queueCount}>03 examples</span>
              </div>
              <h3>Choose a report</h3>
              <p>Select a ticket to see where it is in the loop.</p>
            </div>

            <div
              className={styles.ticketList}
              role="listbox"
              aria-label="Synthetic reports"
            >
              {TICKETS.map((ticket) => {
                const ticketStage =
                  progressByTicket[ticket.id] ?? ticket.initialStage;
                const isSelected = ticket.id === selectedTicket.id;
                const ticketIsComplete = ticketStage === STAGES.length - 1;

                return (
                  <button
                    key={ticket.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`${styles.ticket} ${
                      isSelected ? styles.ticketSelected : ""
                    }`}
                    onClick={() => selectTicket(ticket.id)}
                  >
                    <span className={styles.ticketTopline}>
                      <span className={styles.ticketMarker} aria-hidden="true">
                        {ticket.id.slice(-2)}
                      </span>
                      <span
                        className={`${styles.priority} ${
                          ticket.priority === "Safety"
                            ? styles.prioritySafety
                            : ticket.priority === "Priority"
                              ? styles.priorityHigh
                              : ""
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </span>
                    <span className={styles.ticketIssue}>{ticket.issue}</span>
                    <span className={styles.ticketArea}>{ticket.area}</span>
                    <span className={styles.ticketBottomline}>
                      <span>{ticket.received}</span>
                      <span>
                        {ticketIsComplete
                          ? "Complete"
                          : `${STAGES[ticketStage].title} · ${ticketStage + 1}/5`}
                      </span>
                    </span>
                    <span className={styles.ticketProgress} aria-hidden="true">
                      {STAGES.map((stage, index) => (
                        <span
                          key={stage.title}
                          className={
                            index <= ticketStage
                              ? styles.progressSegmentActive
                              : ""
                          }
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={styles.queueNote}>
              <span className={styles.noteDot} aria-hidden="true" />
              <p>Local interaction · synthetic data only</p>
            </div>
          </aside>

          <div className={styles.detail} aria-labelledby={detailTitleId}>
            <div className={styles.detailHeader}>
              <div>
                <div className={styles.detailKicker}>
                  <p className={styles.sectionLabel}>Report detail</p>
                  <span className={styles.detailStatus}>
                    {isComplete ? "Complete" : "In progress"}
                  </span>
                </div>
                <h3 id={detailTitleId}>{selectedTicket.issue}</h3>
                <div className={styles.locationLine}>
                  <span>{selectedTicket.area}</span>
                  <span className={styles.syntheticTag}>Synthetic area</span>
                </div>
              </div>
              <div className={styles.reportReference}>
                <span>Example ID</span>
                <strong>{selectedTicket.id}</strong>
              </div>
            </div>

            <div className={styles.detailBody}>
              <section
                className={styles.progressPanel}
                aria-labelledby={`${detailTitleId}-progress`}
              >
                <div className={styles.progressHeader}>
                  <div>
                    <p className={styles.sectionLabel}>Workflow state</p>
                    <h4 id={`${detailTitleId}-progress`}>
                      {STAGES[currentStage].title}
                    </h4>
                  </div>
                  <span className={styles.stageCounter}>
                    {String(currentStage + 1).padStart(2, "0")} / 05
                  </span>
                </div>

                <ol className={styles.timeline} aria-label="Report workflow stages">
                  {STAGES.map((stage, index) => {
                    const stageIsLocked = index > currentStage;
                    const stageIsCurrent = index === currentStage;
                    const stageIsFocused = index === focusedStage;
                    const statusLabel = getProgressLabel(index, currentStage);

                    return (
                      <li key={stage.title} className={styles.timelineItem}>
                        <button
                          type="button"
                          className={`${styles.stageButton} ${
                            stageIsCurrent ? styles.stageCurrent : ""
                          } ${
                            stageIsFocused ? styles.stageFocused : ""
                          } ${stageIsLocked ? styles.stageLocked : ""}`}
                          disabled={stageIsLocked}
                          aria-current={stageIsCurrent ? "step" : undefined}
                          aria-label={`${stage.title}, ${statusLabel}. ${
                            stageIsLocked
                              ? "Locked until the previous stage is complete."
                              : "View this stage."
                          }`}
                          onClick={() => setFocusedStage(index as StageIndex)}
                        >
                          <span
                            className={`${styles.stageNode} ${
                              index < currentStage
                                ? styles.stageNodeComplete
                                : stageIsCurrent
                                  ? styles.stageNodeCurrent
                                  : ""
                            }`}
                            aria-hidden="true"
                          >
                            {index < currentStage ? "✓" : stage.number}
                          </span>
                          <span className={styles.stageContent}>
                            <span className={styles.stageTitleRow}>
                              <strong>{stage.title}</strong>
                              <span className={styles.stageState}>
                                {statusLabel}
                              </span>
                            </span>
                            <span className={styles.stageDescription}>
                              {stage.shortDescription}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <div className={styles.supportStack}>
                <section className={styles.ownerCard} aria-label="Current owner">
                  <div className={styles.cardTopline}>
                    <p className={styles.sectionLabel}>
                      {isViewingCurrentStage ? "Current owner" : "Owner at this step"}
                    </p>
                    <span className={styles.ownerSignal} aria-hidden="true" />
                  </div>
                  <h4>{viewedStage.owner}</h4>
                  <p>{viewedStage.ownerNote}</p>
                </section>

                <section className={styles.explanationCard}>
                  <p className={styles.sectionLabel}>What happens here</p>
                  <p className={styles.explanation}>{viewedStage.description}</p>
                  {!isViewingCurrentStage && (
                    <p className={styles.reviewNote}>
                      Reviewing a completed step. The workflow stays at {STAGES[currentStage].title}.
                    </p>
                  )}
                </section>
              </div>
            </div>

            <div className={styles.detailFooter}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={advanceWorkflow}
              >
                <span>{primaryLabel}</span>
                <span className={styles.buttonArrow} aria-hidden="true">
                  {isComplete && isViewingCurrentStage ? "↺" : "→"}
                </span>
              </button>
              <p className={styles.footerNote}>
                <span className={styles.footerNoteMark} aria-hidden="true">i</span>
                Manual steps, clear ownership. This prototype never runs the work
                for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
