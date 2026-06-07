import { jsPDF } from "jspdf";
import type { GameIdea } from "@/lib/types";

const PAGE_MARGIN = 40;
const LINE_HEIGHT = 14;

function ensurePage(doc: jsPDF, y: number) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y > pageHeight - PAGE_MARGIN) {
    doc.addPage();
    return PAGE_MARGIN;
  }
  return y;
}

export async function exportGameIdeaPDF(idea: GameIdea, fileName = "game-design-document.pdf") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - PAGE_MARGIN * 2;

  let y = PAGE_MARGIN;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(idea.title, usableWidth);
  doc.text(titleLines, PAGE_MARGIN, y);
  y += titleLines.length * (LINE_HEIGHT + 2);

  // Helper to write sections
  const writeSection = (heading: string, body: string) => {
    y = ensurePage(doc, y);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(heading, PAGE_MARGIN, y);
    y += LINE_HEIGHT;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const parts = doc.splitTextToSize(body, usableWidth);
    doc.text(parts, PAGE_MARGIN, y);
    y += parts.length * LINE_HEIGHT + 8;
  };

  writeSection("Story", idea.story);
  writeSection("Main Character", idea.mainCharacter);
  writeSection("Game Cover Concept", idea.coverPrompt);

  // Mechanics
  y = ensurePage(doc, y);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Mechanics", PAGE_MARGIN, y);
  y += LINE_HEIGHT;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  for (const mech of idea.mechanics) {
    y = ensurePage(doc, y);
    const lines = doc.splitTextToSize(`• ${mech}`, usableWidth);
    doc.text(lines, PAGE_MARGIN + 8, y);
    y += lines.length * LINE_HEIGHT;
  }
  y += 8;

  // Enemies
  y = ensurePage(doc, y);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Enemies", PAGE_MARGIN, y);
  y += LINE_HEIGHT;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  for (const enemy of idea.enemies) {
    y = ensurePage(doc, y);
    const lines = doc.splitTextToSize(`• ${enemy}`, usableWidth);
    doc.text(lines, PAGE_MARGIN + 8, y);
    y += lines.length * LINE_HEIGHT;
  }
  y += 8;

  // Boss
  writeSection("Boss Fight", idea.boss);

  // Levels
  y = ensurePage(doc, y);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Levels", PAGE_MARGIN, y);
  y += LINE_HEIGHT;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  for (const level of idea.levels) {
    y = ensurePage(doc, y);
    const lines = doc.splitTextToSize(`• ${level}`, usableWidth);
    doc.text(lines, PAGE_MARGIN + 8, y);
    y += lines.length * LINE_HEIGHT;
  }

  // Trigger download in browser
  doc.save(fileName);
}
