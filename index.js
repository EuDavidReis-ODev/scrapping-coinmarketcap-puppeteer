const app = require('./app')
const crawler = require('./public/javascripts/puppeter_crawler')

app.listen(8080,()=>{
    crawler()
    console.log('Rodando na porta 8080')
})