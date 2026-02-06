import jsPDF from "jspdf";
import { AssessmentResult } from "@/types/assessment";
import { categoryLabels } from "@/data/questions";

export const generatePDFReport = (result: AssessmentResult): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Helper functions
  const centerText = (text: string, y: number, size: number = 12) => {
    doc.setFontSize(size);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  const addSection = (title: string, y: number): number => {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(23, 128, 117); // Primary teal color
    doc.text(title, margin, y);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    return y + 10;
  };

  // Header
  doc.setFillColor(23, 128, 117);
  doc.rect(0, 0, pageWidth, 45, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  centerText("Interview Readiness Report", 20, 22);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  centerText(`Generated on ${new Date().toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  })}`, 32);

  doc.setTextColor(0, 0, 0);
  yPos = 60;

  // Overall Score Section
  doc.setFillColor(245, 250, 249);
  doc.roundedRect(margin, yPos - 5, pageWidth - margin * 2, 40, 3, 3, "F");
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Overall Interview Readiness Score", margin + 10, yPos + 8);
  
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(23, 128, 117);
  doc.text(`${result.overallScore}`, margin + 10, yPos + 28);
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("/ 100", margin + 45, yPos + 28);

  // Readiness level badge
  const levelLabels: Record<string, string> = {
    expert: "Interview Ready",
    advanced: "Almost There",
    intermediate: "Making Progress",
    beginner: "Getting Started",
  };
  
  doc.setFontSize(11);
  doc.setTextColor(23, 128, 117);
  doc.text(levelLabels[result.readinessLevel], margin + 80, yPos + 20);
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(`Estimated prep time: ${result.estimatedPrepTime}`, margin + 80, yPos + 28);

  doc.setTextColor(0, 0, 0);
  yPos += 55;

  // Category Scores Section
  yPos = addSection("Category Breakdown", yPos);

  result.categoryScores.forEach((cs, index) => {
    const boxY = yPos + index * 25;
    
    // Category name
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(categoryLabels[cs.category], margin, boxY);
    
    // Score
    doc.setFont("helvetica", "normal");
    const scoreColor = cs.score >= 70 ? [34, 139, 34] : cs.score >= 40 ? [218, 165, 32] : [220, 100, 71];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${cs.score}%`, pageWidth - margin - 20, boxY);
    
    // Progress bar background
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin, boxY + 3, 120, 6, 2, 2, "F");
    
    // Progress bar fill
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.roundedRect(margin, boxY + 3, (cs.score / 100) * 120, 6, 2, 2, "F");
    
    // Feedback
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(cs.feedback, margin, boxY + 18);
    
    doc.setTextColor(0, 0, 0);
  });

  yPos += result.categoryScores.length * 25 + 15;

  // Strengths & Improvements
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

  // Two-column layout for strengths and improvements
  const colWidth = (pageWidth - margin * 3) / 2;
  
  // Strengths column
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 139, 34);
  doc.text("✓ Key Strengths", margin, yPos);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  
  let strengthY = yPos + 8;
  result.categoryScores.forEach((cs) => {
    cs.strengths.slice(0, 1).forEach((strength) => {
      const lines = doc.splitTextToSize(`• ${strength}`, colWidth - 5);
      doc.text(lines, margin, strengthY);
      strengthY += lines.length * 5;
    });
  });

  // Improvements column
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 100, 71);
  doc.text("↑ Areas to Improve", margin + colWidth + margin, yPos);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  
  let improvY = yPos + 8;
  result.categoryScores.forEach((cs) => {
    cs.improvements.slice(0, 1).forEach((improvement) => {
      const lines = doc.splitTextToSize(`• ${improvement}`, colWidth - 5);
      doc.text(lines, margin + colWidth + margin, improvY);
      improvY += lines.length * 5;
    });
  });

  yPos = Math.max(strengthY, improvY) + 15;

  // Next Steps Section
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }

  yPos = addSection("Your Action Plan", yPos);

  doc.setFontSize(10);
  result.nextSteps.forEach((step, index) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(23, 128, 117);
    doc.text(`${index + 1}.`, margin, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(step, pageWidth - margin * 2 - 15);
    doc.text(lines, margin + 10, yPos);
    yPos += lines.length * 6 + 4;
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  centerText("Interview Readiness Assessment Tool • Helping you prepare for success", footerY, 8);

  // Save the PDF
  doc.save(`interview-readiness-report-${new Date().toISOString().split("T")[0]}.pdf`);
};
