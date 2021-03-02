const app = require('./public/javascripts/app')
const crawler = require('./public/javascripts/puppeter_crawler')
const PORT = process.env.PORT || '8080'
app.listen(PORT,()=>{
    crawler()
    console.log('Rodando na porta '+PORT)
})