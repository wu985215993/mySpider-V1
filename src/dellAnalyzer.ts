import cheerio from 'cheerio' //就可以通过jQ语法去获取页面的内容
import fs from 'fs'
import { Analyzer } from './crowller'
interface Course {
  title: string
  count: number
}
interface courseResult {
  time: number
  data: Course[]
} //定义json的文件结构
interface Content {
  [propName: number]: Course[]
}
export default class DellAnalyzer implements Analyzer {
  private static instance: DellAnalyzer
  public static getInstance() {
    //如果没有实例 则创建了一个实例
    if (!DellAnalyzer.instance) {
      //这样相当于只能在内部new这个实例
      DellAnalyzer.instance = new DellAnalyzer()
    }
    return DellAnalyzer.instance
  }
  //通过获取到html字符串获取需要爬取的数据并返回一个对象 对象接口类型是courseResult
  private getCourseInfo(html: string) {
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
  //将获取到的 courseResult类型的数据存放到磁盘
  private generateJsonContent(courseInfo: courseResult, filePath: string) {
    //得到course.json的文件路径
    let fileContent: Content = {}
    if (fs.existsSync(filePath)) {
      //判断对应路径的文件是否存在
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent //把新爬到的内容存到fileContent
  }

  public analyze(html: string, filePath: string) {
    //将分析的过程移动到这里做
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo, filePath) //生成要存储的内容
    return JSON.stringify(fileContent)
  }
  //单例模式将其构造函数私有化 使其无法在外部实例化
  private constructor() {}
}
