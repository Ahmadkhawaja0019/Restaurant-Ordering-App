import {menuArray} from '/data.js'

const menuRadios = document.getElementById("menu-radios")
const paymentForm = document.getElementById("payment-form")

let orderItemCount = 0
let totalPrice = 0
let orderArray = []

document.addEventListener('click', function(e){
    if (e.target.dataset.order) {
        handleOrder(e.target.dataset.order);
    } else if (e.target.dataset.remove) {
        handleRemove(e.target.dataset.remove);
    }
})

paymentForm.addEventListener('submit', function(e){
    e.preventDefault()

    const formData = new FormData(paymentForm)
    const fullName = formData.get('fullName')
    const cardNumber = formData.get('cardNumber')
    const cvv = formData.get('cvv')

    if (fullName && cardNumber && cvv) {
        document.getElementById("payment-modal").style.display = 'none'

        document.getElementById("order-section").innerHTML = `
                                                                <div class = "thanks-message">
                                                                    <h2>Thanks, ${fullName}! Your order is on its way </h2>
                                                                </div>
                                                            `
        document.getElementById("payment-form").reset();

        orderArray = []
        orderItemCount = 0
        totalPrice = 0
    }
}) 

function handleOrder(orderId) {
    console.log(orderId)
    const targetOrderItem = menuArray.find(function(item){
        return item.id === Number(orderId)
    })
    if (targetOrderItem) {
        orderArray.push(targetOrderItem);
        orderItemCount++;
        totalPrice += targetOrderItem.price
        renderOrder();
    }
}

function handleRemove(index) {
    if (orderArray[index]) {
        totalPrice -= orderArray[index].price
        orderArray.splice(index, 1)
        orderItemCount--
        renderOrder()
    }
}

function renderOrder() {
    const orderSection = document.getElementById("order-section")

    if (orderItemCount > 0) {
        let orderHTML = `<h2>Your Order</h2>`
        orderArray.forEach((item, index) => {
           orderHTML += `
                <div class="order-item">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <button class="remove-btn" data-remove="${index}">Remove</button>
                    </div>
                    <span class="item-price">$${item.price}</span>
                </div>
            `
        })
        orderHTML += `
            <div class = "total-price">
                <span class = "total-price-text">Total Price:</span>
                <span class = "total-amount">$${totalPrice}</span>
            </div>
            <button id = "complete-order-btn">Complete Order</button>`
        orderSection.innerHTML = orderHTML
        const completeOrderBtn = document.getElementById('complete-order-btn');
        completeOrderBtn.addEventListener('click', function () {
            document.getElementById('payment-modal').style.display = 'block';
        });
    } else {
        orderSection.innerHTML = ''
    }
}

function renderMenuRadios(menu){
    let radioItems = ``
    const menuItems = menu
    for (let item of menuItems){
        radioItems += `
        <div class="menuItem">
            <p class = "item-photo">${item.emoji}</p>
            <div class = "item-description">
                <h4 class = "item-name">${item.name}</h4>
                <p class="item-ingredients">${item.ingredients.join(", ")}</p>
                <p class = "item-price">${item.price}</p>
            </div>
            <button
            type="radio"
            id="${item.name}"
            value="${item.name}"
            data-order = "${item.id}"
            name="menuArray">+
            </button>
        </div>`
    }
    menuRadios.innerHTML = radioItems
}

renderMenuRadios(menuArray)