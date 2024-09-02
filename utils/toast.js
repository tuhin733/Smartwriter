// toast.js
export function showToast(
  message,
  color = "#ffffff",
  backgroundColor = "#333333"
) {
  // Create toast container
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = backgroundColor;
  toast.style.color = color;
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  toast.style.zIndex = "1000";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.5s ease-in-out";

  // Append to body
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    // Remove toast after transition
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}
