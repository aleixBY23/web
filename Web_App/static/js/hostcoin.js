//contractAddress = '0x9bd113f79D9bCdc27E06bDc5a08A27c274512Ee8'; // SmartContract TokenExchange1
//contractAddress = '0x7Bd57f1a0f45Eb5C005C07Ef09820D92a2299de4';
//contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'; // 4
//contractAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'; // 5
contractAddress = "0x0Ff0705efe9fb8A300047A365f39BEFfA86D7c6f"; // NOSEKIN IA
var walletAddress;
var er;

//Actualitza tots els valors
async function getWalletAddress() {
    // Comprueba si Metamask está instalado
    if (typeof window.ethereum !== 'undefined') {
        // Solicita al usuario el acceso a su cartera
        await window.ethereum.request({method: 'eth_requestAccounts'});
        // Obtiene la instancia de web3
        const web3 = new Web3(window.ethereum);
        // Obtiene la dirección de la cartera actual
        const accounts = await web3.eth.getAccounts();
        walletAddress = accounts[0];
        // Muestra la dirección en la página
        if(document.getElementById('walletAddress') != null) {
            document.getElementById('walletAddress').textContent = `${walletAddress}`;
        }

        // AAA
        getBalances(walletAddress);
    } else {
        // Metamask no está instalado
        alert('Por favor, instala Metamask para utilizar esta función.');
    }
}

//Agafa el valor the ETH i HostCoins, es crida des de getWalletAdress()
function getBalances(walletAddress) {
    console.log("Funcio getBalances")

    const web3 = new Web3(window.ethereum);
    const tokenExchangeContract = new web3.eth.Contract(contractAbi, contractAddress);

    tokenExchangeContract.methods.balances(walletAddress).call((error, balance) => {
        if (error) {
            console.error(error);
        } else {
            console.log(`El saldo de HostCoin en la cartera ${walletAddress} es: ${balance}`);
            document.getElementById('HOCbalance').textContent = `${balance} HOC`;
            if (document.getElementById('HOCbalanceW') != null) {
                document.getElementById('HOCbalanceW').textContent = `${balance} HOC`;
            }
        }
    });

    web3.eth.getBalance(walletAddress)
        .then(balance => {
            const ethBalance = web3.utils.fromWei(balance, 'ether');
            console.log(`El saldo de Ethereum en la cartera ${walletAddress} es: ${ethBalance} ETH`);
            if (document.getElementById('ETHbalance') != null) {
                document.getElementById('ETHbalance').textContent = `${ethBalance} ETH`;
            }

        })
        .catch(error => {
            console.error(error);
        });

}

// Comprar HostCoin
// 0.0001 ether = 1 hostcoin = 0.17~ centims d'euro
async function buyTokens(amount) {
    try {
        await window.ethereum.request({method: 'eth_requestAccounts'});

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];
        const tokenExchangeContract = new web3.eth.Contract(contractAbi, contractAddress);

        const tokenPrice = await tokenExchangeContract.methods.tokenPrice().call();
        const totalCost = tokenPrice * amount;

        await tokenExchangeContract.methods.buyTokens(amount).send({
            from: userAccount,
            value: totalCost.toString()
        });

        console.log('Tokens comprados exitosamente');
        // Realiza cualquier acción adicional después de comprar los tokens

    } catch (error) {
        console.error('Error al comprar tokens:', error);
    }
}

async function spendHostCoins(amount) {
    try {
        // Solicitar permiso al usuario para acceder a su cuenta de Ethereum
        await window.ethereum.request({method: 'eth_requestAccounts'});

        // Obtener la cuenta del usuario actual
        const web3 = new Web3(window.ethereum);
        const tokenExchangeContract = new web3.eth.Contract(contractAbi, contractAddress);
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];

        // Llamar a la función spendTokens del contrato HostCoinSale para gastar los HostCoin
        await tokenExchangeContract.methods.spendTokens(amount).send({from: userAccount});

        console.log(`Se han gastado ${amount} HostCoin`);
    } catch (error) {
        console.error('Error al gastar HostCoin:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getWalletAddress(); // Llama a la función cuando la página esté cargada
});


contractAbi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenPrice",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensSpent",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balances",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "spendTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]