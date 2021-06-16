import superagent from 'superagent' //ts引入js ts不会用
import cheerio from 'cheerio' //就可以通过jQ语法去获取页面的内容
//ts -> .d.ts 翻译文件 ->js
interface Course {
  title: string
  count: number
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
    const result = {
      time: new Date().getTime(), //获取时间戳当前的
      data: courseInfos,
    }
    console.log(result)
  }
  async getRawHtml() {
    const result = await superagent.get(this.url)
    //对rawHtml进行分析
    this.getCourseInfo(result.text)
  }
  constructor() {
    this.getRawHtml()
  }
}

const crowller = new Crowller()
