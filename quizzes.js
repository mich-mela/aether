/**
 * AETHER Space Academy Quizzes — MC & True/False, Immediate Feedback, Score Persistence & Retry
 */

import { COURSES } from './data-courses.js';
import { QUIZZES } from './data-lessons.js';
import { saveQuizResult, getUserProgressSummary } from './progress-db.js';
import { escapeHtml, formatShortDate, refreshIcons } from './helpers.js';
import { showToast } from './components.js';

export async function renderQuizView(container, state, quizKey = 'intro-astronomy') {
  const availableKeys = Object.keys(QUIZZES);
  let activeKey = QUIZZES[quizKey] ? quizKey : availableKeys[0];
  let answers = {};
  let submitted = false;
  let lastSavedResult = null;

  const renderInner = async () => {
    const questions = QUIZZES[activeKey];
    const course = COURSES.find((c) => c.id === activeKey);
    const title = course ? course.title : 'Deep Space Astrophysics';
    const summary = state.user ? await getUserProgressSummary(state.user.id) : null;
    const pastAttempts = (summary?.quizResults || []).filter((q) => q.courseId === activeKey);

    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answerIndex) score++;
    });
    const pct = Math.round((score / questions.length) * 100);

    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div>
            <div class="page-eyebrow">Space Academy Assessment</div>
            <h1>${escapeHtml(title)} Quiz</h1>
            <p class="page-subtitle">Multiple-choice and True/False assessment with immediate scientific explanations and IndexedDB score tracking.</p>
          </div>
          <a href="#academy" class="btn btn-secondary btn-sm">← Back to Academy</a>
        </div>

        <div class="pill-tabs">
          ${availableKeys.map((k) => {
            const c = COURSES.find((x) => x.id === k);
            return `<button type="button" class="pill-tab ${k === activeKey ? 'active' : ''}" data-quiz-key="${k}">${escapeHtml(c ? c.title : 'Deep Space')}</button>`;
          }).join('')}
        </div>

        ${submitted ? `
          <div class="card mb-6" style="border-color:var(--accent-cyan);">
            <div class="flex justify-between items-center flex-wrap gap-3">
              <div>
                <div class="page-eyebrow">Quiz Results</div>
                <h2 style="margin:0;">Score: ${score} / ${questions.length} (${pct}%)</h2>
                <p class="text-sm text-muted mt-1">${state.user ? 'Result saved to your local AETHER IndexedDB record.' : 'Sign in to save quiz results permanently.'}</p>
              </div>
              <button type="button" class="btn btn-primary" id="quiz-retry-btn">Retry Quiz</button>
            </div>
          </div>
        ` : ''}

        <div class="flex" style="flex-direction:column;gap:var(--space-4);margin-bottom:var(--space-6);">
          ${questions.map((q, qIdx) => {
            const picked = answers[qIdx];
            const showFeedback = picked !== undefined;
            return `
              <section class="card">
                <div class="flex justify-between items-center mb-2">
                  <span class="badge badge-neutral">Question ${qIdx + 1} of ${questions.length}</span>
                  <span class="badge badge-cyan">${q.type === 'tf' ? 'True / False' : 'Multiple Choice'}</span>
                </div>
                <h3 style="font-size:1.05rem;margin-bottom:var(--space-3);">${escapeHtml(q.question)}</h3>
                <div>
                  ${q.options.map((opt, optIdx) => {
                    let cls = 'quiz-option';
                    if (showFeedback) {
                      if (optIdx === q.answerIndex) cls += ' correct';
                      else if (optIdx === picked) cls += ' incorrect';
                    } else if (picked === optIdx) {
                      cls += ' selected';
                    }
                    return `<button type="button" class="${cls}" data-q="${qIdx}" data-opt="${optIdx}" ${submitted ? 'disabled' : ''}>${escapeHtml(opt)}</button>`;
                  }).join('')}
                </div>
                ${showFeedback ? `
                  <div class="alert-banner mt-3">
                    <div>
                      <strong>${picked === q.answerIndex ? 'Correct:' : 'Explanation:'}</strong>
                      ${escapeHtml(q.explanation)}
                    </div>
                  </div>
                ` : ''}
              </section>
            `;
          }).join('')}
        </div>

        ${!submitted ? `
          <button type="button" class="btn btn-primary" id="quiz-submit-btn">Submit &amp; Save Quiz Score</button>
        ` : ''}

        ${pastAttempts.length ? `
          <section class="card mt-6">
            <h3 class="mb-3">Saved Attempts (${pastAttempts.length})</h3>
            <div class="table-wrap">
              <table class="data-table">
                <thead><tr><th>Date</th><th>Score</th><th>Percentage</th></tr></thead>
                <tbody>
                  ${pastAttempts.map((a) => `
                    <tr>
                      <td>${formatShortDate(a.takenAt)}</td>
                      <td class="mono">${a.score} / ${a.total}</td>
                      <td><span class="badge ${a.percentage >= 70 ? 'badge-live' : 'badge-cached'}">${a.percentage}%</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>
        ` : ''}
      </div>
    `;

    refreshIcons();

    container.querySelectorAll('[data-quiz-key]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeKey = btn.dataset.quizKey;
        answers = {};
        submitted = false;
        renderInner();
      });
    });

    container.querySelectorAll('[data-q]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (submitted) return;
        answers[Number(btn.dataset.q)] = Number(btn.dataset.opt);
        renderInner();
      });
    });

    container.querySelector('#quiz-submit-btn')?.addEventListener('click', async () => {
      if (Object.keys(answers).length < questions.length) {
        showToast('Please answer all questions before submitting.', 'warning');
        return;
      }
      submitted = true;
      if (state.user) {
        const res = await saveQuizResult(state.user.id, {
          courseId: activeKey,
          score,
          total: questions.length,
          percentage: pct,
          answers
        });
        lastSavedResult = res.record;
        showToast(`Quiz score (${pct}%) saved to IndexedDB.`, 'success');
        for (const b of res.newlyUnlocked) {
          showToast(`Achievement Unlocked: ${b.title}!`, 'success', 4800);
        }
      }
      renderInner();
    });

    container.querySelector('#quiz-retry-btn')?.addEventListener('click', () => {
      answers = {};
      submitted = false;
      lastSavedResult = null;
      renderInner();
    });
  };

  renderInner();
}
