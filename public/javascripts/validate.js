const form = document.querySelector('.restaurant-form')
const submitButton = document.querySelector('.submit-btn')

submitButton.addEventListener('click', function onSubmitBtnClick (event) {
  form.classList.add('was-validated')
})

form.addEventListener('submit', function onFormSubmit (event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
})
