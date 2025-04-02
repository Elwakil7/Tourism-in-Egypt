// Sample data for attractions
const attractions = [
    { title: "Giza Pyramids", description: "Visit the last remaining wonder of the ancient world.", image: "./assets/images/pyramids giza.jpg" },
    { title: "Luxor Temple", description: "Explore the magnificent temples of ancient Thebes.", image: "./assets/images/Luxur Temple.jpg" },
    { title: "Nile River", description: "Experience Egypt from its legendary river.", image: "./assets/images/nile rever.jpg" }
];

// Get the search query from the URL
const params = new URLSearchParams(window.location.search);
const query = params.get('query')?.toLowerCase() || "";

// Display the search query
document.getElementById('search-query').textContent = query;

// Filter attractions based on the query
const results = attractions.filter(attraction =>
    attraction.title.toLowerCase().includes(query) ||
    attraction.description.toLowerCase().includes(query)
);

// Display the results
const resultsContainer = document.getElementById('results-container');
if (results.length > 0) {
    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <img src="${result.image}" alt="${result.title}">
            <h3>${result.title}</h3>
            <p>${result.description}</p>
        `;
        resultsContainer.appendChild(card);
    });
} else {
    resultsContainer.innerHTML = "<p>No results found.</p>";
}
