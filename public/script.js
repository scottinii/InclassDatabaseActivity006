document.addEventListener('DOMContentLoaded', async () => {
    const paintingsDiv = document.getElementById('paintings');
    const paintingForm = document.getElementById('painting-form');
    const titleInput = document.getElementById('title');
    const artistInput = document.getElementById('artist');
    const descriptionInput = document.getElementById('description');

    // Fetch paintings from the API
    try {
        const response = await fetch('http://localhost:3000/api/paintings');
        const paintings = await response.json();

        // Display paintings
        paintings.forEach(painting => {
            const paintingItem = document.createElement('div');
            paintingItem.className = 'painting-item';
            paintingItem.innerText = painting.Title;
            paintingItem.onclick = () => showPaintingDetails(painting);
            paintingsDiv.appendChild(paintingItem);
        });
    } catch (error) {
        console.error('Error fetching paintings:', error);
    }

    // Show painting details in the form
    function showPaintingDetails(painting) {
        titleInput.value = painting.Title;
        artistInput.value = painting.FirstName ? painting.FirstName + ' ' + painting.LastName : painting.LastName;
        descriptionInput.value = painting.Description;
        paintingForm.style.display = 'block';
    }

    // Save button functionality
    document.getElementById('save-button').onclick = async () => {
        const updatedPainting = {
            Title: titleInput.value,
            FirstName: artistInput.value.split(' ')[0] || null, // Split to get FirstName
            LastName: artistInput.value.split(' ').slice(1).join(' '), // Remaining as LastName
            Description: descriptionInput.value,
        };

        // Implement update logic here
        try {
            // Replace this URL with your actual update endpoint
            await fetch('http://localhost:3000/api/paintings/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPainting),
            });
            alert('Painting updated successfully!');
            paintingForm.reset(); // Optionally reset the form
        } catch (error) {
            console.error('Error updating painting:', error);
            alert('Failed to update painting. Please try again.');
        }
    };

    // Reset button functionality
    document.getElementById('reset-button').onclick = () => {
        paintingForm.reset();
        paintingForm.style.display = 'none'; // Hide form when reset
    };
});
