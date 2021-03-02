const puppeteer = require('puppeteer')
const autoScroll = require('./autoscroll_page')
const salvaCotacao = require('./manager-database')
const dbManager = require('./manager-database')

var splitArrayValores =  (arr) =>{
        `console.log("Indices do arrayValores:::::::"+arr.length)
        console.log("Indices:::"+arr[199])
        console.log("Valores:::"+arr[198])`


        var valores = []
        var volumes = []
        arr.reverse()
        var length = arr.length
        for(var i=0;i<=length;i++){
                
                if(arr.length%2!=0){
                        volumes.push(arr.pop())
                }else{
                        valores.push(arr.pop())
                }
        }

        /*console.log('Valores:')
        console.log(valores)
        console.log("--------------------------------------------")
        console.log('Volumes:')
        console.log(volumes)*/

        return {'valores': valores, 'volumes': volumes}
}

var splitArrayIndices =  (arr) =>{
        var capsDeMercado = []
        var indices = []
        arr.reverse()
        var length = arr.length
        for(var i=0;i<=length;i++){
                
                if(arr.length%2!=0){
                        capsDeMercado.push(arr[arr.length-1])
                }else{
                        indices.push(arr[arr.length-1])
                }
                arr.pop()
        }

        /*console.log('Indices:')
        console.log(indices)
        console.log("--------------------------------------------")
        console.log('Cap de Mercado:')
        console.log(capsDeMercado)
        */

        return {'capsDeMercado': capsDeMercado, 'indices': indices}
}

var scrapeData = async () => {

        console.log("Coletando dados...")
        console.time("coletando")
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://coinmarketcap.com',{"waitUntil" : "networkidle0", 'timeout': 0})
        await autoScroll(page)
        const result = await page.evaluate(() => {
        const names = []
        const abrevNames = []
        const precosEVolumes = []
        const linksGraphImgs = []
        const linkImgs = []
        const fornecimentoCirculando = []
        const indicesECapDeMercado = []

        try{
        document.querySelectorAll('div > table > tbody > tr > td > a > div > img')
                .forEach((book) => linkImgs.push(book.getAttribute('src')))
        }catch(err){
                console.log("Erro ao capturar links dos icones.")
                console.log(err)

        }

        try{
        document.querySelectorAll('div > table > tbody > tr > td > a > div > div > p')
                .forEach((book) => names.push(book.textContent))
        }catch(err){
                console.log("Erro ao capturar nomes.")
                console.log(err)

        }

                console.log(names.length)
        try{
        document.querySelectorAll('div > table > tbody > tr > td > a > div > div > div > p')
            .forEach((book) => abrevNames.push(book.textContent))
        }catch(err){
                console.log("Erro ao capturar abreviação dos nomes.")
                console.log(err)

        }

        try{
        document.querySelectorAll('div > table > tbody > tr > td > a > img')
            .forEach((book) => linksGraphImgs.push(book.getAttribute('src')))
        }catch(err){
                console.log("Erro ao capturar link das imgs dos gráficos.")
                console.log(err)

        }


        console.log('Coletando preços e volumes de negociação...')    
        
        try{
        //A cada 2 valores troca de cripto, primeiro preço depois volume       
        document.querySelectorAll('div > table > tbody > tr > td > div > a')
            .forEach((book) => precosEVolumes.push(book.textContent))
        }catch(err){
                console.log("Erro ao capturar valores dos preços e volumes.")
                console.log(err)

        }
          
        try{
        //A cada 2 valores troca de cripto, primeiro indice depois cap de mercado        
        document.querySelectorAll('div > table > tbody > tr > td > p')
                .forEach((book) => indicesECapDeMercado.push(book.textContent))
        }catch(err){
                console.log("Erro ao capturar indices e caps de mercado.")
                console.log(err)

        }

        try{
        document.querySelectorAll('div > table > tbody > tr > td > div > div > p')
                .forEach((book) => fornecimentoCirculando.push(book.textContent))
        }catch(err){
                console.log("Erro ao capturar os valores dos fornecimentos circulando.")
                console.log(err)

        }

        console.log(names[0]+" "+abrevNames[0]+" "+precosEVolumes[0]+" "+precosEVolumes[1])
        var dados = {
                'arrayNome': names,
                'arrayAbrev': abrevNames,
                'arrayIndiceECapDeMercado':indicesECapDeMercado,
                'arrayPrecoEVolume': precosEVolumes,
                'arrayLinksGraphImg' :linksGraphImgs,
                'arrayLinkIcon':linkImgs,
                'arrayFornecimentoCirculando':fornecimentoCirculando

        }
    return dados
  })
  browser.close()
  console.timeEnd("coletando")
  console.log('Dados recebidos.')
  return result
}

function montaDados(arrIndice,arrAbrev,arrNome,arrValor,arrVolume,arrCapMercado,arrLinkIcon,arrLinkGraph){
        const cotacao = {
                'indice': arrIndice,
                'abreviacao': arrAbrev,
                'nome': arrNome,
                'valor':arrValor,
                'volume': arrVolume,
                'capdemercado': arrCapMercado,
                'linkIcon': arrLinkIcon,
                'linkGraph': arrLinkGraph
        }
        salvaCotacao(JSON.parse(JSON.stringify(cotacao)))

        for(var i=0;i<arrNome.length;i++){
                console.log(arrIndice[i]+" "+arrAbrev[i]+" "+arrNome[i]+" valor:"+arrValor[i]+" volume:"+arrVolume[i]+" cap de mercado:"+arrCapMercado[i])
        }
}

module.exports = function coletaDados(){  
scrapeData().then((value) => {
        //console.log('Quantia de indices:::'+value.arrayIndiceECapDeMercado.length)
        console.log('Processando...')
        console.time("processando")
        var indiceECap = splitArrayIndices(value.arrayIndiceECapDeMercado)
        var precoEVol = splitArrayValores(Object.values(value.arrayPrecoEVolume))
        //console.log(value.arrayIndiceECapDeMercado)
        montaDados(indiceECap.indices,value.arrayAbrev,value.arrayNome,precoEVol.valores,precoEVol.volumes,indiceECap.capsDeMercado,value.arrayLinkIcon,value.arrayLinksGraphImg)
        console.timeEnd("processando")

})
}