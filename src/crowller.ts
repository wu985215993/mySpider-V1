import superagent from 'superagent' //ts引入js ts不会用
import cheerio from 'cheerio' //就可以通过jQ语法去获取页面的内容
import fs from 'fs'
import path from 'path'
//ts -> .d.ts 翻译文件 ->js
interface Course {
  title: string
  count: number
}
interface courseResult {
  time: number
  data: Course[]
}
//定义json的文件结构
interface Content {
  [propName: number]: Course[]
}

class Crowller {
  private secret = 'x3b174jsx'
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
  getCourseInfo(html: string) {
    //通过cheerio分析
    const $ = cheerio.load(html)
    const courseItems = $('.course-item')
    const courseInfos: Course[] = []
    courseItems.map((index, ele) => {
      const descs = $(ele).find('.course-desc')
      const title = descs.eq(0).text() //爬取每个课程的标题
      const count = parseInt(descs.eq(1).text().split('：')[1]) //获取观看人数
      courseInfos.push({ title, count })
    })
    return {
      time: new Date().getTime(), //获取时间戳当前的
      data: courseInfos,
    }
  }
  async getRawHtml() {
    const result = await superagent.get(this.url)
    //对rawHtml进行分析
    return result.text
  }
  generateJsonContent(courseInfo: courseResult) {
    //得到course.json的文件路径
    const filePath = path.resolve(__dirname, '../data/course.json')
    let fileContent: Content = {}
    if (fs.existsSync(filePath)) {
      //判断对应路径的文件是否存在
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent //把新爬到的内容存到fileContent
  }
  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo)
    const filePath = path.resolve(__dirname, '../data/course.json')
    fs.writeFileSync(filePath, JSON.stringify(fileContent))
  }
  constructor() {
    this.initSpiderProcess()
  }
}

const crowller = new Crowller()
