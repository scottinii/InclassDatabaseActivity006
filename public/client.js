// Fetch and display paintings
async function fetchPaintings() {
    try {
        const response = await fetch('/api/paintings');
        const paintings = await response.json();
        const paintingList = document.getElementById('painting-list');

        paintingList.innerHTML = ''; // Clear previous content
        paintings.forEach(painting => {
            const button = document.createElement('button');
            button.innerText = painting.Title;
            button.onclick = () => showPaintingDetails(painting);
            paintingList.appendChild(button);
        });
    } catch (error) {
        console.error('Error fetching paintings:', error);
    }
}

// Show painting details in the form
function showPaintingDetails(painting) {
    document.getElementById('painting-id').value = painting._id;
    document.getElementById('title').value = painting.Title;
    document.getElementById('artist').value = `${painting.FirstName || ''} ${painting.LastName}`;
    document.getElementById('description').value = painting.Description;
}

// Handle form submission
document.getElementById('painting-form').onsubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const id = document.getElementById('painting-id').value;
    const updatedPainting = {
        Title: document.getElementById('title').value,
        Description: document.getElementById('description').value,
        // Add other fields here as necessary
    };

    try {
        await fetch(`/api/paintings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPainting),
        });
        fetchPaintings(); // Refresh the painting list
    } catch (error) {
        console.error('Error updating painting:', error);
    }
};

// Initial fetch of paintings when the page loads
fetchPaintings();
