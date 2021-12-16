const Utils = {
    toggle() {
        document.querySelector(".menu").classList.toggle('toggle')
    }
}
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('controle-financeiro:transactions')) || []
    },
    set(transactions) {
        localStorage.setItem('controle-financeiro:transactions', JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
    }
}
const DOM = {
    innerHtmlTransaction(transaction) {
        const html = `
        <tr>
        <td>+</td>
        <td> Lorem ipsum dolor sit amet consectetur adipisicing elit.</td>
        <td>R$ 12.999,99 </td>
        </tr>`
    },

}