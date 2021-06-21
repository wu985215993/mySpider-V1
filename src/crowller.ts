import superagent from 'superagent' //ts引入js ts不会用
import fs from 'fs'
import path from 'path'
//ts -> .d.ts 翻译文件 ->js
import DellAnalyzer from './dellAnalyzer'
// import LeeAnalyzer from './leeAnalyzer'
export interface Analyzer {
  analyze: (html: string, filePath: string) => string
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json')
  //获取html字符串
  private async getRawHtml() {
    const result = await superagent.get(this.url)
    //对rawHtml进行分析
    return result.text
  }
  //写文件的函数
  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }
  //初始化爬虫的进程
  private async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeFile(fileContent)
  }
  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess()
  }
}

const secret = 'x3b174jsx'
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`
// const analyzer = new DellAnalyzer()
const analyzer = DellAnalyzer.getInstance() //单例模式
//将dellAnalyzer改写为单例模式
// const analyzer = new LeeAnalyzer()
new Crowller(url, analyzer)
