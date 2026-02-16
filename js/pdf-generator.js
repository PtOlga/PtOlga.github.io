// PDF Resume Generator with Green Design
// Uses jsPDF to create a professional 2-page resume

async function generateResumePDF(event) {
    // Find button
    const button = event ? event.target.closest('button') : document.querySelector('button[onclick*="generateResumePDF"]');

    try {
        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined') {
            alert('PDF library is loading. Please try again in a moment.');
            return;
        }

        // Get current language from active button
        const currentLang = document.querySelector('.language-btn.active').getAttribute('data-lang');

        // Fetch translations and data
        const translations = await fetchData(DATA_URLS[currentLang]);
        const experienceUrl = currentLang === 'sv' ? DATA_URLS.experience_sv : DATA_URLS.experience_en;
        const experienceData = await fetchData(experienceUrl);

        // Show loading indicator
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
        
        // Colors
        const greenPrimary = [16, 185, 129]; // #10b981 - Modern green
        const greenDark = [5, 150, 105]; // #059669
        const textDark = [31, 41, 55]; // #1f2937
        const textGray = [107, 114, 128]; // #6b7280
        const white = [255, 255, 255];
        
        // Page dimensions
        const pageWidth = 210;
        const pageHeight = 297;
        const leftPanelWidth = 65;
        const rightPanelX = leftPanelWidth + 5;
        const rightPanelWidth = pageWidth - leftPanelWidth - 10;
        
        // Draw green left panel
        doc.setFillColor(...greenPrimary);
        doc.rect(0, 0, leftPanelWidth, pageHeight, 'F');
        
        // Add profile photo (circular)
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = 'img/profile.jpg';
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            
            // Draw circular photo
            const photoSize = 35;
            const photoX = leftPanelWidth / 2;
            const photoY = 20;
            
            doc.setFillColor(...white);
            doc.circle(photoX, photoY, photoSize / 2 + 1, 'F');
            doc.addImage(img, 'JPEG', photoX - photoSize / 2, photoY - photoSize / 2, photoSize, photoSize, '', 'FAST', 0);
            
            // Clip to circle (visual effect)
            doc.setDrawColor(...white);
            doc.setLineWidth(2);
            doc.circle(photoX, photoY, photoSize / 2, 'S');
        } catch (error) {
            console.warn('Could not load profile photo:', error);
        }
        
        // Name and title on left panel
        let yPos = 60;
        doc.setTextColor(...white);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Olga Saether', leftPanelWidth / 2, yPos, { align: 'center' });
        
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const subtitle = currentLang === 'sv' ? 'Python AI-utvecklare &\nERP/CRM-konsult' : 'Python AI Developer &\nERP/CRM Consultant';
        const subtitleLines = doc.splitTextToSize(subtitle, leftPanelWidth - 10);
        doc.text(subtitleLines, leftPanelWidth / 2, yPos, { align: 'center' });
        
        // Contact info on left panel
        yPos += 15;
        doc.setFontSize(9);
        const contactInfo = [
            { icon: '📍', text: 'Charlottenberg, 673 92' },
            { icon: '📞', text: '+46 737 686 471' },
            { icon: '✉', text: '5441700@gmail.com' },
            { icon: '🔗', text: 'PtOlga.github.io' }
        ];
        
        contactInfo.forEach(item => {
            doc.text(item.icon, 5, yPos);
            doc.text(item.text, 12, yPos);
            yPos += 6;
        });
        
        // Websites section on left panel
        yPos += 5;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const websitesTitle = currentLang === 'sv' ? 'Webbplatser & Profiler' : 'Websites & Profiles';
        doc.text(websitesTitle, 5, yPos);
        
        yPos += 6;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        const websites = [
            'linkedin.com/in/olga-petrovskaya',
            'github.com/PtOlga',
            'status.law'
        ];
        
        websites.forEach(site => {
            const lines = doc.splitTextToSize(site, leftPanelWidth - 10);
            doc.text(lines, 5, yPos);
            yPos += 5;
        });
        
        // Skills section on left panel
        yPos += 5;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const skillsTitle = currentLang === 'sv' ? 'Kompetenser' : 'Core Skills';
        doc.text(skillsTitle, 5, yPos);
        
        yPos += 6;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        
        const skillsList = [
            'Software development',
            'Business analysis',
            'Machine learning',
            'Digital solutions',
            'Git workflow',
            'Self motivation',
            'Problem solving',
            'Team leadership'
        ];
        
        skillsList.forEach(skill => {
            doc.text('• ' + skill, 5, yPos);
            yPos += 5;
        });
        
        // Right panel - Professional Summary
        yPos = 20;
        doc.setTextColor(...textDark);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.summary_title, rightPanelX, yPos);
        
        yPos += 7;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textGray);
        const summaryLines = doc.splitTextToSize(translations.resume.summary_text, rightPanelWidth);
        doc.text(summaryLines, rightPanelX, yPos);
        
        yPos += summaryLines.length * 4 + 5;

        // Core Competencies (4 columns)
        doc.setTextColor(...textDark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.skills_title, rightPanelX, yPos);

        yPos += 6;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...greenDark);

        const skills = [
            { title: translations.resume.skills_ai, items: translations.resume.skills_ai_list },
            { title: translations.resume.skills_db, items: translations.resume.skills_db_list },
            { title: translations.resume.skills_erp, items: translations.resume.skills_erp_list },
            { title: translations.resume.skills_web, items: translations.resume.skills_web_list }
        ];

        const colWidth = rightPanelWidth / 2;
        let col = 0;
        let skillYPos = yPos;

        skills.forEach((skill, index) => {
            const xPos = rightPanelX + (col * colWidth);
            doc.text(skill.title, xPos, skillYPos);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textGray);
            doc.setFontSize(7);
            const itemLines = doc.splitTextToSize(skill.items, colWidth - 5);
            doc.text(itemLines, xPos, skillYPos + 3);

            col++;
            if (col >= 2) {
                col = 0;
                skillYPos += 12;
            }

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...greenDark);
            doc.setFontSize(8);
        });

        yPos = skillYPos + 5;

        // Professional Experience
        doc.setTextColor(...textDark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.experience_title, rightPanelX, yPos);

        yPos += 6;

        // Add experience items
        experienceData.forEach((exp, index) => {
            // Check if we need a new page
            if (yPos > 250) {
                doc.addPage();

                // Draw green left panel on page 2
                doc.setFillColor(...greenPrimary);
                doc.rect(0, 0, leftPanelWidth, pageHeight, 'F');

                // Add "Continued" text on left panel
                doc.setTextColor(...white);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'italic');
                doc.text(currentLang === 'sv' ? 'Fortsättning...' : 'Continued...', leftPanelWidth / 2, 20, { align: 'center' });

                yPos = 20;
            }

            // Job title and company
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...textDark);
            doc.text(exp.title, rightPanelX, yPos);

            // Date on the right
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...greenDark);
            doc.text(exp.date, rightPanelX + rightPanelWidth - 30, yPos, { align: 'right' });

            yPos += 4;
            doc.setFontSize(9);
            doc.setTextColor(...textGray);
            doc.setFont('helvetica', 'italic');
            doc.text(exp.company, rightPanelX, yPos);

            yPos += 5;

            // Responsibilities
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            exp.responsibilities.forEach(resp => {
                const respLines = doc.splitTextToSize('• ' + resp, rightPanelWidth - 5);
                doc.text(respLines, rightPanelX, yPos);
                yPos += respLines.length * 3.5 + 1;
            });

            yPos += 3;
        });

        // Check if we need page 2
        if (doc.internal.pages.length === 1 || doc.internal.getCurrentPageInfo().pageNumber === 1) {
            doc.addPage();

            // Draw green left panel on page 2
            doc.setFillColor(...greenPrimary);
            doc.rect(0, 0, leftPanelWidth, pageHeight, 'F');

            // Languages section on left panel of page 2
            let leftYPos = 20;
            doc.setTextColor(...white);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(translations.resume.languages_title, 5, leftYPos);

            leftYPos += 7;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');

            const languages = [
                { name: translations.resume.lang_ru, level: translations.resume.lang_ru_level },
                { name: translations.resume.lang_en, level: translations.resume.lang_en_level },
                { name: translations.resume.lang_sv, level: translations.resume.lang_sv_level }
            ];

            languages.forEach(lang => {
                doc.setFont('helvetica', 'bold');
                doc.text(lang.name, 5, leftYPos);
                leftYPos += 4;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                const levelLines = doc.splitTextToSize(lang.level, leftPanelWidth - 10);
                doc.text(levelLines, 5, leftYPos);
                leftYPos += levelLines.length * 4 + 3;
                doc.setFontSize(9);
            });

            yPos = 20;
        }

        // Projects section on page 2
        doc.setTextColor(...textDark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.projects_title, rightPanelX, yPos);

        yPos += 6;

        // Add projects (compact format)
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textGray);

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

        projects.forEach(project => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...textDark);
            doc.text('• ' + project.name + ':', rightPanelX, yPos);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textGray);
            const descLines = doc.splitTextToSize(project.desc, rightPanelWidth - 5);
            doc.text(descLines, rightPanelX + 3, yPos + 3);
            yPos += descLines.length * 3 + 4;
        });

        yPos += 3;

        // Education section
        doc.setTextColor(...textDark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.education_title, rightPanelX, yPos);

        yPos += 6;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textGray);

        // Education items
        const eduItems = [
            { name: translations.resume.edu_cert_1_name, desc: translations.resume.edu_cert_1_desc },
            { name: translations.resume.edu_degree_name, desc: translations.resume.edu_degree_desc }
        ];

        eduItems.forEach(edu => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...textDark);
            const eduLines = doc.splitTextToSize(edu.name + ' - ' + edu.desc, rightPanelWidth - 5);
            doc.text(eduLines, rightPanelX, yPos);
            yPos += eduLines.length * 3.5 + 2;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textGray);
        });

        // Certifications
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textDark);
        doc.text(translations.resume.edu_cert_title + ':', rightPanelX, yPos);
        yPos += 3;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textGray);
        const certLines = doc.splitTextToSize(translations.resume.edu_cert_list, rightPanelWidth - 5);
        doc.text(certLines, rightPanelX, yPos);

        // Save PDF
        const fileName = currentLang === 'sv' ? 'Olga_Saether_CV.pdf' : 'Olga_Saether_Resume.pdf';
        doc.save(fileName);

        // Restore button
        button.innerHTML = originalHTML;
        button.disabled = false;

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message + '. Please try again.');

        // Restore button
        if (button) {
            const currentLang = document.querySelector('.language-btn.active')?.getAttribute('data-lang') || 'en';
            const buttonText = currentLang === 'sv' ? 'Ladda ner PDF CV' : 'Download PDF Resume';
            button.innerHTML = `<i class="fas fa-file-pdf"></i> ${buttonText}`;
            button.disabled = false;
        }
    }
}

