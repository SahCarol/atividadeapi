const express = require('express')
const app = express()
const { QuickDB } = require('quick.db')
const db = new QuickDB()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/produtos', async (req, res) => {
  const produtos = await db.get('produtos') || []

  res.json(produtos)
})

app.post('/signup', (req, res) => {
  const { usuario, email, senha } = req.body

  if (!usuario || !email || !senha)
    return res.status(400).send('Body inválido.')

  if (db.get(`users.${usuario}`))
    return res.status(400).send('Usuário já existe.')

  db.set(`users.${usuario}`, { email, senha })

  res.send('Usuário cadastrado.')
})

app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body

  const user = await db.get(`users.${usuario}`)
  if (user && user.senha == senha) {
    res.send('Feito login com sucesso.')
  } else {
    res.status(401).send('Senha incorreta para usuário, ou usuário não existe.')
  }
})

app.post('/addProduto', async (req, res) => {
  const { nome, preco, descricao } = req.body

  if (!nome || !preco || !descricao)
    return res.status(400).send('Body inválido.')

  const produtos = await db.get('produtos') || []

  if (produtos[nome]) {
    return res.status(400).send('Produto já existe')
  }

  produtos.push({ nome, preco, descricao })

  db.set('produtos', produtos)
})

app.listen(3000, () => console.log('API rodando na porta 3000'))