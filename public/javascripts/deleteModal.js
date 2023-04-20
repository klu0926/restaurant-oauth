function deleteModalSetup() {

  const deleteButtons = document.querySelectorAll('.deleteButton')

  // modal
  const modalRestaurantName = document.querySelector('#modal-restaurant-name')
  const modalDeleteForm = document.querySelector('#modal-delete-form')

  deleteButtons.forEach(button => {
    button.addEventListener('click', event => {
      const { id, name } = event.target.dataset
      modalRestaurantName.textContent = name
      modalDeleteForm.setAttribute('action', `/restaurants/${id}?_method=DELETE`)
    })
  })
}

// wait for DOM to load
document.addEventListener('DOMContentLoaded', deleteModalSetup)