const Utils = {
    toggle() {
        document.querySelector(".menu").classList.toggle('toggle')
    },
    formatAmount(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount)
    }
}
const storage = {
    get() {
        return JSON.parse(localStorage.getItem('controle-financeiro:transactions')) || []
    },
    set(transactions) {
        localStorage.setItem('controle-financeiro:transactions', JSON.stringify(transactions))
    }
}

const Transaction = {
    all: storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    deposit() {
        let deposit = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.type === "deposit") deposit += Number(transaction.amount);
        })

        return deposit;
    },
    buy() {
        let buy = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.type === "buy") buy += Number(-transaction.amount);
        })

        return Number(buy);

    },
    total() {
        return Transaction.deposit() + Transaction.buy();
    }
}

const Form = {
    name: document.querySelector('#name-transaction'),
    type: document.querySelector('#type-transaction'),
    amount: document.querySelector('#amount-transaction'),

    getValues() {
        return {
            name: Form.name.value,
            type: Form.type.value,
            amount: Form.amount.value
        }
    },
    validateFields() {
        const { name, type, amount } = Form.getValues();
        if (name.trim() === "" ||
            type.trim() === "" ||
            amount.trim() === "") {
            throw new Error("Por Favor, preencha todos os campos!")
        }
    },
    clearFields() {
        Form.name.value = ""
        Form.amount.value = ""
    },
    submit(event) {
        event.preventDefault()
        try {
            Form.validateFields()
            const transaction = Form.getValues()
            Form.clearFields()
            Transaction.add(transaction)
        } catch (e) {
            alert(e.message)
        }
    }
}
const DOM = {
    transactionContainer: document.querySelector(".table-transactions tbody"),
    total: document.querySelector(".table-transactions tfoot"),
    addTransaction(transaction) {
        const tr = document.createElement("tr")
        tr.innerHTML = DOM.innerHtmlTransactionItem(transaction)
        DOM.transactionContainer.appendChild(tr)
    },

    innerHtmlTransactionItem(transaction) {

        const html = `
        
        <td>${(transaction.type === "buy") ? "-" : "+"}</td>
        <td> ${transaction.name}</td>
        <td>${Utils.formatAmount(transaction.amount)}</td>
        `

        return html
    },
    innerHTMLFootBalance() {

        const html = `   
        <tr>
        <td></td>
        <td>Total</td>
        <td>
         ${Utils.formatAmount(Transaction.total())}
         ${(Transaction.total()>0) ? "<span>[Lucro]</span>" : "<span>[Prejuizo]</span>"}  
        </td>
        </tr>`
        return html

    },
    updateBalance() {
        DOM.total.innerHTML = DOM.innerHTMLFootBalance()
    },
    clearTransactions() {
        DOM.transactionContainer.innerHTML = ""
    }

}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()
        storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()