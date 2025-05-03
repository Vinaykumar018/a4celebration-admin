document.addEventListener("DOMContentLoaded", function () {
  function showToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.classList.remove("hide", "fade");
      toast.classList.add("opacity-100", "translate-x-0");
      setTimeout(() => {
        toast.classList.add("hide", "fade");
        toast.classList.remove("opacity-100", "translate-x-0");
      }, 3000);
    }
  }

  // Buttons for showing toasts
  const toastButtons = {
    liveToastBtn6: "liveToast6",
    liveToastBtn5: "liveToast5",
    liveToastBtn4: "liveToast4",
    liveToastBtn: "liveToast",
    liveToastBtn1: "liveToast1",
    liveToastBtn2: "liveToast2",
    liveToastBtn3: "liveToast3",
  };

  Object.entries(toastButtons).forEach(([btnId, toastId]) => {
    document
      .getElementById(btnId)
      ?.addEventListener("click", () => showToast(toastId));
  });

  // Close button functionality
  document.querySelectorAll(".btn-close").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".toast")?.classList.add("hide", "fade");
    });
  });
});
