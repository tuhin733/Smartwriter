import { showToast } from "./utils/toast.js";
import {
  openConfirmModal,
  closeConfirmModal,
} from "./utils/confirmationModal.js";

document.addEventListener("DOMContentLoaded", function () {
  // <------------------------------ ELEMENTS START ------------------------------->

  // <---------- Notes related elements ----------->
  const noteInput = document.getElementById("noteInput"); // Input field for note text
  const noteTitle = document.getElementById("noteTitle"); // Input field for note title
  const saveBtn = document.getElementById("saveBtn"); // Button to save the note
  const notesList = document.getElementById("notesList"); // Container for displaying notes
  const searchInput = document.getElementById("searchInput"); // Input field for search
  const toggleDarkMode = document.getElementById("toggleDarkMode"); // Button to toggle dark mode

  // <---------- Modal related elements ----------->
  const modal = document.getElementById("noteModal"); // Modal for viewing note details
  const modalTitle = document.getElementById("modalTitle"); // Title element in the modal
  const modalText = document.getElementById("modalText"); // Text element in the modal
  const closeModal = document.querySelector(".modal .close"); // Button to close the modal
  const modalContent = document.querySelector(".modal-content"); // Modal content element
  const showDeletedNotesBtn = document.getElementById("showDeletedNotesBtn"); //Deleted notes modal
  const voiceNoteModal = document.getElementById("voiceNoteModal"); // Voice note modal

  // <---------- Image related elements ----------->
  const uploadImageBtn = document.getElementById("uploadImageBtn"); // Button to trigger image upload
  const imageInput = document.getElementById("imageInput"); // Hidden file input
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  ); // Container for image preview

  // <---------- Imagepreview related elements ----------->
  const imagePreview = document.getElementById("imagePreview"); // Image element for preview
  let currentImageUrl = null; // Store current image URL

  // <---------- Voice notes related elements ----------->
  const startVoiceNoteBtn = document.getElementById("startVoiceNoteBtn"); // Get the start recording button
  const saveVoiceNoteBtn = document.getElementById("saveVoiceNoteBtn"); // Get the save voice note button
  const voiceNoteTitleInput = document.getElementById("voiceNoteTitle"); // Get the input for the title
  const recordedVoiceNote = document.getElementById("recordedVoiceNote"); // Get the div to display the recorded voice note
  const voiceNoteList = document.getElementById("voiceNoteList"); // Get the list for saved voice notes

  // <---------- Buttons related elements ----------->
  const openModalBtn = document.getElementById("openModalBtn");
  const savePasswordBtn = document.getElementById("savePasswordBtn");
  const verifyPasswordBtn = document.getElementById("verifyPasswordBtn");
  const resetPasswordBtn = document.getElementById("resetPasswordBtn");

  // <---------- delete all and recover all related elements ----------->
  const recoverAllBtn = document.getElementById("recoverAllBtn");
  const deleteAllBtn = document.getElementById("deleteAllBtn");

  // <---------- Voice-to-Text Integration related elements ----------->
  const startRecording = document.getElementById("start-recording");

  // <---------- Get the <span> elements that close the modals ----------->
  const closeModalBtn1 = document.getElementsByClassName(
    "close-voice-note-modal"
  )[0];
  const closeModalBtn2 = document.getElementsByClassName(
    "close-password-setup-modal"
  )[0];
  const closeModalBtn3 = document.getElementsByClassName(
    "close close-password-verfy-modal"
  )[0];

  // <------------------------------ ELEMENTS END ------------------------------->

  // <---------- Load saved notes from local storage ----------->
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

  // <---------- Distplay saved notes on the page ----------->
  savedNotes.forEach((note, index) => addNoteToList(note, index));

  // <---------- Save notes to lacal storage and display it ----------->
  saveBtn.addEventListener("click", function () {
    const noteText = noteInput.value.trim();
    const noteTitleText = noteTitle.value.trim();

    // <---------- Check if both title and text are not empty ----------->
    if (noteTitleText === "" && noteText === "") {
      showToast("Title and text cannot be empty.", "#212529", "#ffc107");
      return;
    }

    // <---------- Check if either title or text is empty ----------->

    if (noteTitleText === "") {
      showToast("Title cannot be empty.", "#212529", "#ffc107");
      return;
    }

    if (noteText === "") {
      showToast("Text cannot be empty.", "#212529", "#ffc107");
      return;
    }

    // <---------- Additional validation ----------->
    if (noteTitleText.length > 60) {
      showToast("Title cannot exceed 50 characters.", "#ffffff", "#dc3545");
      return;
    }

    if (noteText.length > 500) {
      showToast("Note cannot exceed 500 characters.", "#ffffff", "#dc3545");
      return;
    }

    const isDuplicate = savedNotes.some(
      (note) => note.title.toLowerCase() === noteTitleText.toLowerCase()
    );

    if (isDuplicate) {
      showToast(
        "Note title already exists. Please use a different title.",
        "#212529",
        "#ffc107"
      );
      return;
    }

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
  });

  // <---------- Handle image upload ----------->
  uploadImageBtn.addEventListener("click", function () {
    imageInput.click();
  });

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (file) {
      // Validate file type
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        showToast("Please upload a valid image file.", "#ffffff", "#dc3545");
        imageInput.value = ""; // Reset file input
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showToast("File size exceeds 5MB.", "#ffffff", "#dc3545");
        fileInput.value = ""; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        currentImageUrl = e.target.result; // Save the image data URL to be used later

        // Set the image preview source and display it
        imagePreview.src = currentImageUrl;
        imagePreviewContainer.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // <---------- Function to handle Enter and Shift+Enter key events ----------->
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

  // <---------- Attach the key press enent listener to both noteInput and noteTitle ----------->
  noteInput.addEventListener("keydown", handleKeyPress);
  noteTitle.addEventListener("keydown", handleKeyPress);

  // <---------- Function to add a note to the list ----------->
  function addNoteToList(note, index) {
    const div = document.createElement("div");
    div.className = "note-item";

    // <---------- Generate a random border color for the note ----------->
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

    // <---------- Edit icon with functionality to toggle between edit and save ----------->
    const editIcon = document.createElement("i");
    editIcon.className = "fas fa-edit";
    editIcon.title = "Edit";

    editIcon.addEventListener("click", function () {
      if (noteText.contentEditable === "false") {
        noteText.contentEditable = true;
        noteTitle.contentEditable = true;
        noteText.classList.add("editable"); // Add class for styling
        noteTitle.classList.add("editable"); // Add class for styling
        noteText.focus();
        editIcon.className = "fas fa-save";
        editIcon.title = "Save";
      } else {
        saveNote();
        editIcon.className = "fas fa-edit";
        editIcon.title = "Edit";
      }
    });

    // <---------- Function to save the note ----------->
    function saveNote() {
      noteText.contentEditable = false;
      noteTitle.contentEditable = false;
      noteText.classList.remove("editable"); // Remove class when done editing
      noteTitle.classList.remove("editable"); // Remove class when done editing
      savedNotes[index] = {
        title: noteTitle.textContent.trim(),
        text: noteText.textContent.trim(),
        imageUrl: note.imageUrl, // Save the image URL with the note
      };
      localStorage.setItem("notes", JSON.stringify(savedNotes));
    }

    // <---------- Add event listeners to handle Enter key press ----------->
    function editToSave(event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default action (e.g., inserting a new line)
        saveNote();
        editIcon.className = "fas fa-edit";
        editIcon.title = "Edit";
      }
    }

    // <---------- Add event listeners to handle Enter key press ----------->
    noteText.addEventListener("keydown", editToSave);
    noteTitle.addEventListener("keydown", editToSave);

    // <---------- Delete icon with functionality to remove the note ----------->
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash";
    deleteIcon.title = "Delete";
    deleteIcon.addEventListener("click", function () {
      openConfirmModal({
        title: "Move to Trash",
        message:
          "Are you sure you want to move this item to the trash bin? You can restore it later if needed.",
        confirmText: "Delete",
        cancelText: "cancel",
        onConfirm: function () {
          notesList.removeChild(div);
          deleteNoteFromStorage(note);
        },
      });
    });

    // <---------- View icon to display the note in a modal ----------->
    const viewIcon = document.createElement("i");
    viewIcon.className = "fas fa-eye";
    viewIcon.title = "View";
    viewIcon.addEventListener("click", function () {
      // Update modal title and content
      modalTitle.textContent = note.title;
      modalText.textContent = note.text;

      // <---------- Adjust modal content based on the length of the note text ----------->
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

      // <---------- Display the modal ----------->
      modal.style.display = "block";
      modalContent.style.borderTopColor = randomColor;
    });

    iconContainer.appendChild(editIcon);
    iconContainer.appendChild(deleteIcon);
    iconContainer.appendChild(viewIcon);
    div.appendChild(iconContainer);

    notesList.appendChild(div);
  }

  // <---------- Function to generate a random color in hex format  ----------->
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // <---------- Search functionality for filtering notes ----------->
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

  // <---------- Toggle dark mode functionality ----------->
  const modeIcon = document.getElementById("modeIcon");

  toggleDarkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);

    // Update the icon based on the current mode
    if (isDarkMode) {
      modeIcon.classList.remove("fa-moon");
      modeIcon.classList.add("fa-sun");
    } else {
      modeIcon.classList.remove("fa-sun");
      modeIcon.classList.add("fa-moon");
    }
  });

  // <---------- Apply saved dark mode setting ----------->
  const savedDarkMode = localStorage.getItem("darkMode");

  // If no setting is saved or dark mode was previously enabled, apply dark mode
  if (savedDarkMode === null || JSON.parse(savedDarkMode)) {
    document.body.classList.add("dark-mode");
    modeIcon.classList.remove("fa-moon");
    modeIcon.classList.add("fa-sun");
  } else {
    document.body.classList.remove("dark-mode");
    modeIcon.classList.remove("fa-sun");
    modeIcon.classList.add("fa-moon");
  }

  // <---------- Character count for note input ----------->
  noteInput.addEventListener("input", function () {
    const charCount = noteInput.value.length;
    document.getElementById(
      "charCount"
    ).textContent = `characters ${charCount}`;
  });

  // <---------- Word count for note input ----------->
  noteInput.addEventListener("input", function () {
    const text = this.value.trim();
    const wordCount = text === "" ? 0 : text.split(/\s+/).length;
    document.getElementById(
      "wordCount"
    ).textContent = `Word Count ${wordCount}`;
  });

  // <---------- Close the modal when clicking on the close button ----------->
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    modalContent.querySelectorAll("img").forEach((img) => img.remove());
  });

  // <---------- Close the modal when clicking outside the modal content ----------->
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      modalContent.querySelectorAll("img").forEach((img) => img.remove());
    }
  });

  // <---------- Image preview ----------->
  imagePreview.onclick = function () {
    const image = this;
    const icon1 = document.getElementById("uploadImageBtn");
    const icon2 = document.getElementById("saveBtn");
    const icon3 = document.getElementById("start-recording");

    if (image.style.maxWidth === "130px") {
      // Reset the image size
      image.style.maxWidth = "30px";
      image.style.boxShadow = "none";
      image.style.clipPath = "circle()";

      // Show the icon again
      icon1.style.display = "block";
      icon2.style.display = "block";
      icon3.style.display = "block";
    } else {
      // Resize the image
      image.style.maxWidth = "130px";
      image.style.boxShadow = "rgba(0, 0, 0, 0.5) 0 0 15px";
      image.style.clipPath = "none";

      // Hide the icons
      icon1.style.display = "none";
      icon2.style.display = "none";
      icon3.style.display = "none";
    }
  };
  // <---------- variables for text-to-speach ----------->
  let recognition;
  let isRecording = false; // Track the recording state

  const microphoneShowHideIcon = startRecording.querySelector(".fa-microphone");
  const showWaves = document.getElementById("showWaveContainer");

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      noteInput.value += transcript + " ";
    };

    recognition.onstart = function () {
      isRecording = true;
      startRecording.classList.add("recording");

      // Hide microphone icon and show wave animation
      microphoneShowHideIcon.style.display = "none";
      showWaves.style.display = "flex";
    };

    recognition.onend = function () {
      isRecording = false;
      startRecording.classList.remove("recording");

      // Show microphone icon and hide wave animation
      microphoneShowHideIcon.style.display = "block";
      showWaves.style.display = "none";
    };

    startRecording.addEventListener("click", function () {
      if (recognition) {
        if (isRecording) {
          recognition.stop(); // Stop recording
        } else {
          recognition.start(); // Start recording
        }
      }
    });
  } else {
    showToast(
      "Your browser doesn't support speech recognition.",
      "#ffffff",
      "#dc3545"
    );
  }

  // <---------- Function to delete note from local storage ----------->
  function deleteNoteFromStorage(note) {
    const noteIndex = savedNotes.indexOf(note);
    if (noteIndex > -1) {
      const deletedNotes =
        JSON.parse(localStorage.getItem("deletedNotes")) || [];

      // Move the note from savedNotes to deletedNotes
      deletedNotes.push(savedNotes.splice(noteIndex, 1)[0]);

      // Update localStorage
      localStorage.setItem("notes", JSON.stringify(savedNotes));
      localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));

      // Find the note element by its data-id attribute and remove it
      const noteElement = document.querySelector(
        `.note-item[data-id="${note.id}"]`
      );
      if (noteElement) {
        notesList.removeChild(noteElement);
      }
    }
  }

  // <---------- Function to show deleted notes in a modal ----------->
  function showDeletedNotes() {
    const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || [];
    const deletedNotesList = document.getElementById("deletedNotesList"); // Container for deleted notes in modal

    // Clear previous deleted notes
    deletedNotesList.innerHTML = "";

    deletedNotes.forEach((note, index) => {
      const div = document.createElement("div");
      div.className = "deleted-note-item";

      const noteTitle = document.createElement("h4");
      noteTitle.className = "title";
      noteTitle.textContent = note.title;

      const noteText = document.createElement("p");
      noteText.textContent = note.text;

      div.appendChild(noteTitle);
      div.appendChild(noteText);

      // Create a container div for the icons
      const iconsCont = document.createElement("div");
      iconsCont.className = "delete-recover-icons-container"; // Add a class for styling

      const recoverIcon = document.createElement("i");
      recoverIcon.className = "fas fa-undo";
      recoverIcon.title = "Recover";
      recoverIcon.addEventListener("click", function () {
        openConfirmModal({
          title: "Confirm Recover",
          message:
            "Do you want to recover deleted notes? This will restore everything to its original state.",
          confirmText: "Recover",
          cancelText: "Cancel",
          onConfirm: function () {
            recoverNoteFromDeleted(index);
          },
        });
      });

      const permanentDeleteIcon = document.createElement("i");
      permanentDeleteIcon.className = "fas fa-trash-alt";
      permanentDeleteIcon.title = "Permanent Delete";
      permanentDeleteIcon.addEventListener("click", function () {
        openConfirmModal({
          title: "Permanently Delete",
          message:
            "Are you sure you want to permanently delete this note? This action cannot be undone.",
          confirmText: "Delete",
          cancelText: "Cancel",
          onConfirm: function () {
            permanentDeleteFromStorage(index);
          },
        });
      });

      // Append icons to the icon container
      iconsCont.appendChild(recoverIcon);
      iconsCont.appendChild(permanentDeleteIcon);

      // Append the icon container to the main div
      div.appendChild(iconsCont);

      deletedNotesList.appendChild(div);
    });

    // Display the modal
    document.getElementById("deletedNotesModal").style.display = "block";
  }

  // <---------- Function to recover a note form deleted notes ----------->
  function recoverNoteFromDeleted(index) {
    const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || [];
    const recoveredNote = deletedNotes.splice(index, 1)[0];
    savedNotes.push(recoveredNote);

    // Save the updated notes and deleted notes arrays to local storage
    localStorage.setItem("notes", JSON.stringify(savedNotes));
    localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));

    // Refresh the deleted notes list in the modal
    showDeletedNotes();

    // Re-render the main notes list
    renderNotes(); // Call the renderNotes function to update the main notes list
  }

  // <---------- Fnction to permanently delete a note form deleted notes ----------->
  function permanentDeleteFromStorage(index) {
    const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || [];
    deletedNotes.splice(index, 1);
    localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));
    showDeletedNotes(); // Refresh the deleted notes list in the modal
  }

  // <---------- Function to render notes to the main list ----------->
  function renderNotes() {
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = ""; // Clear the current notes list

    savedNotes.forEach((note, index) => {
      const div = document.createElement("div");
      div.className = "note-item";

      const noteTitle = document.createElement("h4");
      noteTitle.textContent = note.title;

      const noteText = document.createElement("p");
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

      // <---------- Add edit, delete, and view icons (reuse existing code for this) ----------->
      const iconContainer = document.createElement("div");
      iconContainer.className = "icon-btn";

      const editIcon = document.createElement("i");
      editIcon.className = "fas fa-edit";
      editIcon.title = "Edit";

      // <---------- Edit icon functionality (reuse existing code for this) ----------->
      editIcon.addEventListener("click", function () {
        if (noteText.contentEditable === "false") {
          noteText.contentEditable = true;
          noteTitle.contentEditable = true;
          noteText.classList.add("editable"); // Add class for styling
          noteTitle.classList.add("editable"); // Add class for styling
          noteText.focus();
          editIcon.className = "fas fa-save";
          editIcon.title = "Save";
        } else {
          saveNote();
          editIcon.className = "fas fa-edit";
          editIcon.title = "Edit";
        }
      });

      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash";
      deleteIcon.title = "Delete";

      // <---------- Delete icon functionality (reuse existing code for this) ----------->
      deleteIcon.addEventListener("click", function () {
        openConfirmModal({
          title: "Move to Trash",
          message:
            "Are you sure you want to move this item to the trash bin? You can restore it later if needed.",
          confirmText: "Delete",
          cancelText: "cancel",
          onConfirm: function () {
            notesList.removeChild(div);
            deleteNoteFromStorage(note);
          },
        });
      });

      const viewIcon = document.createElement("i");
      viewIcon.className = "fas fa-eye";
      viewIcon.title = "View";

      // <---------- View icon functionality (reuse existing code for this) ----------->
      viewIcon.addEventListener("click", function () {
        // Update modal title and content
        modalTitle.textContent = note.title;
        modalText.textContent = note.text;

        // <---------- Adjust modal content based on the length of the note text ----------->
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
    });
  }

  // <---------- Eventlister to show deleted notes when the button in clicked ----------->
  showDeletedNotesBtn.addEventListener("click", showDeletedNotes);

  // <---------- Close the deleted notes moadal when clicking on the close button ----------->
  const closeDeletedNotesModal = document.querySelector(
    "#deletedNotesModal .close"
  );
  closeDeletedNotesModal.addEventListener("click", function () {
    document.getElementById("deletedNotesModal").style.display = "none";
  });

  // <---------- Close the deleted notes modal when clicking outside the modal content ----------->
  window.addEventListener("click", function (event) {
    if (event.target === document.getElementById("deletedNotesModal")) {
      document.getElementById("deletedNotesModal").style.display = "none";
    }
  });

  // <---------- Function to recover all deleted notes ----------->
  function recoverAllNotes() {
    const deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || [];
    savedNotes.push(...deletedNotes);

    // Save updated notes and clear deleted notes from local storage
    localStorage.setItem("notes", JSON.stringify(savedNotes));
    localStorage.setItem("deletedNotes", JSON.stringify([]));

    // Re-render the notes list and update the deleted notes modal
    renderNotes();
    showDeletedNotes();
  }

  // <---------- Function to delete all notes permanently ----------->
  function deleteAllNotesPermanently() {
    localStorage.setItem("deletedNotes", JSON.stringify([])); // Clear deleted notes

    // Clear the notes list in the modal
    const deletedNotesList = document.getElementById("deletedNotesList");
    deletedNotesList.innerHTML = "";

    // Optionally, update any other UI elements
  }

  // <---------- Add event listerners for the permanently delte all and recover all ----------->
  recoverAllBtn.addEventListener("click", function () {
    openConfirmModal({
      title: "Confirm Recovery",
      message:
        "Do you want to recover all deleted notes? This will restore everything to its original state.",
      confirmText: "Recover All",
      cancelText: "Cancel",
      onConfirm: function () {
        recoverAllNotes();
      },
    });
  });

  deleteAllBtn.addEventListener("click", function () {
    openConfirmModal({
      title: "Delete all",
      message:
        "Are you sure you want to delete all note? This action cannot be undone.",
      confirmText: "Delete All",
      cancelText: "Cancel",
      onConfirm: function () {
        deleteAllNotesPermanently();
      },
    });
  });

  // <---------- variables for voice recorder----------->
  let mediaRecorder;
  let voiceChunks = [];
  let currentVoiceBlob;

  // <---------- when the user clicks the button, open the modal ----------->
  openModalBtn.addEventListener("click", () => {
    const passwordKey = "voiceNotePassword";
    const savedPassword = localStorage.getItem(passwordKey);

    const passwordSetupModal = document.getElementById("passwordSetupModal");
    const passwordVerificationModal = document.getElementById(
      "passwordVerificationModal"
    );

    if (!savedPassword) {
      passwordSetupModal.style.display = "block";
    } else {
      passwordVerificationModal.style.display = "block";
    }
  });

  // <---------- save password ----------->
  savePasswordBtn.addEventListener("click", () => {
    const setupPasswordInput = document.getElementById("setupPassword");
    const setupPassword = setupPasswordInput.value.trim(); // Use trim() to remove leading and trailing spaces

    // Validation
    const successText = document.getElementById("successText");
    const errorText = document.getElementById("errorText");
    const minPasswordLength = 4; // Example minimum length requirement

    if (setupPassword === "") {
      errorText.textContent = "Password cannot be empty.";
      errorText.style.color = "#e74c3c"; // Set color for error messages
      errorText.style.display = "block";
      setTimeout(() => {
        errorText.style.display = "none";
      }, 3000);
      return; // Exit the function if validation fails
    }

    if (setupPassword.length < minPasswordLength) {
      errorText.textContent = "Password must be at least 6 characters long.";
      errorText.style.color = "#e74c3c"; // Set color for error messages
      errorText.style.display = "block";
      setTimeout(() => {
        errorText.style.display = "none";
      }, 3000);
      return; // Exit the function if validation fails
    }

    // If validation passes
    localStorage.setItem("voiceNotePassword", setupPassword);

    // Display success text
    successText.style.display = "block";

    // Clear the input field
    setupPasswordInput.value = "";

    setTimeout(() => {
      // Hide the success text after showing it for a while
      successText.style.display = "none";

      document.getElementById("passwordSetupModal").style.display = "none";
      document.getElementById("voiceNoteModal").style.display = "flex";
    }, 3000); // Wait for toast duration before redirecting
  });

  // <---------- Verify Password ----------->
  verifyPasswordBtn.addEventListener("click", () => {
    const verifyPasswordElement = document.getElementById("verifyPassword");
    const verifyPassword = verifyPasswordElement.value;
    const savedPassword = localStorage.getItem("voiceNotePassword");
    const passwordError = document.getElementById("passwordError");

    if (verifyPassword === savedPassword) {
      document.getElementById("passwordVerificationModal").style.display =
        "none";
      document.getElementById("voiceNoteModal").style.display = "flex";
      // Clear the textarea content
      verifyPasswordElement.value = "";
    } else {
      passwordError.style.display = "block";
      setTimeout(() => {
        passwordError.style.display = "none";
      }, 3000);
      // Clear the textarea content
      verifyPasswordElement.value = "";
    }
  });

  // <---------- Reset button function ----------->
  resetPasswordBtn.addEventListener("click", () => {
    openConfirmModal({
      title: "Reset Password",
      message:
        "Are you sure you want to reset the password and delete all voice notes? This action cannot be undone.",
      confirmText: "Reset",
      cancelText: "Cancel",
      onConfirm: () => {
        const passwordKey = "voiceNotePassword";
        const voiceNotesKey = "voiceNotes";

        // Remove saved password and voice notes
        localStorage.removeItem(passwordKey);
        localStorage.removeItem(voiceNotesKey);

        // Close all modals
        document.querySelectorAll(".password-modal").forEach((modal) => {
          modal.style.display = "none";
        });

        // Reload the page
        this.location.reload();
      },
    });
  });

  // <---------- when the user ckicks on <span> (x), close the modal ----------->
  closeModalBtn1.onclick = function () {
    voiceNoteModal.style.display = "none";
    resetVoiceNote();
  };
  closeModalBtn2.onclick = function () {
    document.getElementById("passwordSetupModal").style.display = "none";
  };
  closeModalBtn3.onclick = function () {
    document.getElementById("passwordVerificationModal").style.display = "none";
  };

  // <---------- when the user clicks anywhere outside of the modal close it ----------->
  window.onclick = function (event) {
    if (event.target == voiceNoteModal) {
      voiceNoteModal.style.display = "none";
      resetVoiceNote();
    }
  };

  // <---------- Function to start recording a voice note ----------->
  const micIcon = document.getElementById("micIcon");
  const waveContainer = document.getElementById("waveContainer");

  function startVoiceNoteRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        // Update button for recording
        startVoiceNoteBtn.classList.add("recording");
        micIcon.style.display = "none";
        waveContainer.style.display = "flex";

        mediaRecorder.ondataavailable = function (event) {
          voiceChunks.push(event.data);
        };

        mediaRecorder.onstop = function () {
          currentVoiceBlob = new Blob(voiceChunks, { type: "audio/mp3" });
          voiceChunks = [];

          const voiceUrl = URL.createObjectURL(currentVoiceBlob);
          recordedVoiceNote.innerHTML = ""; // Clear previous content

          // Create a container for the audio controls
          const audioContainer = document.createElement("div");
          audioContainer.className = "audio-container";
          recordedVoiceNote.appendChild(audioContainer);

          // Play/Pause button styled like WhatsApp
          const playPauseBtn = document.createElement("div");
          playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
          playPauseBtn.className = "play-pause-btn";
          audioContainer.appendChild(playPauseBtn);

          // Create a container for the waveform
          const waveformContainer = document.createElement("div");
          waveformContainer.id = "waveform";
          audioContainer.appendChild(waveformContainer);

          // Current time display styled like WhatsApp
          const currentTimeDisplay = document.createElement("span");
          currentTimeDisplay.className = "current-time-display";
          audioContainer.appendChild(currentTimeDisplay);

          // Initialize Wavesurfer
          const wavesurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: "#d3d3d3",
            progressColor: "#34b7f1",
            cursorWidth: 0,
            height: 30,
            barWidth: 4,
            barRadius: 3,
          });

          wavesurfer.load(voiceUrl);

          // Handle Play/Pause toggle with icon change
          playPauseBtn.addEventListener("click", () => {
            if (wavesurfer.isPlaying()) {
              wavesurfer.pause();
              playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
              wavesurfer.play();
              playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
          });

          // Update the current time display
          wavesurfer.on("audioprocess", () => {
            const currentTime = wavesurfer.getCurrentTime();
            currentTimeDisplay.innerHTML = `${Math.floor(currentTime)}s`;
          });

          // Reset the play/pause button when the audio finishes playing
          wavesurfer.on("finish", () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
          });

          saveVoiceNoteBtn.disabled = false;
        };
      })
      .catch(function (err) {
        showToast("Could not start recording: ", "#ffffff", "#dc3545");
      });
  }

  function stopVoiceNoteRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }

    // Update button to show icon and hide animation
    startVoiceNoteBtn.classList.remove("recording");
    micIcon.style.display = "block";
    waveContainer.style.display = "none";
  }
  // <---------- Toggle recording state when the button is clicked ----------->
  startVoiceNoteBtn.addEventListener("click", function () {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      stopVoiceNoteRecording();
    } else {
      startVoiceNoteRecording();
    }
  });

  // <---------- Function to convert blod to base64 ----------->
  function blobToBase64(blob, callback) {
    const reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(blob);
  }

  // <---------- Fnction to save the voice note with a title ----------->
  saveVoiceNoteBtn.addEventListener("click", function () {
    const title = voiceNoteTitleInput.value.trim();
    if (!title || !currentVoiceBlob) {
      showToast(
        "Please enter a title and record a voice note.",
        "#ffffff",
        "#dc3545"
      );
      return;
    }

    // <---------- Convert the Blob to base64 and save it ----------->
    blobToBase64(currentVoiceBlob, function (base64Data) {
      const voiceNotes = JSON.parse(localStorage.getItem("voiceNotes")) || [];
      voiceNotes.push({ title, base64: base64Data });
      localStorage.setItem("voiceNotes", JSON.stringify(voiceNotes));

      addVoiceNoteToList(title, base64Data);
      resetVoiceNote();
    });
  });

  // <---------- Function to add voice note to the list ----------->
  function addVoiceNoteToList(title, base64Data) {
    const listItem = document.createElement("div");
    listItem.classList.add("voice-note-item");

    // Create a container for the audio controls
    const audioContainer = document.createElement("div");
    audioContainer.className = "saved-audio-container";
    listItem.appendChild(audioContainer);

    // Play/Pause button styled like WhatsApp
    const playPauseBtn = document.createElement("div");
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    playPauseBtn.className = "play-pause-btn";
    audioContainer.appendChild(playPauseBtn);

    // Create a container for the waveform
    const waveformContainer = document.createElement("div");
    waveformContainer.className = "waveform";
    audioContainer.appendChild(waveformContainer);

    // Current time display styled like WhatsApp
    const currentTimeDisplay = document.createElement("span");
    currentTimeDisplay.className = "current-time-display";
    audioContainer.appendChild(currentTimeDisplay);

    // Initialize Wavesurfer
    const wavesurfer = WaveSurfer.create({
      container: waveformContainer,
      waveColor: "#d3d3d3",
      progressColor: "#34b7f1",
      cursorWidth: 0,
      height: 30,
      barWidth: 4,
      barRadius: 3,
    });

    wavesurfer.load(base64Data);

    // Handle Play/Pause toggle with icon change
    playPauseBtn.addEventListener("click", () => {
      if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      } else {
        wavesurfer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      }
    });

    // Update the current time display
    wavesurfer.on("audioprocess", () => {
      const currentTime = wavesurfer.getCurrentTime();
      currentTimeDisplay.innerHTML = `${Math.floor(currentTime)}s`;
    });

    // Reset the play/pause button when the audio finishes playing
    wavesurfer.on("finish", () => {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    const titleSpan = document.createElement("span");
    titleSpan.classList.add("title");
    titleSpan.textContent = title;
    listItem.appendChild(titleSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    deleteBtn.addEventListener("click", function () {
      openConfirmModal({
        title: "Confirm Delete",
        message:
          "Are you sure you want to delete this note? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: function () {
          voiceNoteList.removeChild(listItem);
          const voiceNotes =
            JSON.parse(localStorage.getItem("voiceNotes")) || [];
          const updatedNotes = voiceNotes.filter((n) => n.title !== title);
          localStorage.setItem("voiceNotes", JSON.stringify(updatedNotes));
        },
      });
    });

    listItem.appendChild(deleteBtn);
    voiceNoteList.appendChild(listItem);
  }

  // <---------- Function to load and display saved voice notes ----------->
  function loadVoiceNotes() {
    const voiceNotes = JSON.parse(localStorage.getItem("voiceNotes")) || [];
    voiceNoteList.innerHTML = ""; // Clear the list

    voiceNotes.forEach((note) => {
      addVoiceNoteToList(note.title, note.base64);
    });
  }

  // <---------- Function to reset the voice note recording UI ----------->
  function resetVoiceNote() {
    voiceNoteTitleInput.value = "";
    recordedVoiceNote.innerHTML = "";
    saveVoiceNoteBtn.disabled = true;
    currentVoiceBlob = null;
  }

  // <---------- Load voice notes when the page is loaded ----------->
  window.onload = function () {
    loadVoiceNotes();
  };

  // <---------- voice note search functionality ----------->
  document
    .getElementById("searchVoiceNote")
    .addEventListener("input", function () {
      const filter = this.value.toLowerCase();
      const notesList = document.getElementById("voiceNoteList");
      const notes = notesList.getElementsByClassName("voice-note-item");

      Array.from(notes).forEach((note) => {
        const title = note
          .getElementsByClassName("title")[0]
          .textContent.toLowerCase();
        if (title.includes(filter)) {
          note.style.display = "";
        } else {
          note.style.display = "none";
        }
      });
    });

  // <---------- Deleted note search functionality ----------->
  document
    .getElementById("searchDeteledNote")
    .addEventListener("input", function () {
      const filter = this.value.toLowerCase();
      const notesList = document.getElementById("deletedNotesList");
      const notes = notesList.getElementsByClassName("deleted-note-item");

      Array.from(notes).forEach((note) => {
        const title = note
          .getElementsByClassName("title")[0]
          .textContent.toLowerCase();
        if (title.includes(filter)) {
          note.style.display = "";
        } else {
          note.style.display = "none";
        }
      });
    });
});
