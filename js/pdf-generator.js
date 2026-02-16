// Minimalist PDF Resume Generator
// Clean white background with green accents only for headings and lines

async function generateResumePDF(event) {
    const button = event ? event.target.closest('button') : document.querySelector('button[onclick*="generateResumePDF"]');

    try {
        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined') {
            alert('PDF library is loading. Please try again in a moment.');
            return;
        }

        // Get current language
        const currentLang = document.querySelector('.language-btn.active').getAttribute('data-lang');

        // Fetch data
        const translations = await fetchData(DATA_URLS[currentLang]);
        const experienceUrl = currentLang === 'sv' ? DATA_URLS.experience_sv : DATA_URLS.experience_en;
        const experienceData = await fetchData(experienceUrl);

        // Show loading
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        button.disabled = true;

        // Create PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Minimalist colors
        const greenAccent = [123, 164, 40]; // #7BA428 - Your website green
        const textBlack = [0, 0, 0];
        const textGray = [80, 80, 80];
        const lineGray = [200, 200, 200];

        // Page setup
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const leftColWidth = 55;
        const leftColX = margin;
        const rightColX = margin + leftColWidth + 10;
        const rightColWidth = pageWidth - rightColX - margin;

        // === PAGE 1 ===
        
        // Header - Name and title
        let yPos = margin + 5;
        doc.setTextColor(...greenAccent);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('OLGA SAETHER', margin, yPos);
        
        yPos += 8;
        doc.setTextColor(...textGray);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Python AI Developer & ERP/CRM Consultant', margin, yPos);
        
        // Thin green line
        yPos += 4;
        doc.setDrawColor(...greenAccent);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        
        yPos += 10;

        // LEFT COLUMN - Contact Info
        let leftY = yPos;
        doc.setTextColor(...greenAccent);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('CONTACT', leftColX, leftY);
        
        leftY += 6;
        doc.setTextColor(...textBlack);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        const contactInfo = [
            'Charlottenberg, 673 92',
            '+46 737 686 471',
            '5441700@gmail.com',
            'PtOlga.github.io'
        ];
        
        contactInfo.forEach(info => {
            const lines = doc.splitTextToSize(info, leftColWidth);
            doc.text(lines, leftColX, leftY);
            leftY += lines.length * 4.5 + 1;
        });

        // LEFT COLUMN - Skills
        leftY += 5;
        doc.setTextColor(...greenAccent);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('SKILLS', leftColX, leftY);
        
        leftY += 6;
        doc.setTextColor(...textBlack);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        
        const skills = [
            'Python & AI/ML',
            'Flask & Django',
            'Next.js & React',
            'PostgreSQL & MongoDB',
            'PlanFix & Bitrix24',
            'Git & CI/CD',
            'SEO & Google Ads',
            'Business Analysis'
        ];
        
        skills.forEach(skill => {
            doc.text('\u2022 ' + skill, leftColX, leftY);
            leftY += 4.5;
        });

        // LEFT COLUMN - Languages
        leftY += 5;
        doc.setTextColor(...greenAccent);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('LANGUAGES', leftColX, leftY);
        
        leftY += 6;
        doc.setTextColor(...textBlack);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        
        const languages = [
            { name: 'Russian', level: 'Native' },
            { name: 'English', level: 'Fluent (C1)' },
            { name: 'Swedish', level: 'Intermediate (B1)' }
        ];
        
        languages.forEach(lang => {
            doc.setFont('helvetica', 'bold');
            doc.text(lang.name, leftColX, leftY);
            leftY += 3.5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textGray);
            doc.text(lang.level, leftColX, leftY);
            leftY += 5;
            doc.setTextColor(...textBlack);
        });

        // RIGHT COLUMN - Summary
        let rightY = yPos;
        doc.setTextColor(...greenAccent);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL SUMMARY', rightColX, rightY);

        rightY += 6;
        doc.setTextColor(...textBlack);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(translations.resume.summary_text, rightColWidth);
        doc.text(summaryLines, rightColX, rightY);

        rightY += summaryLines.length * 4 + 6;

        // RIGHT COLUMN - Core Competencies
        doc.setTextColor(...greenAccent);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('CORE COMPETENCIES', rightColX, rightY);

        rightY += 6;
        doc.setTextColor(...textBlack);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        const competencies = [
            { title: translations.resume.skills_ai, items: translations.resume.skills_ai_list },
            { title: translations.resume.skills_db, items: translations.resume.skills_db_list },
            { title: translations.resume.skills_erp, items: translations.resume.skills_erp_list },
            { title: translations.resume.skills_web, items: translations.resume.skills_web_list }
        ];

        competencies.forEach(comp => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...greenAccent);
            doc.text('\u2022 ' + comp.title + ':', rightColX, rightY);
            rightY += 4;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textGray);
            const itemLines = doc.splitTextToSize(comp.items, rightColWidth - 5);
            doc.text(itemLines, rightColX + 3, rightY);
            rightY += itemLines.length * 3.5 + 3;
        });

        rightY += 3;

        // RIGHT COLUMN - Professional Experience
        doc.setTextColor(...greenAccent);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL EXPERIENCE', rightColX, rightY);

        rightY += 6;

        experienceData.forEach((exp, index) => {
            // Check if we need a new page
            if (rightY > 250) {
                doc.addPage();
                rightY = margin;
            }

            // Job title
            doc.setFontSize(10.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...textBlack);
            doc.text(exp.title, rightColX, rightY);

            // Date
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(...greenAccent);
            const dateWidth = doc.getTextWidth(exp.date);
            doc.text(exp.date, pageWidth - margin - dateWidth, rightY);

            rightY += 4;
            doc.setFontSize(9.5);
            doc.setTextColor(...textGray);
            doc.setFont('helvetica', 'italic');
            doc.text(exp.company, rightColX, rightY);

            rightY += 5;

            // Responsibilities
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(...textBlack);
            exp.responsibilities.forEach(resp => {
                const respLines = doc.splitTextToSize('\u2022 ' + resp, rightColWidth - 3);
                doc.text(respLines, rightColX, rightY);
                rightY += respLines.length * 3.5 + 1;
            });

            rightY += 4;
        });

        // === PAGE 2 ===
        if (rightY < 200) {
            rightY += 5;
        } else {
            doc.addPage();
            rightY = margin;
        }

        // Projects
        doc.setTextColor(...greenAccent);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('NOTABLE PROJECTS', rightColX, rightY);

        rightY += 6;

        const projects = [
            { name: translations.resume.project_1_name, desc: translations.resume.project_1_desc },
            { name: translations.resume.project_2_name, desc: translations.resume.project_2_desc },
            { name: translations.resume.project_3_name, desc: translations.resume.project_3_desc },
            { name: translations.resume.project_4_name, desc: translations.resume.project_4_desc },
            { name: translations.resume.project_5_name, desc: translations.resume.project_5_desc },
            { name: translations.resume.project_6_name, desc: translations.resume.project_6_desc },
            { name: translations.resume.project_7_name, desc: translations.resume.project_7_desc },
            { name: translations.resume.project_8_name, desc: translations.resume.project_8_desc }
        ];

        doc.setFontSize(9);
        projects.forEach(project => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...textBlack);
            doc.text('\u2022 ' + project.name, rightColX, rightY);

            rightY += 3.5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textGray);
            const descLines = doc.splitTextToSize(project.desc, rightColWidth - 3);
            doc.text(descLines, rightColX + 3, rightY);
            rightY += descLines.length * 3 + 3;
        });

        rightY += 3;

        // Education
        doc.setTextColor(...greenAccent);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('EDUCATION & CERTIFICATIONS', rightColX, rightY);

        rightY += 6;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textBlack);

        const eduItems = [
            { name: translations.resume.edu_cert_1_name, desc: translations.resume.edu_cert_1_desc },
            { name: translations.resume.edu_degree_name, desc: translations.resume.edu_degree_desc }
        ];

        eduItems.forEach(edu => {
            const eduText = edu.name + ' - ' + edu.desc;
            const eduLines = doc.splitTextToSize('\u2022 ' + eduText, rightColWidth - 3);
            doc.text(eduLines, rightColX, rightY);
            rightY += eduLines.length * 3.5 + 2;
        });

        // Save PDF
        const fileName = currentLang === 'sv' ? 'Olga_Saether_CV.pdf' : 'Olga_Saether_Resume.pdf';
        doc.save(fileName);

        // Restore button
        button.innerHTML = originalHTML;
        button.disabled = false;

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF: ' + error.message);
        if (button) {
            button.innerHTML = originalHTML || '<i class="fas fa-download"></i> Download PDF Resume';
            button.disabled = false;
        }
    }
}

