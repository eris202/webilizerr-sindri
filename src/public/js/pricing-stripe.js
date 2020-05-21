$(function() {
    var stripe = Stripe('pk_test_lhOKm1wn446p6upD0O9WfQqD')
    var elements = stripe.elements()
    var cardNumber = elements.create('card')
    cardNumber.mount('#input-card-number')

    $('#card-form').on('submit', function(e) {
        e.preventDefault()
        
        var name = $("#input-name").val()
        var country = $("#select-location").val()

        var extraData = {
            name: name,
            country: country
        }

        stripe.createToken(cardNumber, extraData).then(function(result) {
            if (result.error) {
              alert(result.error.message)
            } else {
              stripeTokenHandler(result.token)
            }
        })
    })

    function stripeTokenHandler(token) {
        var form = document.getElementById('card-form')
        var hiddenInput = document.createElement('input')
        hiddenInput.setAttribute('type', 'hidden')
        hiddenInput.setAttribute('name', 'stripeToken')
        hiddenInput.setAttribute('value', token.id)
        form.appendChild(hiddenInput)
        
        // console.log(token)

        form.submit()
    }
})