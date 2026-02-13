# 👋 Olga Saether - Portfolio Website

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ptolga.github.io)
[![GitHub Pages](https://img.shields.io/badge/hosted-GitHub%20Pages-blue)](https://pages.github.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Professional portfolio website showcasing IT consulting, AI automation, and web development projects.

## 🌐 Live Website

Visit the live portfolio: **[ptolga.github.io](https://ptolga.github.io)**

## 🎯 Features

- **Multi-language Support** - English and Swedish translations
- **Responsive Design** - Optimized for all devices (desktop, tablet, mobile)
- **Interactive Project Filtering** - Filter projects by category (AI, ERP/CRM, Web Development)
- **Dynamic Content Loading** - Projects, experience, and skills loaded from JSON files
- **Print-Friendly Resume** - One-click PDF generation of professional resume
- **Performance Optimized** - Vanilla JavaScript for fast loading times
- **SEO Friendly** - Semantic HTML and proper meta tags

## 📂 Project Structure

```
PtOlga.github.io/
├── index.html              # Main portfolio page
├── css/
│   ├── style.css          # Main stylesheet
│   └── styles.css         # Additional styles
├── js/
│   ├── main.js            # Core functionality and data loading
│   └── script.js          # Interactive features
├── data/
│   ├── projects.json      # Project data (EN)
│   ├── projects_sv.json   # Project data (SV)
│   ├── projects_en.json   # Project data (EN alternative)
│   ├── experience.json    # Work experience (EN)
│   ├── experience_sv.json # Work experience (SV)
│   ├── skills.json        # Skills and technologies
│   └── translations/      # UI translations
├── img/
│   └── profile.jpg        # Profile photo
└── README.md              # This file
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Poppins, Inter)
- **Hosting**: GitHub Pages
- **Version Control**: Git & GitHub

## 🚀 Featured Projects

### AI & Automation
- **AI Legal Workflow Automation** - Document processing system reducing processing time by 70%
- **Status Law AI Assistant** - RAG-based legal chatbot with multilingual support
- **Handwritten Digit Recognition** - Interactive ML application with Streamlit

### ERP/CRM Systems
- **PlanFix Reminder System** - Automated WhatsApp notifications for CRM tasks

### Web Development
- **Status Law Website** - Corporate site with multi-language support
- **Portfolio Website** - This responsive portfolio (meta!)

## 📊 Data Management

All content is managed through JSON files for easy updates:

- **projects.json** - Project details, technologies, and links
- **experience.json** - Professional work history
- **skills.json** - Technical skills and expertise levels
- **translations/** - UI text in multiple languages

## 🎨 Customization

### Adding a New Project

Edit `data/projects.json`:

```json
{
    "id": "unique-project-id",
    "category": ["ai", "web"],
    "icon": "fas fa-icon-name",
    "title": "Project Title",
    "description": "Project description",
    "features": ["Feature 1", "Feature 2"],
    "tech": ["Technology 1", "Technology 2"],
    "links": {
        "demo": "https://demo-url.com",
        "github": "https://github.com/username/repo"
    }
}
```

### Updating Translations

Edit files in `data/translations/` to add or modify UI text in different languages.

### Styling Customization

Modify `css/style.css` to adjust:
- Color scheme
- Typography
- Layout spacing
- Responsive breakpoints

## 🌍 Multi-language Support

The portfolio supports multiple languages with easy switching:
- **English (EN)** - Default language
- **Swedish (SV)** - Secondary language

Language files are located in `data/translations/` and can be extended for additional languages.

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints optimized for:
- 📱 Mobile devices (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🖨️ Print-Friendly Resume

Built-in print functionality generates a professional PDF resume:
- Optimized layout for printing
- Hidden navigation and interactive elements
- Clean, professional formatting

## 📈 Performance

- ⚡ Fast loading times with vanilla JavaScript
- 🎯 No heavy frameworks or dependencies
- 📦 Optimized asset sizes
- 🔍 SEO-optimized structure

## 🔗 Connect

- **Email**: [5441700@gmail.com](mailto:5441700@gmail.com)
- **Phone**: [+46 73 768 64 71](tel:+46737686471)
- **LinkedIn**: [linkedin.com/in/olga-petrovskaya](https://www.linkedin.com/in/olga-petrovskaya)
- **GitHub**: [github.com/PtOlga](https://github.com/PtOlga)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- GitHub Pages for hosting

---

**Built with ❤️ by Olga Saether**

*Last updated: October 2025*