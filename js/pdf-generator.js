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
        const greenPrimary = [26, 188, 156]; // #1abc9c - Your green
        const greenDark = [22, 160, 133]; // #16a085 - Darker shade
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

            // Draw circular photo with proper clipping
            const photoSize = 40;
            const photoX = leftPanelWidth / 2;
            const photoY = 25;

            // Create circular clipping path
            doc.saveGraphicsState();

            // Draw white circle background
            doc.setFillColor(...white);
            doc.circle(photoX, photoY, photoSize / 2 + 1, 'F');

            // Add image centered and cropped to circle
            const imgAspect = img.width / img.height;
            let imgWidth = photoSize;
            let imgHeight = photoSize;
            let imgX = photoX - photoSize / 2;
            let imgY = photoY - photoSize / 2;

            // Adjust for aspect ratio to fill circle
            if (imgAspect > 1) {
                imgWidth = photoSize * imgAspect;
                imgX = photoX - (imgWidth / 2);
            } else {
                imgHeight = photoSize / imgAspect;
                imgY = photoY - (imgHeight / 2);
            }

            doc.addImage(img, 'JPEG', imgX, imgY, imgWidth, imgHeight, '', 'FAST');

            // Draw white circle border
            doc.setDrawColor(...white);
            doc.setLineWidth(3);
            doc.circle(photoX, photoY, photoSize / 2, 'S');

            doc.restoreGraphicsState();
        } catch (error) {
            console.warn('Could not load profile photo:', error);
        }
        
        // Name and title on left panel
        let yPos = 72;
        doc.setTextColor(...white);
        doc.setFontSize(36); // 24 * 1.5
        doc.setFont('helvetica', 'bold');
        doc.text('Olga Saether', leftPanelWidth / 2, yPos, { align: 'center' });

        yPos += 12;
        doc.setFontSize(15); // 10 * 1.5
        doc.setFont('helvetica', 'normal');
        const subtitle = currentLang === 'sv' ? 'Python AI Developer &\nERP/CRM Consultant' : 'Python AI Developer &\nERP/CRM Consultant';
        const subtitleLines = doc.splitTextToSize(subtitle, leftPanelWidth - 10);
        doc.text(subtitleLines, leftPanelWidth / 2, yPos, { align: 'center' });

        // Contact info on left panel
        yPos += 20;
        doc.setFontSize(13.5); // 9 * 1.5
        const contactInfo = [
            { text: 'Charlottenberg, 673 92' },
            { text: '+46 737 686 471' },
            { text: '5441700@gmail.com' },
            { text: 'PtOlga.github.io' }
        ];

        contactInfo.forEach(item => {
            const lines = doc.splitTextToSize(item.text, leftPanelWidth - 10);
            doc.text(lines, leftPanelWidth / 2, yPos, { align: 'center' });
            yPos += 9; // 6 * 1.5
        });
        
        // Websites section on left panel
        yPos += 8;
        doc.setFontSize(16.5); // 11 * 1.5
        doc.setFont('helvetica', 'bold');
        const websitesTitle = currentLang === 'sv' ? 'Webbplatser' : 'Websites';
        doc.text(websitesTitle, leftPanelWidth / 2, yPos, { align: 'center' });

        yPos += 9;
        doc.setFontSize(12); // 8 * 1.5
        doc.setFont('helvetica', 'normal');
        const websites = [
            'linkedin.com/in/\nolga-petrovskaya',
            'github.com/PtOlga',
            'status.law'
        ];

        websites.forEach(site => {
            const lines = doc.splitTextToSize(site, leftPanelWidth - 10);
            doc.text(lines, leftPanelWidth / 2, yPos, { align: 'center' });
            yPos += lines.length * 6 + 2;
        });

        // Skills section on left panel
        yPos += 8;
        doc.setFontSize(16.5); // 11 * 1.5
        doc.setFont('helvetica', 'bold');
        const skillsTitle = currentLang === 'sv' ? 'Kompetenser' : 'Core Skills';
        doc.text(skillsTitle, leftPanelWidth / 2, yPos, { align: 'center' });

        yPos += 9;
        doc.setFontSize(12); // 8 * 1.5
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
            doc.text('• ' + skill, leftPanelWidth / 2, yPos, { align: 'center' });
            yPos += 7.5; // 5 * 1.5
        });
        
        // Right panel - Professional Summary
        yPos = 20;
        doc.setTextColor(...textDark);
        doc.setFontSize(21); // 14 * 1.5
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.summary_title, rightPanelX, yPos);

        yPos += 10.5; // 7 * 1.5
        doc.setFontSize(13.5); // 9 * 1.5
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textGray);
        const summaryLines = doc.splitTextToSize(translations.resume.summary_text, rightPanelWidth);
        doc.text(summaryLines, rightPanelX, yPos);

        yPos += summaryLines.length * 6 + 7.5; // 4 * 1.5 and 5 * 1.5

        // Core Competencies (4 columns)
        doc.setTextColor(...textDark);
        doc.setFontSize(18); // 12 * 1.5
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.skills_title, rightPanelX, yPos);

        yPos += 9; // 6 * 1.5
        doc.setFontSize(12); // 8 * 1.5
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
            doc.setFontSize(10.5); // 7 * 1.5
            const itemLines = doc.splitTextToSize(skill.items, colWidth - 5);
            doc.text(itemLines, xPos, skillYPos + 4.5); // 3 * 1.5

            col++;
            if (col >= 2) {
                col = 0;
                skillYPos += 18; // 12 * 1.5
            }

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...greenDark);
            doc.setFontSize(12); // 8 * 1.5
        });

        yPos = skillYPos + 7.5; // 5 * 1.5

        // Professional Experience
        doc.setTextColor(...textDark);
        doc.setFontSize(18); // 12 * 1.5
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.experience_title, rightPanelX, yPos);

        yPos += 9; // 6 * 1.5

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
                doc.setFontSize(15); // 10 * 1.5
                doc.setFont('helvetica', 'italic');
                doc.text(currentLang === 'sv' ? 'Fortsättning...' : 'Continued...', leftPanelWidth / 2, 20, { align: 'center' });

                yPos = 20;
            }

            // Job title and company
            doc.setFontSize(15); // 10 * 1.5
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...textDark);
            doc.text(exp.title, rightPanelX, yPos);

            // Date on the right
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12); // 8 * 1.5
            doc.setTextColor(...greenDark);
            doc.text(exp.date, rightPanelX + rightPanelWidth - 30, yPos, { align: 'right' });

            yPos += 6; // 4 * 1.5
            doc.setFontSize(13.5); // 9 * 1.5
            doc.setTextColor(...textGray);
            doc.setFont('helvetica', 'italic');
            doc.text(exp.company, rightPanelX, yPos);

            yPos += 7.5; // 5 * 1.5

            // Responsibilities
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12); // 8 * 1.5
            exp.responsibilities.forEach(resp => {
                const respLines = doc.splitTextToSize('• ' + resp, rightPanelWidth - 5);
                doc.text(respLines, rightPanelX, yPos);
                yPos += respLines.length * 5.25 + 1.5; // 3.5 * 1.5 and 1 * 1.5
            });

            yPos += 4.5; // 3 * 1.5
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
            doc.setFontSize(16.5); // 11 * 1.5
            doc.setFont('helvetica', 'bold');
            doc.text(translations.resume.languages_title, leftPanelWidth / 2, leftYPos, { align: 'center' });

            leftYPos += 10.5; // 7 * 1.5
            doc.setFontSize(13.5); // 9 * 1.5
            doc.setFont('helvetica', 'normal');

            const languages = [
                { name: translations.resume.lang_ru, level: translations.resume.lang_ru_level },
                { name: translations.resume.lang_en, level: translations.resume.lang_en_level },
                { name: translations.resume.lang_sv, level: translations.resume.lang_sv_level }
            ];

            languages.forEach(lang => {
                doc.setFont('helvetica', 'bold');
                doc.text(lang.name, leftPanelWidth / 2, leftYPos, { align: 'center' });
                leftYPos += 6; // 4 * 1.5
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12); // 8 * 1.5
                const levelLines = doc.splitTextToSize(lang.level, leftPanelWidth - 10);
                doc.text(levelLines, leftPanelWidth / 2, leftYPos, { align: 'center' });
                leftYPos += levelLines.length * 6 + 4.5; // 4 * 1.5 and 3 * 1.5
                doc.setFontSize(13.5); // 9 * 1.5
            });

            yPos = 20;
        }

        // Projects section on page 2
        doc.setTextColor(...textDark);
        doc.setFontSize(18); // 12 * 1.5
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.projects_title, rightPanelX, yPos);

        yPos += 9; // 6 * 1.5

        // Add projects (compact format)
        doc.setFontSize(12); // 8 * 1.5
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
            doc.text(descLines, rightPanelX + 4.5, yPos + 4.5); // 3 * 1.5 and 3 * 1.5
            yPos += descLines.length * 4.5 + 6; // 3 * 1.5 and 4 * 1.5
        });

        yPos += 4.5; // 3 * 1.5

        // Education section
        doc.setTextColor(...textDark);
        doc.setFontSize(18); // 12 * 1.5
        doc.setFont('helvetica', 'bold');
        doc.text(translations.resume.education_title, rightPanelX, yPos);

        yPos += 9; // 6 * 1.5
        doc.setFontSize(12); // 8 * 1.5
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
            yPos += eduLines.length * 5.25 + 3; // 3.5 * 1.5 and 2 * 1.5
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textGray);
        });

        // Certifications
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textDark);
        doc.text(translations.resume.edu_cert_title + ':', rightPanelX, yPos);
        yPos += 4.5; // 3 * 1.5
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

