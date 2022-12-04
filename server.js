import express from 'express';
import { Configuration, OpenAIApi } from 'openai'
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.set('view engine','ejs')
app.set('views' , path.join(__dirname , 'views'))

// Middellwares
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use(express.json())
app.use(express.urlencoded())

// Routes
app.get('/', (req, res) => res.render('index',{error:0}))

app.get('/build',async (req,res)=>res.render('index',{error:0}))

app.post('/build',async (req,res)=>{
  try{

    let prompt = req.body.prompt
    let size =req.body.size

    const response = await openai.createImage({prompt: prompt, size: size, n: 1,})
    const url = response.data.data[0].url

    res.render('build',{url:url, prompt: prompt})
    console.log(url)

  }catch(e){
    res.render('index',{error:1})
  }
})

app.listen(port, () => { console.log(`App listening on port ${port}`) })