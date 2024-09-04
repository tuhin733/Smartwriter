//TODO <----------Quick guide for ConfirmationModal [How to use?]----------->
//? openConfirmModal({
//? title: "Delete Item",
//?   message: "Are you sure you want to delete this item permanently?",
//?  confirmText: "Yes, Delete",
//?  cancelText: "No, Keep It",
//?   confirmBtnColor: "#ff5733",  // Custom confirm button color
//?  confirmBtnTextColor: "#ffffff", // Custom confirm button text color
//?   cancelBtnColor: "#28a745",  // Custom cancel button color
//?  cancelBtnTextColor: "#ffffff", // Custom cancel button text color
//?   onConfirm: function() {
//* Your delete logic here
//?   }
//? });
//TODO <----------Quick guide for ConfirmationModal [How to use?]----------->

// Get modal elements
const ConfirmationModal = document.getElementById("ConfirmationModal");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeBtn = document.querySelector(".close-btn");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const modalMessage = document.getElementById("modalMessage");

// Function to open the modal with dynamic content, including optional button colors
export function openConfirmModal({
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmBtnColor = "transparent", // Default color for confirm button (Bootstrap's 'danger' color)
  confirmBtnTextColor = "#0D6EFD", // Default text color for confirm button
  cancelBtnColor = "transparent", // Default color for cancel button (Bootstrap's 'info' color)
  cancelBtnTextColor = "#DC3545", // Default text color for cancel button
  onConfirm,
}) {
  confirmModalTitle.textContent = title;
  modalMessage.textContent = message;
  confirmBtn.textContent = confirmText;
  cancelBtn.textContent = cancelText;

  // Apply the button colors
  confirmBtn.style.backgroundColor = confirmBtnColor;
  confirmBtn.style.color = confirmBtnTextColor;
  cancelBtn.style.backgroundColor = cancelBtnColor;
  cancelBtn.style.color = cancelBtnTextColor;

  ConfirmationModal.style.display = "block";

  // Assign the onConfirm function to the confirm button
  confirmBtn.onclick = function () {
    onConfirm();
    closeConfirmModal(); // Close the modal after the action
  };
}

// Function to close the modal
export function closeConfirmModal() {
  ConfirmationModal.style.display = "none";
}

// Close modal when clicking the close button
closeBtn.onclick = function () {
  closeConfirmModal();
};

// Close modal when clicking the cancel button
cancelBtn.onclick = function () {
  closeConfirmModal();
};

// Close modal when clicking outside the modal content
window.onclick = function (event) {
  if (event.target === ConfirmationModal) {
    closeConfirmModal();
  }
};
