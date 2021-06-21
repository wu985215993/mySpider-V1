import superagent from 'superagent' //ts引入js ts不会用
import fs from 'fs'
import path from 'path'
//ts -> .d.ts 翻译文件 ->js
import DellAnalyzer from './dellAnalyzer'

class Crowller {
  private secret = 'x3b174jsx'
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
  private filePath = path.resolve(__dirname, '../data/course.json')
  //获取html字符串
  async getRawHtml() {
    const result = await superagent.get(this.url)
    //对rawHtml进行分析
    return result.text
  }
  //写文件的函数
  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }
  //初始化爬虫的进程
  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeFile(fileContent)
  }
  constructor(private analyzer: any) {
    this.initSpiderProcess()
  }
}
const analyzer = new DellAnalyzer()
const crowller = new Crowller(analyzer)
