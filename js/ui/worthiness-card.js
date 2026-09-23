// Reply Worthiness card rendering.

function worthinessMeter(label, value) {
  const display = value === null || value === undefined ? "--" : value;
  const width = value === null || value === undefined ? 0 : value;
  return `
    <div class="worthiness-meter">
      <div class="worthiness-meter-row">
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(display)}/100</span>
      </div>
      <div class="bar-shell" aria-hidden="true">
        <div class="bar-fill" style="width: ${width}%"></div>
      </div>
    </div>
  `;
}

function renderReplyWorthinessCard(container, result) {
  if (!container) return;
  const label = result.hasText
    ? `${result.status.icon} ${result.status.label}`
    : "Local heuristic score from pasted text, category, and tone.";
  const score = result.hasText ? result.overall : "--";
  const reasons = result.hasText
    ? result.reasons.map((reason) => `<li class="${reason.type === "warning" ? "is-warning" : ""}">${escapeHtml(reason.text)}</li>`).join("")
    : '<li>Paste a post to decide whether this deserves attention before drafting replies.</li>';

  container.innerHTML = `
    <div class="worthiness-header">
      <div>
        <h3 class="worthiness-title">🌙 Reply Worthiness</h3>
        <p class="worthiness-label">${escapeHtml(label)}</p>
      </div>
      <div class="worthiness-score" aria-label="Overall Score">
        <strong>${escapeHtml(score)}</strong>
        <span>Overall Score /100</span>
      </div>
    </div>
    <div class="worthiness-grid">
      ${worthinessMeter("Visibility", result.subScores.visibility)}
      ${worthinessMeter("Relevance", result.subScores.relevance)}
      ${worthinessMeter("Conversation Potential", result.subScores.conversationPotential)}
      ${worthinessMeter("Warmth Fit", result.subScores.warmthFit)}
    </div>
    <div class="worthiness-body">
      <p class="worthiness-label">Why reply?</p>
      <ul class="worthiness-reasons">${reasons}</ul>
      <p class="worthiness-approach"><span>Suggested approach</span><strong>${escapeHtml(result.approach)}</strong></p>
    </div>
  `;
}

function renderWellnessWorthiness() {
  renderReplyWorthinessCard(
    wellnessWorthinessCard,
    calculateReplyWorthiness(tweetInput.value, categorySelect.value, toneSelect.value, "wellness")
  );
}

function renderFounderWorthiness() {
  renderReplyWorthinessCard(
    founderWorthinessCard,
    calculateReplyWorthiness(founderTweetInput.value, founderCategorySelect.value, founderToneSelect.value, "founder")
  );
}
