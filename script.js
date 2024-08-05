function getCitation(citation_id, type, style, format) {
    // Simulate fetching a citation based on the id
    // In a real scenario, this function would query a citation database or API
    if (type === "inline") {
        return `<span>${citation_id} (inline citation in ${style})</span>`;
    } else if (type === "bibliography") {
        return `<li>${citation_id} (bibliography entry in ${style})</li>`;
    }
    return "";
}

function formatCitations() {
    // Find all <cite> elements in the document
    const citeElements = document.querySelectorAll('cite[data-style]');

    citeElements.forEach(el => {
        const dataStyle = el.getAttribute('data-style');
        const citation_ids = el.innerText.replace(/@/g, '').split(',').map(id => id.trim());

        // Create inline citation HTML
        const inlineCitations = citation_ids.map(id => getCitation(id, "inline", dataStyle, "html")).join(', ');

        // Create bibliography list for tooltip
        const bibliographyList = citation_ids.map(id => getCitation(id, "bibliography", dataStyle, "html")).join('');

        // Replace innerHTML with inline citations
        el.innerHTML = inlineCitations;

        // Create tooltip content
        const tooltipContent = document.createElement('div');
        tooltipContent.classList.add('tooltip-content');
        tooltipContent.innerHTML = `<ul>${bibliographyList}</ul>`;

        // Append tooltip content to the cite element
        el.appendChild(tooltipContent);
        el.classList.add('tooltip');

        // Use Floating UI to manage tooltip position
        el.addEventListener('mouseenter', () => {
            floatingUI.computePosition(el, tooltipContent, {
                placement: 'top',
                middleware: [
                    floatingUI.offset(10),
                    floatingUI.flip(),
                    floatingUI.shift({ padding: 5 })
                ],
            }).then(({ x, y }) => {
                Object.assign(tooltipContent.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                    display: 'block'
                });
            });
        });

        el.addEventListener('mouseleave', () => {
            tooltipContent.style.display = 'none';
        });
    });
}

// Execute the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', formatCitations);