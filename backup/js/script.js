document.addEventListener("DOMContentLoaded", function () {
  // Get elements from the DOM
  const noteInput = document.getElementById("noteInput"); // Input field for note text
  const noteTitle = document.getElementById("noteTitle"); // Input field for note title
  const saveBtn = document.getElementById("saveBtn"); // Button to save the note
  const notesList = document.getElementById("notesList"); // Container for displaying notes
  const searchInput = document.getElementById("searchInput"); // Input field for search
  const toggleDarkMode = document.getElementById("toggleDarkMode"); // Button to toggle dark mode

  // Modal related elements
  const modal = document.getElementById("noteModal"); // Modal for viewing note details
  const modalTitle = document.getElementById("modalTitle"); // Title element in the modal
  const modalText = document.getElementById("modalText"); // Text element in the modal
  const closeModal = document.querySelector(".modal .close"); // Button to close the modal
  const modalContent = document.querySelector(".modal-content"); // Modal content element

  // Image upload elements
  const uploadImageBtn = document.getElementById("uploadImageBtn"); // Button to trigger image upload
  const imageInput = document.getElementById("imageInput"); // Hidden file input
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  ); // Container for image preview
  const imagePreview = document.getElementById("imagePreview"); // Image element for preview
  let currentImageUrl = null; // Store current image URL

  // Load saved notes from local storage
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

  // Display saved notes on the page
  savedNotes.forEach((note, index) => addNoteToList(note, index));

  // Save note to local storage and display it
  saveBtn.addEventListener("click", function () {
    const noteText = noteInput.value.trim();
    const noteTitleText = noteTitle.value.trim();

    // Check if both title and text are not empty
    if (noteTitleText !== "" && noteText !== "") {
      const note = {
        title: noteTitleText,
        text: noteText,
        imageUrl: currentImageUrl, // Save image URL with the note
      };
      savedNotes.push(note); // Add note to the saved notes array
      localStorage.setItem("notes", JSON.stringify(savedNotes)); // Save notes to local storage
      addNoteToList(note, savedNotes.length - 1); // Add note to the list on the page
      noteInput.value = ""; // Clear note input field
      noteTitle.value = ""; // Clear note title field
      currentImageUrl = null; // Reset the current image URL
      imagePreviewContainer.style.display = "none"; // Hide the image preview
    }
  });

  // Handle image upload
  uploadImageBtn.addEventListener("click", function () {
    imageInput.click();
  });

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Save the image data URL to be used later
        currentImageUrl = e.target.result;
        // Set the image preview source and display it
        imagePreview.src = currentImageUrl;
        imagePreviewContainer.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Function to handle Enter and Shift+Enter key events
  function handleKeyPress(event) {
    if (event.target === noteTitle && event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or default behavior
      noteInput.focus(); // Focus on the textarea
    } else if (event.target === noteInput) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevent adding a new line
        saveBtn.click(); // Trigger the click event on the save button
      } else if (event.key === "Enter" && event.shiftKey) {
        // Allow adding a new line in the textarea
        return;
      }
    }
  }

  // Attach the key press event listener to both noteInput and noteTitle
  noteInput.addEventListener("keydown", handleKeyPress);
  noteTitle.addEventListener("keydown", handleKeyPress);

  // Function to add a note to the list
  function addNoteToList(note, index) {
    const div = document.createElement("div");
    div.className = "note-item";

    // Generate a random border color for the note
    const randomColor = getRandomColor();
    div.style.borderTopColor = randomColor;

    const noteTitle = document.createElement("h3");
    noteTitle.textContent = note.title;

    const noteText = document.createElement("span");
    noteText.textContent = note.text;

    div.appendChild(noteTitle);
    div.appendChild(noteText);

    if (note.imageUrl) {
      const noteImage = document.createElement("img");
      noteImage.src = note.imageUrl;
      noteImage.style.maxWidth = "100%";
      noteImage.style.borderRadius = "8px";
      noteImage.style.marginTop = "10px";
      div.appendChild(noteImage);
    }

    const iconContainer = document.createElement("div");
    iconContainer.className = "icon-btn";

    // Edit icon with functionality to toggle between edit and save
    const editIcon = document.createElement("i");
    editIcon.className = "fas fa-edit";
    editIcon.title = "Edit";
    editIcon.addEventListener("click", function () {
      if (noteText.contentEditable === "false") {
        noteText.contentEditable = true;
        noteTitle.contentEditable = true;
        noteText.focus();
        editIcon.className = "fas fa-save";
        editIcon.title = "Save";
      } else {
        noteText.contentEditable = false;
        noteTitle.contentEditable = false;
        savedNotes[index] = {
          title: noteTitle.textContent.trim(),
          text: noteText.textContent.trim(),
          imageUrl: note.imageUrl, // Save the image URL with the note
        };
        localStorage.setItem("notes", JSON.stringify(savedNotes));
        editIcon.className = "fas fa-edit";
        editIcon.title = "Edit";
      }
    });

    // Delete icon with functionality to remove the note
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash";
    deleteIcon.title = "Delete";
    deleteIcon.addEventListener("click", function () {
      notesList.removeChild(div);
      deleteNoteFromStorage(note);
    });

    // View icon to display the note in a modal
    const viewIcon = document.createElement("i");
    viewIcon.className = "fas fa-eye";
    viewIcon.title = "View";
    viewIcon.addEventListener("click", function () {
      // Update modal title and content
      modalTitle.textContent = note.title;
      modalText.textContent = note.text;

      // Adjust modal content based on the length of the note text
      if (note.text.length < 100) {
        modalText.style.fontSize = "1.2em"; // Larger font for short notes
      } else {
        modalText.style.fontSize = "1em"; // Normal font size
      }

      if (note.imageUrl) {
        const modalImage = document.createElement("img");
        modalImage.src = note.imageUrl;
        modalImage.style.maxWidth = "100%";
        modalImage.style.borderRadius = "8px";
        modalImage.style.marginTop = "10px";
        modalContent.appendChild(modalImage);
      }

      // Display the modal
      modal.style.display = "block";
      modalContent.style.borderTopColor = randomColor;
    });

    iconContainer.appendChild(editIcon);
    iconContainer.appendChild(deleteIcon);
    iconContainer.appendChild(viewIcon);
    div.appendChild(iconContainer);

    notesList.appendChild(div);
  }

  // Function to generate a random color in hex format
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Function to delete a note from local storage
  function deleteNoteFromStorage(note) {
    const noteIndex = savedNotes.indexOf(note);
    if (noteIndex > -1) {
      savedNotes.splice(noteIndex, 1);
      localStorage.setItem("notes", JSON.stringify(savedNotes));
    }
  }

  // Search functionality for filtering notes
  searchInput.addEventListener("input", function () {
    const filter = searchInput.value.toLowerCase();
    const notes = notesList.getElementsByClassName("note-item");

    Array.from(notes).forEach((note) => {
      const noteText = note.getElementsByTagName("span")[0].textContent;
      const noteTitle = note.getElementsByTagName("h3")[0].textContent;
      if (
        noteText.toLowerCase().includes(filter) ||
        noteTitle.toLowerCase().includes(filter)
      ) {
        note.style.display = "";
      } else {
        note.style.display = "none";
      }
    });
  });

  // Toggle dark mode functionality
  toggleDarkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
  });

  // Apply saved dark mode setting
  const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
  if (savedDarkMode) {
    document.body.classList.add("dark-mode");
  }

  // character count for note input
  noteInput.addEventListener("input", function () {
    const charCount = noteInput.value.length;
    document.getElementById(
      "charCount"
    ).textContent = `characters ${charCount}`;
  });

  // word count for note input
  document.getElementById("noteInput").addEventListener("input", function () {
    const text = this.value.trim();
    const wordCount = text === "" ? 0 : text.split(/\s+/).length;
    document.getElementById(
      "wordCount"
    ).textContent = `Word Count ${wordCount}`;
  });

  // Close the modal when clicking on the close button
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    modalContent.querySelectorAll("img").forEach((img) => img.remove());
  });

  // Close the modal when clicking outside the modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      modalContent.querySelectorAll("img").forEach((img) => img.remove());
    }
  });

  // image preview

  document.getElementById("imagePreview").onclick = function () {
    const image = this;
    const icon1 = document.getElementById("uploadImageBtn");
    const icon2 = document.getElementById("saveBtn");

    if (image.style.maxWidth === "130px") {
      // Reset the image size
      image.style.maxWidth = "30px";
      image.style.boxShadow = "none";
      image.style.clipPath = "circle()";

      // Show the icon again
      icon1.style.display = "block";
      icon2.style.display = "block";
    } else {
      // Resize the image
      image.style.maxWidth = "130px";
      image.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.5)";
      image.style.clipPath = "none";

      // Hide the icons
      icon1.style.display = "none";
      icon2.style.display = "none";
    }
  };
});
