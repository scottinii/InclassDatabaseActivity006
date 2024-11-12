document.addEventListener('DOMContentLoaded', async () => {
    const paintingsDiv = document.getElementById('paintings');
    const paintingForm = document.getElementById('painting-form');
    const titleInput = document.getElementById('title');
    const artistInput = document.getElementById('artist');
    const descriptionInput = document.getElementById('description');

    let currentPaintingID = null;
    let originalPaintingData = {}; // To store initial values for reset

    // Fetch paintings from the API and display with images
    async function fetchAndDisplayPaintings() {
        try {
            const response = await fetch('http://localhost:3000/api/paintings');
            const paintings = await response.json();

            // Clear previous paintings list
            paintingsDiv.innerHTML = ''; 
            
            // Display paintings with images
            paintings.forEach(painting => {
                const paintingItem = document.createElement('div');
                paintingItem.className = 'painting-item';

                // Try to add image for each painting
                const paintingImage = document.createElement('img');
                paintingImage.className = 'painting-image';
                try {
                    paintingImage.src = 'images/${painting.PaintingID}.jpg'; // Assuming image files are named by PaintingID
                } catch (imageError) {
                    paintingImage.src = 'images/default.jpg'; // Fallback to a default image
                }

                // Add title text and image to the item
                const paintingTitle = document.createElement('div');
                paintingTitle.className = 'painting-title';
                paintingTitle.innerText = painting.Title;
                
                paintingItem.appendChild(paintingImage);
                paintingItem.appendChild(paintingTitle);
                paintingItem.onclick = () => showPaintingDetails(painting);
                paintingsDiv.appendChild(paintingItem);
            });
        } catch (error) {
            console.error('Error fetching paintings:', error);
        }
    }

    // Initial fetch and display of paintings
    await fetchAndDisplayPaintings();

    // Show painting details in the form
    function showPaintingDetails(painting) {
        currentPaintingID = painting.PaintingID;

        // Store the current values for resetting
        originalPaintingData = {
            Title: painting.Title,
            FirstName: painting.FirstName,
            LastName: painting.LastName,
            Description: painting.Description,
        };

        // Set form fields to the current painting values
        titleInput.value = originalPaintingData.Title;
        artistInput.value = `${originalPaintingData.FirstName || ''} ${originalPaintingData.LastName || ''}`.trim();
        descriptionInput.value = originalPaintingData.Description;
        
        paintingForm.style.display = 'block';
    }

    // Save button functionality
    document.getElementById('save-button').onclick = async () => {
        if (!currentPaintingID) {
            alert('No painting selected!');
            return;
        }

        const updatedPainting = {
            PaintingID: currentPaintingID,
            Title: titleInput.value,
            FirstName: artistInput.value.split(' ')[0] || null,
            LastName: artistInput.value.split(' ').slice(1).join(' '),
            Description: descriptionInput.value,
        };

        // Implement update logic here
        try {
            await fetch('http://localhost:3000/api/paintings/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPainting),
            });
            alert('Painting updated successfully!');

            // Update originalPaintingData to reflect new saved state
            originalPaintingData = { ...updatedPainting };

            // Refresh the painting list
            await fetchAndDisplayPaintings();
        } catch (error) {
            console.error('Error updating painting:', error);
            alert('Failed to update painting. Please try again.');
        }
    };

    // Reset button functionality to revert to original values
    document.getElementById('reset-button').onclick = () => {
        if (currentPaintingID) {
            titleInput.value = originalPaintingData.Title;
            artistInput.value = `${originalPaintingData.FirstName || ''} ${originalPaintingData.LastName || ''}`.trim();
            descriptionInput.value = originalPaintingData.Description;
        } else {
            paintingForm.reset();
        }
    };
});