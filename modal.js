const modalContainer = document.querySelector(".modal-container");

export function openModal() {
  modalContainer.classList.add("active");
}

export function closeModal() {
  function toggleModal() {
    modalContainer.classList.toggle("active");

    setTimeout(() => {
      document.querySelector("#edit-form").reset();
    }, 500);
  }

  function clickOutside(ev) {
    if (ev.target === this) {
      toggleModal();
    }
  }

  modalContainer.addEventListener("click", clickOutside);

  document
    .querySelector(".modal_close-btn")
    .addEventListener("click", toggleModal);

  document
    .querySelector("#cancel-edit-btn")
    .addEventListener("click", toggleModal);
}
